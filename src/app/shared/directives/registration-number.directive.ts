import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRegistrationNumber]'
})
export class RegistrationNumberDirective {

  constructor(private el: ElementRef) {}

  // @HostListener('input', ['$event']) onInput(event: any): void {
  //   const input = event.target;

  //   if (!input) {
  //     return;
  //   }

  //   const value = input.value;
  //   const formattedValue = this.formatVehicleNumber(value);

  //   this.control.control?.setValue(formattedValue, { emitEvent: false });
  // }

  // private formatVehicleNumber(value: string): string {
  //   // Remove existing hyphens
  //   const sanitizedValue = value.replace(/-/g, '');

  //   // Insert hyphen after the ending of consecutive alphabets or consecutive numbers
  //   const formattedValue = sanitizedValue.replace(/([A-Za-z]+|[0-9]+)/g, '$1-');

  //   // Remove the trailing hyphen
  //   return formattedValue.replace(/-$/, '');
  // }

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    let sanitizedValue = input.value.replace(/[^a-zA-Z0-9- ]/g, '');

    /**
     *  Remove space at the beginning
     */
    if (sanitizedValue.startsWith(' ')) {
      sanitizedValue = sanitizedValue.trimStart();
    }

    input.value = sanitizedValue;
  }

}
