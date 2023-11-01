import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';

@Component({
  selector: 'app-add-new-ticket',
  templateUrl: './add-new-ticket.component.html',
  styleUrls: ['./add-new-ticket.component.css'],
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
        style({ opacity: 1, transform: "translateX(0)", }), //apply default styles before animation starts
        animate(
          "600ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewTicketComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<boolean>();

  addAssetForm: any = FormGroup;

  shortLink: string = "";
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private inventorySer: InventoryService,
    private dropDown: MetadataService,
    public alertSer: AlertService
  ) { }

  ticketBody = {
    ticket: {
      typeId: null,
      reasonDescription: null,
      requestedBy: null,
      siteId: null,
      informedThrough: null,
      createdBy: null,
    },

    tasks: [
      {
        categoryId: null,
        subCategoryId: null,
        priorityId: null,
        // reasonId: null,
        createdBy: null,
      }
    ]
  }

  tasks: any = [];
  onTaskAdd(item: any) {
    // console.log(item);
    if(item?.categoryId == null || item?.subCategoryId == null || item?.priorityId == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'categoryId': item.categoryId,
        'subCategoryId': item.subCategoryId,
        'priorityId': item.priorityId,
        // 'reasonId': item.reasonId,
        'createdBy': this.user?.UserId,
      }
      this.tasks.push(takBody);
      this.addAssetForm.get('categoryId').setValue(null);
      this.addAssetForm.get('subCategoryId').setValue(null);
      this.addAssetForm.get('priorityId').setValue(null);
      // this.addAssetForm.get('reasonId').setValue(null);
    }
  }

  siteIds: any;
  user: any;
  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'typeId': new FormControl('', Validators.required),
      'reasonDescription': new FormControl('', Validators.required),
      'requestedBy': new FormControl('', Validators.required),
      'siteId': new FormControl('', Validators.required),
      'informedThrough': new FormControl('', Validators.required),

      'categoryId': new FormControl(''),
      'subCategoryId': new FormControl(''),
      'priorityId': new FormControl(''),
      // 'reasonId': new FormControl('')
    });

    this.getMetadata();
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!)?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  /* metadata */

  deviceType: any;
  deviceMode: any;
  ticketType: any;
  sourceOfRequest: any;
  ticketPriority: any;
  ticketCategory: any;
  ticketSubCategory: any;
  taskReason: any;
  getMetadata() {
    let data = JSON.parse(localStorage.getItem('metaData')!);
    for(let item of data) {
      if(item.type == 'Device_Type') {
        this.deviceType = item.metadata;
      } else if(item.type == 'Device_Mode') {
        this.deviceMode = item.metadata;
      } else if(item.type == 'Ticket_Type') {
        this.ticketType = item.metadata;
      } else if(item.type == 'Source_of_Request') {
        this.sourceOfRequest = item.metadata;
      } else if(item.type == 'Ticket_Priority') {
        this.ticketPriority = item.metadata;
      } else if(item.type == 'Ticket_Category') {
        this.ticketCategory = item.metadata;
      } else if(item.type == 'Ticket_Sub_Category') {
        this.ticketSubCategory = item.metadata;
      } else if(item.type == 'Task_Reason') {
        this.taskReason = item.metadata;
      }
    }
  }

  closeTicket() {
    this.newItemEvent.emit();
  }

  addNewAsset() {
    if(this.addAssetForm.valid) {
      if(this.tasks.length > 0) {
        this.alertSer.wait();
        this.ticketBody.ticket.createdBy = this.user?.UserId;
        this.ticketBody.tasks = this.tasks;
        this.inventorySer.createTicket(this.ticketBody).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        }, (err: any) => {
          if(err) {
            this.alertSer.error(err?.error?.message);
          };
        });
      } else {
        this.alertSer.error('Please add atleast one task')
      }
    }
    // console.log(this.ticketBody);
  }

}
