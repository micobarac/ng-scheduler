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
    this.form = this.formBuilder.group(
      {
        type: [null, [Validators.required, keyValidator]],
        user: [null, [Validators.required, idValidator]],
        start_date: [this.now, [Validators.required, dateTimeValidator]],
        end_date: [this.now, [Validators.required, dateTimeValidator]],
        text: ['', Validators.required]
      },
      { updateOn: 'change' }
    );

    if (!this.isNew) {
      this.form.patchValue({ ...this.event });
    }
  }

  submit() {
    const event = this.form.value as Event;
    this.saved.emit({ ...event });
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
