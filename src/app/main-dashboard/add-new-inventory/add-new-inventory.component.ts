import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
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
export class AddNewInventoryComponent implements OnInit {
  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: FormBuilder,

    public alertSer: AlertService,
    public datepipe: DatePipe
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }
  // error=false;


  UserForm: any =  FormGroup;

  inventoryBody = {
    inventory: {
      productId: null,
      orderId: null,
      cost: null,
      createdBy: 1,
      remarks: null

      // quantity: null,
      // serialNo: '',
      // price: null,
    },

    serialnos: [],

    warranty: {
      startDate: null,
      endDate: null,
      createdBy: 1,
      remarks: null

      // serialNo: "",
      // newSerialNo: "",
      // cost: "",
      // vendor: "",
    }
  }

  // email: string = "";

  ngOnInit() {
    this.UserForm = this.fb.group({
      'productId': new FormControl('', Validators.required),
      'orderId': new FormControl('', Validators.required),
      'cost': new FormControl('', Validators.required),
      'serialnos': new FormControl(''),
      'remarks': new FormControl(''),

      // 'quantity': new FormControl(''),
      // 'price': new FormControl('', Validators.required),

      // 'wserialNo': new FormControl(''),
      // 'wnewSerialNo': new FormControl(''),
      // 'wcost': new FormControl(''),
      // 'vendor': new FormControl(''),

      'wremarks': new FormControl(''),
      'startDate': new FormControl(''),
      'endDate': new FormControl(''),

      'warrantyDetail': new FormControl(''),
    });
  }

  closeAddUser() {
    this.newItemEvent.emit(false);
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit(false);
    localStorage.setItem('opennewform', newform)
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    setTimeout(() => {
      this.newItemEvent.emit();
    }, 3000)

    if(this.UserForm.valid) {
      this.arr.push(this.inventoryBody.serialnos)
      this.inventoryBody.serialnos = this.arr;
      this.inventoryBody.warranty.startDate = this.datepipe.transform(this.inventoryBody.warranty.startDate, 'yyyy-MM-dd');
      this.inventoryBody.warranty.endDate = this.datepipe.transform(this.inventoryBody.warranty.endDate, 'yyyy-MM-dd');
      this.alertSer.wait();
      this.newItemEvent.emit(false);
      this.inventorySer.createInventory(this.inventoryBody, this.warrantyDetail).subscribe((res: any) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res);
        }
        setTimeout(() => {
          // window.location.reload();
        }, 3000);
      }, (err: any) => {
        if(err) {
          this.alertSer.error();
        }
      });
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}
