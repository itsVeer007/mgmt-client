import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ChartService } from '../utilities/chart.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  
  @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
    var x = <HTMLElement>document.getElementById(`icons-site`);
   if(x!=null){
      if (!x.contains(e.target)) {
        this.icons111=false;
     }
   }

    var y = <HTMLElement>document.getElementById(`icons1${this.currentid}`);
    if(y!=null){
      if (!y.contains(e.target.parentNode.previousElementSibling)) {
        if (y.style.display == 'flex' || y.style.display == 'block') {
          y.style.display = 'none';
        }
      }
    }
  
  }

  openicons11(i:any){
    var y = <HTMLElement>document.getElementById(`icons1${this.currentid}`);
    if (y.style.display == 'flex' || y.style.display == 'block') {
      y.style.display = 'none';
    }
  }
  
  showAddSite = false;

  closenow(value:any, type:String) {
    if(type=='site'){this.showAddSite = value;}
    if(type=='camr'){this.showAddCamera = value;}
    if(type=='cust'){this.showAddCustomer = value;}
    if(type=='vert'){this.showAddBusinessVertical = value;}
    if(type=='user'){this.showAddUser = value;}


    setTimeout(()=>{
      var openform = localStorage.getItem('opennewform');
      if(openform=='showAddSite'){this.showAddSite = true;}
      if(openform=='showAddCamera'){this.showAddCamera = true;}
      if(openform=='showAddCustomer'){this.showAddCustomer = true;}
      if(openform=='showAddBusinessVertical'){this.showAddBusinessVertical = true;}
      if(openform=='showAddUser'){this.showAddUser = true;}
      localStorage.setItem('opennewform', '');
    },100)
    /*
        console.log(value,type)
    if(type=='site'){this.showAddSite = value;}else{this.showAddSite = false;};
    if(type=='camera'){this.showAddCamera = value;}else{this.showAddCamera = false;};
    if(type=='cust'){this.showAddCustomer = value;}else{this.showAddCustomer = false;};
    if(type=='user'){this.showAddUser = value;}else{this.showAddUser = value;};
    if(type=='none'){this.showAddUser = value;}else{this.showAddUser = value;};
    */
  }


  showAddCamera = false;
  showAddCustomer = false;
  showAddUser = false;
  showAddBusinessVertical = false;

  constructor(private chartservice: ChartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getMainDashboardCardReport();
    this.getMainDashboardReport();
    this.mychart();
    this.mychart1();
    this.mychart2();
    this.mychart3();
    this.mychart4();
  }

  cardReport: any;
  getMainDashboardCardReport() {
    this.getNoOfElements();
    this.http.get('assets/JSON/verticalCard.json').subscribe(res =>{
      this.cardReport = res;
      var a = JSON.parse(JSON.stringify(res));
      // console.log(this.noOfCards);
      this.showcardReport = a.splice(0,this.noOfCards); 
    });
  }

  noOfCards=4;
  getNoOfElements() {
    var x = document.body.clientWidth;
    // console.log(x);
    if(x < 400) {this.noOfCards=1;}
    if(x > 400) {this.noOfCards=1;}
    if(x > 500) {this.noOfCards=2;}
    if(x > 700) {this.noOfCards=3;}
    if(x > 900) {this.noOfCards=4;}
    if(x > 1400) {this.noOfCards=5;}
    // console.log(this.noOfCards)
  }

  mainReport: any;
  count: any;
  totalCust:any=0;
  totalSites:any=0;
  totalCams:any=0;
  totalAna:any=0;
  totalUsers:any=0;
  getMainDashboardReport() {
    this.http.get('assets/JSON/mainDashboard.json').subscribe(res =>{
      this.mainReport = res;
      console.log(res)
      this.count = Object.keys(res).length;
      this.mainReport.forEach((el:any) => {
          this.totalCust += Number(el.customerCount);
          this.totalSites+= Number(el.sitesCount);
          this.totalCams+= Number(el.camerasCount);
          this.totalAna+= Number(el.analyticsCount);
          this.totalUsers+= Number(el.usersCount);
      });
    });
  }

  showmenu(event:any){
    var x = event.target.parentNode.previousElementSibling;
    console.log(x.style)
    // var x = <HTMLElement>document.getElementById("icons");
    // x.style.display = "flex";
    // x.style.opacity = "1";
    // x.style.zIndex = "999";
    // console.log(x.style.display);
    // console.log(x.style.opacity);
  }

  mychart(){
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CUSTOMERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    //var antype = 'Minutes';
    var elementid = 'chart';
    var antype = 'year';
    var data =  [
      ['91', 40],
      ['66', 66],
      ['91', 50],
      ['66', 70],
      ['91', 10],
      ['66', 40],
      ['91', 91],
      ['66', 40],
      ['91', 40],
      ['66', 66],
      ['91', 80],
      ['66', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }

  mychart1(){
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL SITES REPORT - 7';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart1';
    var antype = 'year';
    var data =  [
      ['91', 40],
      ['66', 66],
      ['91', 50],
      ['66', 70],
      ['91', 10],
      ['66', 40],
      ['91', 91],
      ['66', 40],
      ['91', 40],
      ['66', 66],
      ['91', 80],
      ['66', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart2(){
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL CAMERAS REPORT - 49';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart2';
    var antype = 'year';
    var data =  [
      ['91', 40],
      ['66', 66],
      ['91', 50],
      ['66', 70],
      ['91', 10],
      ['66', 40],
      ['91', 91],
      ['66', 40],
      ['91', 40],
      ['66', 66],
      ['91', 80],
      ['66', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart3(){
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL ANALYTICS REPORT - 42';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart3';
    var antype = 'year';
    var data =  [
      ['91', 40],
      ['66', 66],
      ['91', 50],
      ['66', 70],
      ['91', 10],
      ['66', 40],
      ['91', 91],
      ['66', 40],
      ['91', 40],
      ['66', 66],
      ['91', 80],
      ['66', 100]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
  mychart4(){
    var charttype = 'line';
    var threeD = false;
    var title = 'TOTAL USERS REPORT - 5';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    // var antype = 'Minutes';
    var elementid = 'chart4';
    var antype = 'year';
    var data =  [
      ['10', 10],
      ['20', 20],
      ['45', 45],
      ['25', 25],
      ['60', 60],
      ['50', 50],
      ['91', 91],
      ['66', 66]
    ];
    this.chartservice.createchart(charttype, threeD, title, data, elementid, antype)
  }
 
  icons111:boolean = false;
  iconssnew() {
    this.icons111=!this.icons111;
  }

  icons11:boolean = false;
  currentid=0;
  iconss1(e:any, i:any) {
    this.currentid=i;
    var x = e.target.parentNode.previousElementSibling;
    // console.log("MainDashboard:: ",x)
    if(x.style.display == 'none') {
      x.style.display = 'block';
    }else {
      x.style.display = 'none';
    }
  }

  showcardReport:any;
  prevvert(){
    var indexOfFirstElem = this.cardReport.map(function (item:any) { return item.id; }).indexOf(this.showcardReport[0].id);
    if(indexOfFirstElem != 0){
      indexOfFirstElem = indexOfFirstElem-=1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem,this.noOfCards); 
    }
  }
  nextvert(){
    var indexOfFirstElem = this.cardReport.map(function (item:any) { return item.id; }).indexOf(this.showcardReport[0].id);
    console.log(indexOfFirstElem , (this.cardReport.length -1))
    if((indexOfFirstElem+this.noOfCards) < (this.cardReport.length)){
      indexOfFirstElem = indexOfFirstElem+=1;
      var a = JSON.parse(JSON.stringify(this.cardReport))
      this.showcardReport = a.splice(indexOfFirstElem,this.noOfCards); 
    }
  }

}
