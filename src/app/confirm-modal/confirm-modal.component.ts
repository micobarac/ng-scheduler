import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalResult } from '../models/enums';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Output() deleted: EventEmitter<Event> = new EventEmitter();

  ModalResult = ModalResult;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {}

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
