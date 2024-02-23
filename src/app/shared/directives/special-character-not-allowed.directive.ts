import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSpecialCharacterNotAllowed]',
})
export class SpecialCharacterNotAllowedDirective {
  constructor() {}

  /**
   * Removes all special characters except alphanumeric and '.' from an input field.
   */
  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z0-9@.]/g, '');
  }
}
