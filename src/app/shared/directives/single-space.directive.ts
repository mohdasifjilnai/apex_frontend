import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSingleSpace]',
})
export class SingleSpaceDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // 1. Prevent leading spaces
    value = value.replace(/^\s+/, '');

    // 2. Replace multiple spaces with a single space
    value = value.replace(/\s{2,}/g, ' ');

    input.value = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;

    // Prevent space as first character
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }

    // Prevent consecutive spaces while typing
    const currentValue = input.value;
    const cursorPos = input.selectionStart ?? 0;

    if (event.key === ' ' && currentValue[cursorPos - 1] === ' ') {
      event.preventDefault();
    }
  }
}
