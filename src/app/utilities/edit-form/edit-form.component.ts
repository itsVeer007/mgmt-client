import { Component } from '@angular/core';
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
    private metaSrvc: MetadataService
  ) {}

  ngOnInit(): void {
    this.convert();
  }
  
  arrayOfObjs: Array<any> = new Array();
  convert(): void {
    let fields: any;
    this.storageSer.edit_sub.subscribe({
      next: (res) => {
        fields = Object.entries(res.objectEntries).reduce((acc: any, [key, value]) => {
          acc.push({ key, value });
          return acc;
        }, []);
        
        fields.forEach((item: any) => {
          let fieldKeys = Object.values(item);
          res.selectTypes.forEach((val: any, i: any) => {
            let typeKeys = Object.values(val);

            fieldKeys.forEach((el: any) => {
              if(typeKeys.includes(el)) {
                item.inputType = 'select';
                item.options = res.selectTypes[i].data[0].metadata
              }
            })
          });
          // if(res.selectTypes.includes(item)) {
          //   item.inputType = 'select';
          // }
          this.arrayOfObjs.push(item);
        });
        console.log(this.arrayOfObjs);
      }
    });
  }
  
  update(): void {
    let fields: any = [];
    this.arrayOfObjs.forEach((item: any) => {
      delete item.inputType;
      delete item.options;
      fields.push(item);
    });
    console.log(fields);


    // let y = this.arrayOfObjs.reduce((acc: any, curr: any) => {
    //   acc[curr.key] = curr.value;
    //   return acc
    // }, {})
    // console.log(y);
  }

}
