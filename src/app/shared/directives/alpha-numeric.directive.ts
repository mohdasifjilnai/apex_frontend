import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  constructor(private el: ElementRef) { }
  
  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const inputVal = this.el.nativeElement.value;
    this.el.nativeElement.value = inputVal.replace(/[^a-zA-Z0-9]/g, '');
  }

}
