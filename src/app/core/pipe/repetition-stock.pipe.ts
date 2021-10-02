import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repetitionStock'
})
export class RepetitionStockPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
