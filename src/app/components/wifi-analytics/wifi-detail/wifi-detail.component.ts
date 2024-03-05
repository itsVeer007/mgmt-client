import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AssetService } from 'src/services/asset.service';
import { ChartService } from 'src/services/chart.service';

@Component({
  selector: 'app-wifi-detail',
  templateUrl: './wifi-detail.component.html',
  styleUrls: ['./wifi-detail.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class WifiDetailComponent implements OnInit {

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  constructor(
    private chartService: ChartService,
    private assetSer: AssetService
  ) { }

  UserForm!: UntypedFormGroup
  deviceData: any;
  ngOnInit(): void {
    this.deviceData = this.show;
    console.log(this.deviceData)
    this.wifiDeatils();
  }

graphData:any = [];
keys: any = [];
values: any = [];
wifiDeatils() {
  this.assetSer.GetWifiStats2(this.deviceData).subscribe((res:any)=> {
    // console.log(res);
    this.graphData.push(res.dayWise);
    this.graphData.push(res.weekWise);
    this.graphData.push(res.monthWise);
    this.graphData.push(res.quarterWise);

    // this.mychart(res.dayWise, 'chart01', 1);
    // this.mychart(res.weekWise, 'chart02', 1);
    // this.mychart(res.monthWise, 'chart03', 1);
    // this.mychart(res.quarterWise, 'chart04', 1);
    this.mychart(res.dayWise, 'chart1', 0);
    this.mychart(res.weekWise, 'chart2', 0);
    this.mychart(res.monthWise, 'chart3', 0);
    this.mychart(res.quarterWise, 'chart4', 0);
  })
}


  mychart(payload: any, type: any, flag: any) {
    let counts: any;
    let newTitle: any;
    if(flag == 0) {
      counts = payload.counts.split(',');
      console.log(counts);
      newTitle = payload.type + ', ' + 'Device Count';
      console.log(newTitle)
    } else {
      counts = payload.times.split(',');
      newTitle = payload.type + ', ' + 'Time'
      console.log(newTitle)
    }
    let labels = payload.labels.split(',');
    let timestrings = payload.timestrings.split(',');

    var chartType = 'line';
    var title = newTitle;
    // var subtitle = '';
    var categories = labels;
    var elementid = type;
    var subTitle = payload.type;
    let arr: any = [];
    labels.forEach((item: any, index: any) => {
    if(flag == 0 ) {
      arr.push([labels[index] + ', ' + counts[index] + ', ' + timestrings[index], Number(counts[index])]);
    } else {
      arr.push(+ counts[index] + ', ' + [timestrings[index], Number(counts[index])]);
    }
    })
    var data = arr;
    console.log(data)
    this.chartService.wifiChart(chartType, title, data, elementid, subTitle, categories)
  }

  close() {
    this.newItemEvent.emit();
  }

}
