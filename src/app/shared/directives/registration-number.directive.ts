import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appRegistrationNumber]',
})
export class RegistrationNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/\s/g, '');
    if (sessionStorage.getItem('registration_form_isValid') === 'false') {
      // Remove existing hyphens
      const sanitizedValue = value.replace(/-/g, '');

      if (sanitizedValue.length < 7) {
        const formattedValue = sanitizedValue.replace(/(.{2})/g, '$1-');
        value = formattedValue.replace(/-$/, '');
      } else {
        // Add hyphen between consecutive numbers or letters after the 4th character
        const prefix = sanitizedValue.substring(0, 2);
        const prefix2 = sanitizedValue.substring(2, 4);
        const postfix = sanitizedValue.substring(4);
        const formattedPostfix = postfix.replace(/([A-Za-z]+|[0-9]+)/g, '$1-');
        value = `${prefix}-${prefix2}-${formattedPostfix.replace(/-$/, '')}`;
      }
    }
    // Update the input value
    value = value.replace(/^-|-$/g, '');
    // Remove any consecutive hyphens
    value = value.replace(/--+/g, '-');
    input.value = value;
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedText = clipboardData.getData('text');
      let formattedText = pastedText
        
      // formattedText = formattedText.slice(0, -4) + formattedText.slice(-3,-1);
      
      const sanitizedValue = formattedText.replace(/-/g, '');

      if (sanitizedValue.length < 7) {
        const formattedValue = sanitizedValue.replace(/(.{2})/g, '$1-');
        formattedText = formattedValue.replace(/-$/, '');
      } else {
        // Add hyphen between consecutive numbers or letters after the 4th character
        const prefix = sanitizedValue.substring(0, 2);
        const prefix2 = sanitizedValue.substring(2, 4);
        const postfix = sanitizedValue.substring(4);
        const formattedPostfix = postfix.replace(/([A-Za-z]+|[0-9]+)/g, '$1-');
        formattedText = `${prefix}-${prefix2}-${formattedPostfix.replace(/-$/, '')}`;
      }
      document.execCommand('insertText', false, formattedText);
      event.preventDefault();
    }
    
    }
  
}
