import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public set(name: any, data: any) {
    let x = btoa(encodeURIComponent(JSON.stringify(data)));
    localStorage.setItem(name, x);
  }

  public get(data: any) {
    let x: any = localStorage.getItem(data);
    return JSON.parse(decodeURIComponent(atob(x)))
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

}
