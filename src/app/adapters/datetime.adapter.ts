import { Injectable } from '@angular/core';
import { NgbTimeAdapter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class NgbTimeDateAdapter extends NgbTimeAdapter<Date> {
  fromModel(date: Date): NgbTimeStruct {
    return date
      ? {
          hour: date.getHours(),
          minute: date.getMinutes(),
          second: 0
        }
      : null;
  }

  toModel(date: NgbTimeStruct): Date {
    return date ? new Date(0, 0, 0, date.hour, date.minute, date.second) : null;
  }
}
