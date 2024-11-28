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
  loginForm!: FormGroup;

  ngOnInit() {
    this.storageSer.clearData();
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
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
        if(res.Status == 'Success') {
          this.storageSer.set('user', res);
          this.getSitesListForUserName();
          this.router.navigate(['/dashboard/devices']);
        } else if(res.Status == 'Failed') {
          this.alertSer.error(res.message);
        }
      }, (err: any) => {
        this.showLoader = false;
        this.alertSer.error(err?.error?.message);
      })
    }
  }
  
  getSitesListForUserName() {
    this.siteSer.getSitesListForUserName().subscribe((res: any) => {
      if(res.Status == 'Success') {
        this.getMetadata();
        this.storageSer.set('siteIds', res.sites);
      }
      if(res.Status == 'Failed') {
        // this.userSer.logout();
      }
    }, (err: any) => {
      // console.log(err)
    })
  }
  
  getMetadata() {
    this.metaDataSer.getMetadata().subscribe((res: any) => {
      this.storageSer.set('metaData', res);
      this.userSer.can_getdata.emit('dasndkjs')
    })
  }

}
