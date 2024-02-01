import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountFormat',
})
export class AmountFormatPipe implements PipeTransform {
  val: any;
  /**
   * this pipe use for amount convert  digit to word
   */
  transform(input: any, args?: any): unknown {
    this.val = Math.abs(input);
    if (this.val >= 10000000) {
      this.val = (this.val / 10000000).toFixed(0) + ' Cr';
    } else if (this.val >= 100000) {
      this.val = (this.val / 100000).toFixed(0) + ' Lakh';
    } else if (this.val >= 10000) {
      this.val = (this.val / 10000).toFixed(0) + ' Thousand';
    }
    return this.val;
  }
}
