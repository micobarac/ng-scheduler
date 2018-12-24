import { NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

export interface NgbDateTimeStruct extends NgbDateStruct, NgbTimeStruct {}

export class DateTimeModel implements NgbDateTimeStruct {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;

  timeZoneOffset: number;

  public constructor(init?: Partial<DateTimeModel>) {
    Object.assign(this, init);
  }

  public static fromLocal(value: NgbDateStruct | Date): DateTimeModel {
    const date = value instanceof Date ? (value as Date) : new Date(value.year, value.month - 1, value.day);
    const isValidDate = !isNaN(date.valueOf());

    if (!date || !isValidDate) {
      return null;
    }

    return new DateTimeModel({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      timeZoneOffset: date.getTimezoneOffset()
    });
  }

  private isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  public toDate(): Date {
    if (this.isInteger(this.year) && this.isInteger(this.month) && this.isInteger(this.day)) {
      if (!this.hour) {
        this.hour = 0;
      }
      if (!this.minute) {
        this.minute = 0;
      }
      if (!this.second) {
        this.second = 0;
      }
      if (!this.timeZoneOffset) {
        this.timeZoneOffset = new Date().getTimezoneOffset();
      }

      const date = new Date(
        Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second) + this.timeZoneOffset * 6e4
      );
      return date;
    }

    return null;
  }
}
