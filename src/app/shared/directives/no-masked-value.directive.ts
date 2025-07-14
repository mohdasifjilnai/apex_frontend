import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appNoMaskedValue]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoMaskedValueDirective,
      multi: true
    }
  ]
})
export class NoMaskedValueDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string' && (value.includes('***'))) {
      return { invalidEngineNumber: true };
    }
    return null;
  }
}
