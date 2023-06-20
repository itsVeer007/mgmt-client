import { Component, isDevMode } from '@angular/core';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mgmtClient';
  user=null;

  constructor(private apiser: ApiService){}
  ngOnInit(){
    if (isDevMode()) {
      console.log('Stagging!');
    } else {
      console.log('Production!');
    }

    // this.user=JSON.parse(localStorage.getItem('user')!);
    this.apiser.user$.subscribe((res)=>{
      // console.log('Subject', res);
      this.user=JSON.parse(localStorage.getItem('user')!);
    });
  }
}
