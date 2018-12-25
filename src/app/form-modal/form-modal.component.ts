import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../models/event';
import { Type } from '../models/type';
import { User } from '../models/user';
import { TypeService } from '../services/type';
import { UserService } from '../services/user.service';
import { dateTimeValidator, idValidator, keyValidator } from '../validators/validators';
import { ModalResult } from '../models/enums';

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
    public modal: NgbActiveModal,
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

    this.form.patchValue({ ...this.event });
  }

  save() {
    const event = this.form.value as Event;
    this.saved.emit({ ...event });
    this.modal.close(ModalResult.SAVE);
  }

  close() {
    this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }

  delete() {
    this.deleted.emit();
    this.modal.close(ModalResult.DELETE);
  }
}
