import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as Case from 'case';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit.js';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_year_view.js';
import { map } from 'rxjs/operators';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { Event } from '../models/event';
import { Type } from '../models/type';
import { EventService } from '../services/event.service';
import { TypeService } from '../services/type';

declare let scheduler: any;

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulerComponent implements OnInit, OnDestroy {
  constructor(private typeService: TypeService, private eventService: EventService, private modalService: NgbModal) {}

  @ViewChild('scheduler')
  schedulerRef: ElementRef;

  types: Type[] = [];

  ngOnInit() {
    scheduler.skin = 'material';
    scheduler.config.xml_date = '%Y-%m-%d %H:%i';
    scheduler.config.first_hour = 7;
    scheduler.config.now_date = new Date();

    this.typeService.get().subscribe((types: Type[]) => {
      this.types = types;
    });

    this.eventService
      .get()
      .pipe(map((events: Event[]) => this.format(events)))
      .subscribe((data: Event[]) => {
        scheduler.parse(data, 'json');
      });

    scheduler.templates.event_class = (_start: any, _end: any, event: Event) => {
      return event.type ? 'event_' + this.getLabel(event.type) : '';
    };

    scheduler.init(this.schedulerRef.nativeElement, new Date(), 'month');

    scheduler.attachEvent('onEventAdded', (id: number, event: Event) => {
      this.eventService.insert(this.serializeEvent(event, true)).subscribe(data => {
        if (data.id !== id) {
          scheduler.changeEventId(id, data.id);
        }
      });
    });

    scheduler.attachEvent('onEventChanged', (_: number, event: Event) => {
      this.eventService.update(this.serializeEvent(event));
    });

    scheduler.attachEvent('onEventDeleted', (id: number) => {
      this.eventService.remove(id);
    });

    scheduler.showLightbox = (id: any) => {
      const event = scheduler.getEvent(id);
      scheduler.startLightbox(id, this.openModal(event));
    };
  }

  private format(events: Event[]) {
    events.map((event: Event) => {
      return Object.assign(event, { start_date: new Date(event.start_date), end_date: new Date(event.end_date) });
    });
    return events;
  }

  private serializeEvent(event: Event, insert: boolean = false): Event {
    const result = new Event();

    for (const i in event) {
      if (i.charAt(0) === '$' || i.charAt(0) === '_' || (insert && i === 'id')) {
        continue;
      }

      result[i] = event[i] instanceof Date ? scheduler.templates.xml_format(event[i]) : event[i];
    }
    return result as Event;
  }

  private getLabel(type: Type) {
    const result = this.types.find(data => data.key === type.key);
    return result && Case.snake(result.label);
  }

  addEvent() {
    scheduler.addEventNow();
  }

  ngOnDestroy(): void {
    scheduler.clearAll();
  }

  openModal(event: Event) {
    const modalRef = this.modalService.open(FormModalComponent, { centered: true });
    modalRef.componentInstance.isNew = scheduler.getState().new_event;
    modalRef.componentInstance.event = event;
    modalRef.componentInstance.saved.subscribe((savedEvent: Event) => this.save(savedEvent));
    modalRef.componentInstance.deleted.subscribe(() => this.delete());

    modalRef.result
      .then()
      .catch(reason => {
        if (reason !== ModalDismissReasons.ESC && reason !== ModalDismissReasons.BACKDROP_CLICK) {
          console.log(reason);
        }
      })
      .finally(() => scheduler.endLightbox(false, null));
  }

  save(savedEvent: Event) {
    let event = scheduler.getEvent(scheduler.getState().lightbox_id);
    event = Object.assign(event, savedEvent, { id: event.id });
    scheduler.endLightbox(true, null);
  }

  delete() {
    const id = scheduler.getState().lightbox_id;
    scheduler.deleteEvent(id);
  }
}
