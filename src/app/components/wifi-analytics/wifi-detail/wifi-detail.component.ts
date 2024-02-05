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

graphData:any;
keys: any = [];
values: any = [];
wifiDeatils() {
  this.assetSer.wifiDeatils().subscribe((res:any)=> {
    // console.log(res);
    this.graphData = res;
    let x = res.dayWise[0];
    this.keys = Object.keys(x);
    this.values = Object.keys(x);
    this.mychart();
    console.log(Object.keys(x));
    console.log(Object.values(x));
  })
}


  mychart() {
    var charttype = 'line';
    var threeD = false;
    var title = 'TEMPERATURE';
    // var subtitle = 'The following charts represent the average amount of time your employees spend at their bays each day.';
    var categories = ['2AM', '4AM', '6Am', '8Am', '12Am', '2AM', '4AM', '6AM', '8AM']
    var elementid = 'chart';
    var antype = 'time';

    var data = [this.keys.forEach((item: any) => item), this.values.forEach((item: any) => item)];
    this.chartService.createchart1(charttype, threeD, title, data, elementid, antype, categories)
  }

  close() {
    this.newItemEvent.emit();
  }

}
