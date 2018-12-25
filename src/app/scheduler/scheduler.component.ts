import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Case from 'case';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit.js';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_year_view.js';
import { map } from 'rxjs/operators';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { ModalResult } from '../models/enums';
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
    scheduler.config.limit_time_select = true;
    scheduler.config.details_on_create = true;
    scheduler.config.details_on_dblclick = true;
    scheduler.config.icons_select = ['icon_details', 'icon_delete'];
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

    scheduler.attachEvent('onEventAdded', (id: number, event: Event) => {
      this.eventService.insert(this.serializeEvent(event, true)).subscribe(data => {
        if (data.id !== id) {
          scheduler.changeEventId(id, data.id);
        }
      });
    });

    scheduler.attachEvent('onEventChanged', (id: number, event: Event) => {
      this.eventService.update(this.serializeEvent(event));
    });

    scheduler.attachEvent('onEventDeleted', (id: number) => {
      this.eventService.remove(id);
    });

    scheduler.attachEvent('onTemplatesReady', () => {
      scheduler.templates.event_text = (_start: any, _end: any, event: Event) => {
        return '<b>' + event.text + '</b><br><i>' + event.type.label + '</i>';
      };
    });

    scheduler._click.buttons.delete = (id: number) => {
      const event = scheduler.getEvent(id);
      this.openConfirm(event);
    };

    scheduler.showLightbox = (id: any) => {
      const event = scheduler.getEvent(id);
      scheduler.startLightbox(id, this.openForm(event));
    };

    scheduler.init(this.schedulerRef.nativeElement, new Date(), 'month');
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

  openForm(event: Event) {
    const modalRef = this.modalService.open(FormModalComponent, { centered: true });
    modalRef.componentInstance.isNew = scheduler.getState().new_event;
    modalRef.componentInstance.event = event;
    modalRef.componentInstance.saved.subscribe((changedEvent: Event) => this.save(changedEvent));
    modalRef.componentInstance.deleted.subscribe(() => this.delete(event.id));

    modalRef.result
      .then()
      .catch((reason: ModalResult | any) => {
        if (this.isError(reason)) {
          console.error(reason);
        }
      })
      .finally(() => scheduler.endLightbox(false, null));
  }

  openConfirm(event: Event) {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
    modalRef.componentInstance.deleted.subscribe(() => this.delete(event.id));

    modalRef.result.then().catch((reason: ModalResult | any) => {
      if (this.isError(reason)) {
        console.error(reason);
      }
    });
  }

  isError(reason: ModalResult | any): boolean {
    return ![ModalResult.ESC, ModalResult.BACKDROP_CLICK, ModalResult.CLOSE, ModalResult.CANCEL].includes(reason);
  }

  save(changedEvent: Event) {
    let event = scheduler.getEvent(scheduler.getState().lightbox_id);
    event = Object.assign(event, changedEvent, { id: event.id });
    scheduler.endLightbox(true, null);
  }

  delete(id: number) {
    scheduler.deleteEvent(id);
  }
}
