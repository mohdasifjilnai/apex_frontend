import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveZeroFromStarting]',
})
export class RemoveZeroFromStartingDirective {
  constructor() {}
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Check if the pressed key is '0' and if the cursor is at the beginning of the input
    if (
      event.key === '0' &&
      (event.target as HTMLInputElement).selectionStart === 0
    ) {
      event.preventDefault(); // Prevent typing '0' at the beginning
    }
  }
}
