import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbDatepicker, NgbPopover, NgbPopoverConfig, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { DateTimeModel } from './datetime.model';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input()
  date: Date;

  @Input()
  format = 'yyyy-MM-dd HH:mm';

  @Input()
  hourStep = 1;

  @Input()
  minuteStep = 15;

  @Input()
  disabled = false;

  private showTimePicker = false;

  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  private ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private injector: Injector) {
    this.config.autoClose = 'outside';
    this.config.placement = 'auto';
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe(() => {
      this.showTimePicker = false;
    });
  }

  writeValue(newDate: Date) {
    if (newDate) {
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocal(newDate));
      this.date = newDate;
      this.setDate();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggleDateTimeState($event: Event) {
    this.showTimePicker = !this.showTimePicker;
    $event.stopPropagation();
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocal(value);

    if (dt) {
      this.datetime = dt;
      this.setDate();
    } else if (value.trim() === '') {
      this.datetime = new DateTimeModel();
      this.date = null;
      this.onChange(this.date);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: any) {
    const date = DateTimeModel.fromLocal($event);

    if (!date) {
      return;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    this.dp.navigateTo({ year: this.datetime.year, month: this.datetime.month });
    this.setDate();
  }

  onTimeChange(time: NgbTimeStruct) {
    if (!time) {
      return null;
    }

    this.datetime.hour = time.hour;
    this.datetime.minute = time.minute;
    this.datetime.second = time.second;

    this.setDate();
  }

  setDate() {
    this.date = this.datetime.toDate();

    if (!this.firstTimeAssign) {
      this.onChange(this.date);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.date !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur() {
    this.onTouched();
  }
}
