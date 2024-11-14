import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  fields: Array<any> = new Array();
  ngOnInit(): void {
    this.fields = Object.entries(this.data).reduce((acc: any, [key, value]: any) => {
      acc.push({key, value});
      return acc;
    }, []);
    // console.log(this.fields);
  }

}
