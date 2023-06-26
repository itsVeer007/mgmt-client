import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private apiser: ApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`sidebar`);
    if (x != null) {
      if (!x.contains(e.target)) {
        this.show = false;
      }
    }

    var y = <HTMLElement>document.getElementById(`profiles`);
    if (y != null) {
      if (!y.contains(e.target)) {
        this.profile = false;
      }
    }
  }


  user: any;
  userType: any = [];
  isAdmin = false;
  ngOnInit(): void {
    // var s = JSON.stringify([{ "DAY": { "SAT cw": "0", "FRI": "0", "THU": "0", "WED": "0", "TUE": "0", "MON": "0", "SUN": "0", "SAT lw": "0" } }, { "WEEK": { "Week-26": "0", "Week-25": "0", "Week-24": "0", "Week-23": "0", "Week-22": "0" } }, { "MONTH": { "JUN-22": "0", "MAY-22": "0", "APR-22": "0", "MAR-22": "0" } }, { "QUARTER": { "Qtr1-21": "0", "Qtr4-20": "0", "Qtr3-20": "0", "Qtr2-20": "0", "Qtr1-20": "0" } }])
    // console.log(JSON.parse(s))

    this.user=JSON.parse(localStorage.getItem('user')!);

    for(let item of this.user.Roles) {
      if(item == 'adminus') {
        this.isAdmin = true;
      }
    }

    this.apiser.user$.subscribe((res:any)=>{this.user=JSON.parse(localStorage.getItem('user')!)})
  }

  profile: boolean = false;
  show: boolean = false;
  showProfile() {
    this.profile = !this.profile;
  }

  showMenu() {
    this.show = !this.show;
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }

  logout() {
    localStorage.clear();
    this.apiser.user$.next(null);
    this.apiser.logout();
  }

}
