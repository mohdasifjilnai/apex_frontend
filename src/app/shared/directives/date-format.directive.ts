import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateFormat]'
})
export class DateFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const input = event.target;
    const value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = this.formatDate(value);
    input.value = formattedValue;
  }

  private formatDate(value: string): string {
    const day = value.slice(0, 2);
    const month = value.slice(2, 4);
    const year = value.slice(4, 8);

    if (value.length > 4) {
      return `${month}/${day}/${year}`;
    } else if (value.length > 2) {
      return `${day}/${month}`;
    } else {
      return value;
    }
  }

}
