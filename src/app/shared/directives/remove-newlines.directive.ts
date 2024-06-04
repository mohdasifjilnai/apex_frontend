import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
  selector: '[appRemoveNewlines]'
})
export class RemoveNewlinesDirective {

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('blur')
  onBlur() {
    // Get the current value of the control
    let value = this.control.control?.value;

    // Replace newlines with spaces if value exists
    if (value) {
      value = value.replace(/\n/g, ' ');
      this.control.control?.setValue(value, { emitEvent: false });
    }
  }

}
