import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRegistrationNumber]',
})
export class RegistrationNumberDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = this.el.nativeElement;
    const caretStart: any = input.selectionStart; // Store the start position of the cursor
    const caretEnd: any = input.selectionEnd; // Store the end position of the cursor

    // Remove existing hyphens
    let value = input.value.replace(/-/g, '');

    // Format the value
    if (value.length > 2) {
      value = value.substring(0, 2) + '-' + value.substring(2);
    }
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5);
    }

    // Calculate the new cursor position
    let newCaretStart: any = caretStart;
    let newCaretEnd: any = caretEnd;
    const diff = value.length - input.value.length;

    if (caretStart === caretEnd) {
      // If cursor is not a selection
      newCaretStart += diff;
      newCaretEnd += diff;
    } else {
      // If cursor is a selection
      const selectionLength = caretEnd - caretStart;
      newCaretStart +=
        (diff > 0 ? 1 : -1) * Math.min(selectionLength, Math.abs(diff));
      newCaretEnd +=
        (diff > 0 ? 1 : -1) * Math.min(selectionLength, Math.abs(diff));
    }

    // Update the input value
    input.value = value;

    // Restore cursor position
    input.setSelectionRange(newCaretStart, newCaretEnd);
  }
}
