import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number | string, locale?: string): string {
    const formattedValue = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,  // Set minimumFractionDigits to 0 to remove trailing zeros
      maximumFractionDigits: 2
    }).format(Number(value));

    return formattedValue.replace(/(\.\d*?[1-9])0+$/, '$1'); // Remove trailing zeros after the decimal point
  }

}
