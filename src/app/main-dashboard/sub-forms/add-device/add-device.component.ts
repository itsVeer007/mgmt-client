import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
        animate(
          "750ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddDeviceComponent implements OnInit {
  @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`additionalSite`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddAdditionalSite(false);
  //     }
  //   }
  // }


  addDevice: any =  FormGroup;
  deviceList = ['Device-1', 'Device-2', 'Device-3'];

  // site = {
  //   device: "",
  //   camera: "",
  //   temperature: "",
  //   age: "",
  //   demographics: "",
  //   status: "",
  //   audio: "",
  //   video: "",
  //   wifi: "",
  //   select: ""
  // }

  searchText: any;

  items = ['john', 'mark', 'cooper', 'henry', 'roben'];

  constructor(private fb: FormBuilder, private apiser: ApiService) { }

  ngOnInit(): void {
    this.addDevice = this.fb.group({
      'device': new FormControl(''),
      'camera': new FormControl(''),
      'temp': new FormControl(''),
      'age': new FormControl(''),
      'demographics': new FormControl(''),
      'status': new FormControl(''),
      'audio': new FormControl(''),
      'video': new FormControl(''),
      'wifi': new FormControl(''),
      'select': new FormControl('')
    });

    // this.getSiteDetails()
  }

  // getSiteDetails(){
  //   this.apiser.getUser().subscribe((res:any)=>{
  //     // console.log(res)
  //     if(res.Status == 'Success'){
  //       this.site.userId= "";
  //       this.site.userName= "";
  //       this.site.verticals= res.verticals ;
  //       this.site.customers= res.customers ;
  //       this.site.selectSite= res.selectSite;

  //     }
  //   })
  // }

  closeAddAdditionalSite(value: boolean) {
    this.newItemEvent.emit(value);
  }

  add(){
    console.log("add device", this.addDevice.value);
  }

  showcardReport: any;
  prevvert() {
    // var indexOfFirstElem = this.cardReport.map(function (item: any) { return item.id; }).indexOf(this.showcardReport[0].id);
    // if (indexOfFirstElem != 0) {
    //   indexOfFirstElem = indexOfFirstElem -= 1;
    //   var a = JSON.parse(JSON.stringify(this.cardReport))
    //   this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    }

  nextvert() {
    // var indexOfFirstElem = this.cardReport.map(function (item: any) { return item.id; }).indexOf(this.showcardReport[0].id);
    // console.log(indexOfFirstElem, (this.cardReport.length - 1))
    // if ((indexOfFirstElem + this.noOfCards) < (this.cardReport.length)) {
    //   indexOfFirstElem = indexOfFirstElem += 1;
    //   var a = JSON.parse(JSON.stringify(this.cardReport))
    //   this.showcardReport = a.splice(indexOfFirstElem, this.noOfCards);
    // }
  }

}
