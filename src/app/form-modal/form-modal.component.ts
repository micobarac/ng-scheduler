import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../models/event';
import { Type } from '../models/type';
import { User } from '../models/user';
import { TypeService } from '../services/type';
import { UserService } from '../services/user.service';
import { dateTimeValidator, idValidator, keyValidator } from '../validators/validators';

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent implements OnInit {
  @Input() isNew: boolean;
  @Input() event: Event;
  @Output() saved: EventEmitter<Event> = new EventEmitter();
  @Output() deleted: EventEmitter<Event> = new EventEmitter();

  now = new Date();
  form: FormGroup;
  types: Type[] = [];
  users: User[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private typeService: TypeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getTypes();
    this.getUsers();
    this.createForm();
  }

  compareById(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareByKey(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.key === c2.key : c1 === c2;
  }

  private getTypes() {
    this.typeService.get().subscribe((types: Type[]) => (this.types = types));
  }

  private getUsers() {
    this.userService.get().subscribe((users: User[]) => (this.users = users));
  }

  private createForm() {
    this.form = this.formBuilder.group({
      type: [null, [Validators.required, keyValidator]],
      user: [null, [Validators.required, idValidator]],
      startDate: [this.now, [Validators.required, dateTimeValidator]],
      endDate: [this.now, [Validators.required, dateTimeValidator]],
      text: ['', Validators.required]
    });

    if (!this.isNew) {
      this.form.patchValue({
        id: this.event.id,
        type: this.event.type,
        user: this.event.user,
        startDate: this.event.start_date,
        endDate: this.event.end_date,
        text: this.event.text
      });
    }
  }

  submit() {
    const data = this.form.value;
    const event = new Event();
    event.id = data.id;
    event.type = data.type;
    event.user = data.user;
    event.start_date = data.startDate;
    event.end_date = data.endDate;
    event.text = data.text;
    this.saved.emit(event);
    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close();
  }

  delete() {
    this.deleted.emit();
    this.activeModal.close();
  }
}
