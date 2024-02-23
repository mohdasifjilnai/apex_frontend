import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]',
})
export class AlphaNumericDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    let sanitizedValue = input.value.replace(/[^a-zA-Z0-9 ]/g, '');

    /**
     *  Remove space at the beginning
     */
    if (sanitizedValue.startsWith(' ')) {
      sanitizedValue = sanitizedValue.trimStart();
    }

    input.value = sanitizedValue;
  }
}
