import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dc-challan',
  templateUrl: './dc-challan.component.html',
  styleUrls: ['./dc-challan.component.css']
})
export class DcChallanComponent implements OnInit {

  constructor() { }

  dcItems: any;
  ngOnInit(): void {
    this.dcItems = JSON.parse(localStorage.getItem('dcItems')!);
    console.log(this.dcItems)
  }

}
