import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNumberWithDecimal]'
})
export class NumberWithDecimalDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    let currentValue = inputElement.value;

    // Remove any non-numeric and non-decimal characters, except the first '-'
    currentValue = currentValue.replace(/[^0-9.]/g, '');

    // Remove leading zeros
    currentValue = currentValue.replace(/^(-)?0+(?=[1-9])/, '$1');

    // Remove extra decimal points
    const decimalCount = (currentValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      currentValue = currentValue.substr(0, currentValue.lastIndexOf('.'));
    }

    // Update the input value with the sanitized value
    this.renderer.setProperty(inputElement, 'value', currentValue);
  }

}
