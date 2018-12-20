import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_year_view.js';
import 'dhtmlx-scheduler/codebase/ext/dhtmlxscheduler_limit.js';
import { Event } from '../models/event';
import { EventService } from '../services/event.service';

declare let scheduler: any;

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [EventService],
  encapsulation: ViewEncapsulation.None
})
export class SchedulerComponent implements OnInit, OnDestroy {
  readonly types = [
    { key: null, label: 'Select event type' },
    { key: 1, label: 'Rest' },
    { key: 2, label: 'Meeting' },
    { key: 3, label: 'Movies' },
    { key: 4, label: 'Work' }
  ];

  constructor(private eventService: EventService) {}

  @ViewChild('scheduler')
  schedulerRef: ElementRef;

  ngOnInit() {
    scheduler.skin = 'material';
    scheduler.config.xml_date = '%Y-%m-%d %H:%i';
    scheduler.config.first_hour = 7;
    scheduler.config.now_date = new Date();
    scheduler.config.details_on_create = true;
    scheduler.locale.labels.section_type = 'Event type';

    scheduler.config.lightbox.sections = [
      { name: 'description', height: 43, map_to: 'text', type: 'textarea', focus: true },
      { name: 'type', height: 20, type: 'select', options: this.types, map_to: 'type' },
      { name: 'time', height: 72, type: 'time', map_to: 'auto' }
    ];

    scheduler.templates.event_class = (_start: any, _end: any, event: Event) => {
      return event.type ? 'event_' + this.getLabel(+event.type) : '';
    };

    scheduler.init(this.schedulerRef.nativeElement, new Date(), 'month');

    this.eventService.get().subscribe(data => {
      scheduler.parse(data, 'json');
    });

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

  private getLabel(key: number) {
    const result = this.types.find(type => type.key === key);
    return result && result.label.toLowerCase();
  }

  addEvent() {
    scheduler.addEventNow();
  }

  ngOnDestroy(): void {
    scheduler.clearAll();
  }
}
