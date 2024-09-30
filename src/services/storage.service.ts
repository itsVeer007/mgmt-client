import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  current_sub: BehaviorSubject<any> = new BehaviorSubject(null);
  edit_sub: BehaviorSubject<any> = new BehaviorSubject({objectEntries: {}, selectTypes: []});

  constructor() { }

  public set(name: any, data: any) {
    // let x = btoa(encodeURIComponent(JSON.stringify(data)));
    // localStorage.setItem(name, x);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public get(data: any) {
    // let x: any = localStorage.getItem(data);
    // return JSON.parse(decodeURIComponent(atob(x)));
    return JSON.parse(localStorage.getItem(data)!);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

}
