import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private apiser: ApiService,
    private siteSer: SiteService,
    private route: Router,
    private fb: FormBuilder,
    private router: Router
  ) { }

  user = null;
  showLoader: boolean = false;
  loginForm: any = FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    sessionStorage.clear();
    localStorage.clear();
    this.apiser.user$.subscribe((res: any) => {
      this.user = res
    });
  }

  loginBody = {
    userName: null,
    password: null,
    calling_System_Detail: "portal"
  }

  errMsg: any = null;
  login() {
    this.showLoader = true;
    this.apiser.login(this.loginBody).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == "Success") {
        sessionStorage.setItem('user', JSON.stringify(res));
        this.apiser.user$.next(res);
        this.route.navigate(['/main-dashboard']);
        this.getlistSites();
      } else if(res?.Status == "Failed") {
        this.errMsg = res.Message;
        this.clearErrMsg();
      }
    }, (err: any) => {
      // console.log(err);
    });
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassVisible: boolean = false;
  loginNew() {
    this.showLoader = true;
    this.apiser.loginNew(this.loginBody).subscribe((res: any) => {
      this.showLoader = false;
      if(res?.message == 'User authentication failed') {
        this.errMsg = 'Please contact support-team';
        this.clearErrMsg();
      } else {
        sessionStorage.setItem('user', JSON.stringify(res));
        this.apiser.user$.next(res);
        this.router.navigate(['/main-dashboard']);
        this.getlistSites();
      }
    })
  }

  // inputToAssets: any;
  getlistSites() {
    this.siteSer.listSites().subscribe((res: any) => {
      // console.log(res);
      if(res?.Status == 'Success') {
        localStorage.setItem('siteIds', JSON.stringify(res?.siteList));
      }
      if(res?.Status == 'Failed') {
        // this.apiser.logout();
      }
    }, (err: any) => {
      // console.log(err)
    })
  }

  clearErrMsg() {
    setTimeout(() => {
      this.errMsg = null;
    }, 5000)
  }

}
