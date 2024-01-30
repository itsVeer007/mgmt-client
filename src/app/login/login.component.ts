import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private siteSer: SiteService,
    private route: Router,
    private fb: FormBuilder,
    private router: Router,
    private alertSer: AlertService,
    private metaDataSer: MetadataService,
    private storageSer: StorageService
  ) { }

  user = null;
  showLoader: boolean = false;
  loginForm: any = FormGroup;

  ngOnInit() {
    this.storageSer.clearData();
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    // this.userSer.user$.subscribe((res: any) => {
    //   this.user = res
    // });

    // this.storageSer.set('user', 'Helllo');
    // let c: any = localStorage.getItem('user');
    // console.log(decodeURIComponent(atob(c)))
  }

  login() {
    this.showLoader = true;
    this.userSer.login(this.loginForm.value).subscribe((res: any) => {
      // console.log(res);
      this.showLoader = false;
      if(res?.Status == "Success") {
        this.storageSer.set('user', res);
        this.userSer.user$.next(res);
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

  /* new-login */
  forgotPassVisible: boolean = false;
  loginNew() {
    if(this.loginForm.valid) {
      this.showLoader = true;
      this.userSer.loginNew(this.loginForm.value).subscribe((res: any) => {
        this.showLoader = false;
        if(res?.Status == 'Success') {
          // this.userSer.isLoggedin.next(true);
          this.storageSer.set('user', res);
          this.userSer.user$.next(res);
          this.router.navigate(['main/main-dashboard']);
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
        this.storageSer.set('siteIds', res.siteList);
      }
      if(res?.Status == 'Failed') {
        // this.userSer.logout();
      }
    }, (err: any) => {
      // console.log(err)
    })
  }

  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.storageSer.set('metaData', res);
    })
  }

}
