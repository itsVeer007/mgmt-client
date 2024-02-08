import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChartService } from 'src/services/chart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})


export class MainDashboardComponent implements OnInit {

  constructor(
    private chartservice: ChartService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }


  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;
  ngOnInit(): void {
    this.getMainDashboardCardReport();
    this.getMainDashboardReport();
    this.mychart();
    this.mychart1();
    this.mychart2();
    this.mychart3();
    this.mychart4();
  }

  openicons11(i: any) {
    var y = <HTMLElement>document.getElementById(`icons1${this.currentid}`);
    if (y.style.display == 'flex' || y.style.display == 'block') {
      y.style.display = 'none';
    }
  }

  showAddSite = false;
  closenow(value: any, type: String) {
    if (type == 'site') { this.showAddSite = value; }
    if (type == 'camr') { this.showAddCamera = value; }
    if (type == 'cust') { this.showAddCustomer = value; }
    if (type == 'vert') { this.showAddBusinessVertical = value; }
    if (type == 'user') { this.showAddUser = value; }
  }


  showIconVertical: boolean = false;
  showIconCustomer: boolean = false;
  showIconSite: boolean = false;
  showIconCamera: boolean = false;
  showIconAnalytic: boolean = false;
  showIconUser: boolean = false;

  cardReport: any;
  getMainDashboardCardReport() {
    this.getNoOfElements();
    this.http.get('assets/JSON/verticalCard.json').subscribe(res => {
      this.cardReport = res;
      // console.log(res)
      var a = JSON.parse(JSON.stringify(res));
      // console.log(this.noOfCards);
      this.showcardReport = a.splice(0, this.noOfCards);
    });
  }

  noOfCards = 4;
  getNoOfElements() {
    var x = document.body.clientWidth;
    if (x < 400) { this.noOfCards = 1; }
    if (x > 400) { this.noOfCards = 1; }
    if (x > 500) { this.noOfCards = 2; }
    if (x > 700) { this.noOfCards = 3; }
    if (x > 900) { this.noOfCards = 4; }
    if (x > 1400) { this.noOfCards = 5; }
    // console.log(this.noOfCards)
  }

  mainReport: any;
  count: any;
  totalCust: any = 0;
  totalSites: any = 0;
  totalCams: any = 0;
  totalAna: any = 0;
  totalUsers: any = 0;
  getMainDashboardReport() {
    this.http.get('assets/JSON/mainDashboard.json').subscribe(res => {
      this.mainReport = res;
      // console.log(res)
      this.count = Object.keys(res).length;
      this.mainReport.forEach((el: any) => {
        this.totalCust += Number(el.customerCount);
        this.totalSites += Number(el.sitesCount);
        this.totalCams += Number(el.camerasCount);
        this.totalAna += Number(el.analyticsCount);
        this.totalUsers += Number(el.usersCount);
      });
    });
  }

  showmenu(event: any) {
    var x = event.target.parentNode.previousElementSibling;
  }

  mychart() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CUSTOMERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    //var antype = 'Minutes';
    var elementid = 'chart';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  mychart1() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL SITES REPORT - 7';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart1';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  mychart2() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CAMERAS REPORT - 49';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart2';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart3() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL ANALYTICS REPORT - 42';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart3';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart4() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL USERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart4';
    var antype = 'year';
    var data = [
      ['40', 40],
      ['66', 66],
      ['50', 50],
      ['70', 70],
      ['10', 10],
      ['40', 40],
      ['91', 91],
      ['40', 40],
      ['40', 40],
      ['66', 66],
      ['80', 80],
      ['100', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  // icons111: boolean = false;
  openIcon(type: any) {
    if(type == 'site') {this.showAddSite = true};
    if(type == 'user') {this.showAddUser = true};

    this.showIconSite = false;
    this.showIconUser = false;
  }

  icons11: boolean = false;
  currentid = 0;
  iconss1(e: any, i: any) {
    this.currentid = i;
    var x = e.target.parentNode.previousElementSibling;
    if (x.id.includes("icons1")) {
      if (x.style.display == 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
    }
  }

  showcardReport: any;
  prevvert() {
    var indexOfFirstElem = this.cardReport.map((item: any) => {
      return item.id
    }).indexOf(this.showcardReport[0].id);

    // console.log(indexOfFirstElem, (this.cardReport.length - 1))
    if (indexOfFirstElem != 0) {
      indexOfFirstElem = indexOfFirstElem -= 1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }
  }

  nextvert() {
    var indexOfFirstElem = this.cardReport.map((item: any) => {
      return item.id
    }).indexOf(this.showcardReport[0].id);

    // console.log(indexOfFirstElem, (this.cardReport.length - 1))
    if ((indexOfFirstElem + this.noOfCards) < (this.cardReport.length)) {
      indexOfFirstElem = indexOfFirstElem += 1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }
  }

}
