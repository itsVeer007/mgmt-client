import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../utilities/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private apiser: ApiService, private route: Router) { }

  ngOnInit(): void {
    localStorage.clear();
    this.apiser.user$.next(null);
  }

  username: any;
  password: any;
  error = null;

  submit() {
    let loginDetails = {
      "userName": this.username,
      "password": this.password,
      "calling_System_Detail": "portal"
    }
    this.apiser.login(loginDetails).subscribe((res:any)=>{
      console.log("Login:: ",res);
      if(res.Status == "Success") {
        localStorage.setItem('user',JSON.stringify(res));
        this.apiser.user$.next(res);
        this.route.navigateByUrl("/main-dashboard");
      }else {
        this.error=res.Message;
      }
    });

  }
}
