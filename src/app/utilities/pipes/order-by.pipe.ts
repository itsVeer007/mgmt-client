import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, field: string): any {
    if(field == 'isAssigned') {
      
      return array.sort((a: any, b: any) => a[field] ? -1 : b[field] ? 1 : 0);
    } else {
      return array.sort((a: any, b: any) => a[field].toLowerCase() < b[field].toLowerCase() ? -1 : a[field].toLowerCase() > b[field].toLowerCase() ? 1 : 0);
    }
  }

}
