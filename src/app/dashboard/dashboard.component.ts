import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';
import { UserService } from 'src/services/user.service';
import { MailComponent } from '../mail/mail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private userSer: UserService,
    private router: Router,
    private storageSer: StorageService,
    private cdr: ChangeDetectorRef,
    private dialog:MatDialog
  ) { }


  user: any;
  isAdmin = false;
  isFr = false;
  ngOnInit(): void {
    // var s = JSON.stringify([{ "DAY": { "SAT cw": "0", "FRI": "0", "THU": "0", "WED": "0", "TUE": "0", "MON": "0", "SUN": "0", "SAT lw": "0" } }, { "WEEK": { "Week-26": "0", "Week-25": "0", "Week-24": "0", "Week-23": "0", "Week-22": "0" } }, { "MONTH": { "JUN-22": "0", "MAY-22": "0", "APR-22": "0", "MAR-22": "0" } }, { "QUARTER": { "Qtr1-21": "0", "Qtr4-20": "0", "Qtr3-20": "0", "Qtr2-20": "0", "Qtr1-20": "0" } }])
    // console.log(JSON.parse(s))
    // this.userSer.user$.subscribe(() => {
    //   this.user=  this.storageSer.get('user');
    // });
    this.user =  this.storageSer.get('user');
    if(this.user?.role.includes('Administrator')) {
      this.isAdmin = true;
    }
    if(this.user?.role.includes('FR')) {
      this.isFr = true;
    }
  }

  logout() {
    this.userSer.logout();
  }

  openButton() {
    this.dialog.open(MailComponent)
  }

}
