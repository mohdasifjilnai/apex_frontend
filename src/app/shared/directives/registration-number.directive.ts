import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRegistrationNumber]'
})
export class RegistrationNumberDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove existing hyphens
    const sanitizedValue = value.replace(/-/g, '');

    if (sanitizedValue.length < 7) {
      const formattedValue = sanitizedValue.replace(/(.{2})/g, '$1-');
      value = formattedValue.replace(/-$/, '');
    } else {
      value = sanitizedValue.replace(/([A-Za-z]+|[0-9]+)/g, '$1-');
      value = value.replace(/-$/, '');

    }

    // Update the input value
    input.value = value;
  }

  // @HostListener('input', ['$event']) onInput(event: InputEvent): void {
  //   const input = event.target as HTMLInputElement;
  //   let sanitizedValue = input.value.replace(/[^a-zA-Z0-9- ]/g, '');

  //   /**
  //    *  Remove space at the beginning
  //    */
  //   if (sanitizedValue.startsWith(' ')) {
  //     sanitizedValue = sanitizedValue.trimStart();
  //   }

  //   input.value = sanitizedValue;
  // }

}
