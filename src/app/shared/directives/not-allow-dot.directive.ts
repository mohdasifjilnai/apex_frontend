import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNotAllowDot]',
})
export class NotAllowDotDirective {
  constructor(private control: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputValue = this.control.value;
    const inputElement = event.target as HTMLInputElement;
    const caretPosition = inputElement.selectionStart ?? 0;

    // Check if the pressed key is a dot
    if (event.key === '.') {
      // Check if there are consecutive dots before or after the caret
      if (
        (inputValue.charAt(caretPosition - 1) === '.' && event.key === '.') ||
        (inputValue.charAt(caretPosition) === '.' && event.key === '.')
      ) {
        event.preventDefault();
      }
    }
  }
}
