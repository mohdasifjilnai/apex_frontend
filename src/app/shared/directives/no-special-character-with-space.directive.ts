import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNoSpecialCharacterWithSpace]'
})
export class NoSpecialCharacterWithSpaceDirective {
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric!: boolean;

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    return new RegExp(this.regexStr).test(event.key);
  }

  validateFields(event: any) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value
        .replace(/[^A-Za-z ]/g, '')
        .replace(/\s/g, '');
      event.preventDefault();
    }, 100);
  }

}
