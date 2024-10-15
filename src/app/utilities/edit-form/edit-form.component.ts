import { Component } from '@angular/core';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';


@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent {

  constructor(
    private storageSer: StorageService,
    private metaSrvc: MetadataService,
    private alertSrvc: AlertService
  ) {}

  ngOnInit(): void {
    this.convert();
  }
  
  arrayOfObjs: Array<any> = new Array();
  urls: any;
  convert(): void {
    let fields: any;
    this.storageSer.edit_sub.subscribe({
      next: (res) => {
        this.urls = res;
        fields = Object.entries(res.data).reduce((acc: any, [key, value]) => {
          acc.push({ key, value });
          return acc;
        }, []);
        
        fields.forEach((item: any) => {
          let fieldKeys = Object.values(item);
          res.dropdownData.forEach((val: any, i: any) => {
            let typeKeys = Object.values(val);

            fieldKeys.forEach((el: any) => {
              if(typeKeys.includes(el)) {
                item.inputType = 'select';
                item.options = res.dropdownData[i].data[0].metadata
              }
            })
          });
          this.arrayOfObjs.push(item);
        });
        console.log(this.arrayOfObjs);
      }
    });
  }
  
  update(): void {
    // let fields: any = [];
    // this.arrayOfObjs.forEach((item: any) => {
    //   delete item.inputType;
    //   delete item.options;
    //   fields.push(item);
    // });


    let data = this.arrayOfObjs.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc
    }, {});
    console.log(data);

    this.storageSer.updateData(this.urls.updateUrl, data, data.cameraId).subscribe({
      next: (res: any) => {
        this.alertSrvc.success(res.message);
        this.storageSer.getData(this.urls.getUrl, data.siteId).subscribe()
      }
    })
  }

}
