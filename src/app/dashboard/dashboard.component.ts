import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var s = JSON.stringify([{"DAY":{"SAT cw":"0","FRI":"0","THU":"0","WED":"0","TUE":"0","MON":"0","SUN":"0","SAT lw":"0"}},{"WEEK":{"Week-26":"0","Week-25":"0","Week-24":"0","Week-23":"0","Week-22":"0"}},{"MONTH":{"JUN-22":"0","MAY-22":"0","APR-22":"0","MAR-22":"0"}},{"QUARTER":{"Qtr1-21":"0","Qtr4-20":"0","Qtr3-20":"0","Qtr2-20":"0","Qtr1-20":"0"}}])
    // console.log(JSON.parse(s))
  }

  profile:boolean = true;
  showmenu:boolean = false;
  showProfile() {
    this.profile=!this.profile;
  }

  showMenu() {
    this.showmenu=!this.showmenu;
  }

}
