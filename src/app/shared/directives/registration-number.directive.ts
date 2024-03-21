import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRegistrationNumber]',
})
export class RegistrationNumberDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    this.handleInput();
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    /**
     * Delay execution to ensure the value is pasted before handling it
     */
    setTimeout(() => this.handleInput(), 0);
  }

  /**
   * Formats the input value of the element.
   *
   * @param input - the input element
   */
  private handleInput(): void {
    const input = this.el.nativeElement;
    const caretStart = input.selectionStart; // Store the start position of the cursor
    const caretEnd = input.selectionEnd; // Store the end position of the cursor

    /**
     * Delay execution to ensure the value is updated before restoring cursor position
     */
    setTimeout(() => {
      let value = input.value;
      /**
       * Remove existing hyphens
       */
      const sanitizedValue = value.replace(/-/g, '');

      if (sanitizedValue.length < 7) {
        const formattedValue = sanitizedValue.replace(/(.{2})/g, '$1-');
        value = formattedValue.replace(/-$/, '');
      } else {
        /**
         * Add hyphen between consecutive numbers or letters after the 4th character
         */
        const prefix = sanitizedValue.substring(0, 2);
        const prefix2 = sanitizedValue.substring(2, 4);
        const postfix = sanitizedValue.substring(4);
        const formattedPostfix = postfix.replace(/([A-Za-z]+|[0-9]+)/g, '$1-');
        value = `${prefix}-${prefix2}-${formattedPostfix.replace(/-$/, '')}`;
      }

      /**
       * Update the input value
       */
      input.value = value;

      /**
       * Restore cursor position
       */
      input.setSelectionRange(caretStart, caretEnd);
    }, 0);
  }
}
