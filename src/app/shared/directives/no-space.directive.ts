import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputText = (event.target as HTMLInputElement).value;

    // Check if input starts with space
    if (inputText.startsWith(' ')) {
      (event.target as HTMLInputElement).value = inputText.trimStart();
    }

    // Check if there are consecutive spaces
    if (/\s{2,}/.test(inputText)) {
      (event.target as HTMLInputElement).value = inputText.replace(/\s{2,}/g, ' ');
    }
  }

}
