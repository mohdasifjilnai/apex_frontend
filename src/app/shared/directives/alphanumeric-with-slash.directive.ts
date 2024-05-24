import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphanumericWithSlash]',
})
export class AlphanumericWithSlashDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const newValue = value.replace(/[^a-zA-Z0-9/-]/g, '');
    this.ngControl?.valueAccessor?.writeValue(newValue);
  }
}
