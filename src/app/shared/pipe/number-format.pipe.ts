import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | string, locale?: string): string {
    // Use Indian locale ("en-IN") for formatting
    // const formattedValue = new Intl.NumberFormat('en-IN', {
    //   minimumFractionDigits: 0, // Set minimumFractionDigits to 0 to remove trailing zeros
    //   maximumFractionDigits: 2,
    // }).format(Number(value));

    let formattedValue = new Intl.NumberFormat('en-IN').format(Number(value)); //inplace of en-IN you can mention your country's code
    formattedValue = formattedValue ? formattedValue.toString() : '';
    // this.currency.setValue(temp);
    return formattedValue; // Remove trailing zeros after the decimal point
  }
}
