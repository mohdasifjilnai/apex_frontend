import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSpecialCharcaterExceptAt]'
})
export class SpecialCharcaterExceptAtDirective {

  constructor() { }

  @HostListener('input', ['$event']) onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-z_A-Z0-9@.]/g, '');
  }

}
