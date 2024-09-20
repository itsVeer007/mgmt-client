import { Component, Input } from '@angular/core';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent {

  constructor(
    private storageSer: StorageService
  ) {}

  // obj: any =     {
  //   "cameraId": "IVISINVIP36301C13",
  //   "name": "3RD FLOOR HUB ROOM",
  //   "userName": "admin",
  //   "password": "Tdp@2021",
  //   "status": "Y",
  //   "siteId": 36301,
  //   "centralBoxId": 63001,
  //   "unitId": "IVISINVIP363011",
  //   "noOfActiveCameras": 20,
  //   "requestName": "NA",
  //   "audioSpeakerType": "Analog",
  //   "audioUrl": null,
  //   "timezone": "Asia/Kolkata",
  //   "camMonitor": "T",
  // }

  arrayOfObjs: Array<any> = new Array();
  ngOnInit(): void {
    let fields: any;
    this.storageSer.edit_sub.subscribe({
      next: (res) => {
        console.log(res);
        this.arrayOfObjs = Object.entries(res).reduce((acc: any, [key, val]) => {
          acc.push({ key, val });
          return acc;
        }, [])
        console.log(this.arrayOfObjs);
      }
    })



    // let y = this.arrayOfObjs.reduce((acc: any, curr: any) => {
    //   acc[curr.key] = curr.val;
    //   return acc
    // }, {})
    // console.log(y);
  }

}
