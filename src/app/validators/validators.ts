import { AbstractControl } from '@angular/forms';

export function idValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = control.value && control.value.id;
  return valid ? null : { invalidId: { valid: false, value: control.value } };
}

export function keyValidator(control: AbstractControl): { [key: string]: any } | null {
  const valid = control.value && control.value.key;
  return valid ? null : { invalidKey: { valid: false, value: control.value } };
}

export function dateTimeValidator(control: AbstractControl): { [key: string]: any } | null {
  const date = new Date(control.value);
  const isValid = !isNaN(date.valueOf());

  return isValid ? null : { invalidDateTime: { valid: false, value: control.value } };
}
