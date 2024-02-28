import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMmYyyyformat]',
})
export class MmYyyyformatDirective {
  constructor(private el: ElementRef, private ngControl: NgControl) {}
  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target.value;

    /**
     * Apply your custom MM/YYYY format mask with length restriction
     */
    const formattedValue = this.formatDateInput(input);

    /**
     * Update the input value and form control model
     */
    this.ngControl.control?.setValue(formattedValue);
    this.el.nativeElement.value = formattedValue;
  }

  formatDateInput(input: string): string {
    const cleanedInput = input.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = cleanedInput.slice(0, 6); // Limit to 6 characters (MM/YYYY)
    const formattedMMYYYY = formattedValue.replace(/^(\d{2})(\d{4})$/, '$1/$2');
    return formattedMMYYYY;
  }
}
