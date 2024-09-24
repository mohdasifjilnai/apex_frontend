import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphabetOnly]'
})
export class AlphabetOnlyDirective {

  constructor() { }

  @HostListener('input', ['$event'])
onInputChange(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const sanitized = input.value.replace(/[^a-zA-Z\s]*/g, ''); // Allow only alphabets and single space

  input.value = sanitized;
}

// @HostListener('paste', ['$event'])
// onPaste(event: ClipboardEvent) {
//   event.preventDefault();
//   const input = event.target as HTMLInputElement;
//   input.value = '';
// }


}
