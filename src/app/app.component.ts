import { Component } from '@angular/core';
import { ApiService } from './utilities/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Management-Server';
  user=null;

  constructor(private apiser:ApiService){}
  ngOnInit(){
    // this.user=JSON.parse(localStorage.getItem('user')!);
    this.apiser.user$.subscribe((res)=>{

      console.log('Subject:: ', res)
      this.user=JSON.parse(localStorage.getItem('user')!);
    });
  }
}
