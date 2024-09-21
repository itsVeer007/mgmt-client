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

  getMetaType(data: any):any {
    let x = this.storageSer.get('metaData');
    return x.filter((item: any) => item.type === data);
  }
  
  arrayOfObjs: Array<any> = new Array();
  convert(): void {
    let fields;
    this.storageSer.edit_sub.subscribe({
      next: (res) => {
        fields = Object.entries(res.objectEntries).reduce((acc: any, [key, value]) => {
          acc.push({ key, value });
          return acc;
        }, []);

        fields.forEach((item: any) => {
          if(res.selectTypes.includes(item.key)) {
            item.inputType = 'select';
          }
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
      fields.push(item)
    });
    console.log(fields)


    // let y = this.arrayOfObjs.reduce((acc: any, curr: any) => {
    //   acc[curr.key] = curr.value;
    //   return acc
    // }, {})
    // console.log(y);
  }

}
