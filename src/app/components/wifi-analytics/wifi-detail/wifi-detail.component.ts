import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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

  UserForm!: FormGroup
  ngOnInit(): void {
    this.wifiDeatils();
  }

graphData:any = [];
keys: any = [];
values: any = [];
wifiDeatils() {
  this.assetSer.wifiDeatils().subscribe((res:any)=> {
    // console.log(res);
    // this.graphData.push(res.times);
    this.graphData.push(res.dayWise);
    this.graphData.push(res.weekWise);
    this.graphData.push(res.monthWise);
    this.graphData.push(res.quarterWise);

    // this.mychart(res.times, 'chart0');
    this.mychart(res.dayWise, 'chart');
    this.mychart(res.weekWise, 'chart1');
    this.mychart(res.monthWise, 'chart2');
    this.mychart(res.quarterWise, 'chart3');
  })
}


  mychart(payload: any, chartType: any) {
    let counts = payload.counts.split(',');
    let labels = payload.labels.split(',');
    let timestrings = payload.timestrings.split(',');

    var charttype = 'line';
    var threeD = false;
    var title = payload.type + ' wise';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    var categories = labels;
    var elementid = chartType;
    var subTitle = payload.type;
    let arr: any = [];
    labels.forEach((item: any, index: any) => {
      arr.push([labels[index] + ', ' + counts[index] + ', ' + timestrings[index], Number(counts[index])]);
    })
    var data = arr;
    this.chartService.createchart1(charttype, threeD, title, data, elementid, subTitle, categories)
  }

  close() {
    this.newItemEvent.emit();
  }

}
