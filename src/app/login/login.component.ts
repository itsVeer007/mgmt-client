import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { ApiService } from 'src/services/api.service';
import { MetadataService } from 'src/services/metadata.service';
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
    private router: Router,
    private alertSer: AlertService,
    private metaDataSer: MetadataService
  ) { }

  user = null;
  showLoader: boolean = false;
  loginForm: any = FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    localStorage.clear();
    // this.apiser.user$.subscribe((res: any) => {
    //   this.user = res
    // });
  }

  loginBody = {
    userName: null,
    password: null,
    calling_System_Detail: "portal"
  }

  login() {
    this.showLoader = true;
    this.apiser.login(this.loginBody).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == "Success") {
        localStorage.setItem('user', JSON.stringify(res));
        this.apiser.user$.next(res);
        this.route.navigate(['/main-dashboard']);
        this.getlistSites();
      } else if(res?.Status == "Failed") {
        this.alertSer.snackError(res?.message);
      }
    }, (err: any) => {
      this.showLoader = false;
      this.alertSer.snackError(err?.error?.message);
    });
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassVisible: boolean = false;
  loginNew() {
    if(this.loginForm.valid) {
      this.showLoader = true;
      this.apiser.loginNew(this.loginBody).subscribe((res: any) => {
        this.showLoader = false;
        if(res?.Status == 'Success') {
          this.apiser.isLoggedin.next(true);
          localStorage.setItem('user', JSON.stringify(res));
          this.apiser.user$.next(res);
          this.router.navigate(['/main-dashboard']);
          this.getlistSites();
          this.getMetadata();
        } else if(res?.Status == 'Failed') {
          this.alertSer.snackError(res?.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertSer.snackError(err?.error?.message);
      })
    }
  }

  getlistSites() {
    this.siteSer.listSites().subscribe((res: any) => {
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

  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      localStorage.setItem('metaData', JSON.stringify(res));
    })
  }

}
