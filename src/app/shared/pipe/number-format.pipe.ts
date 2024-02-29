import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | string, locale?: string): string {
    // Use Indian locale ("en-IN") for formatting
    const formattedValue = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0, // Set minimumFractionDigits to 0 to remove trailing zeros
      maximumFractionDigits: 2,
    }).format(Number(value));

    return formattedValue.replace(/(\.\d*?[1-9])0+$/, '$1'); // Remove trailing zeros after the decimal point
  }
}
