import { Component, isDevMode } from '@angular/core';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mgmtClient';

  constructor(private apiser: ApiService) {}

  user: any = null;
  ngOnInit() {
    isDevMode() ? console.log('Stagging!') : console.log('Production!');
    // this.apiser.user$.subscribe((res) => {
    //   this.user = res;
    // });
  }

  ngDoCheck() {
    let isAuthenticated = this.apiser.getAuthStatus();
    if(isAuthenticated) {
      this.user = 'Success';
    } else {
      this.user = null;
    }
  }

}
