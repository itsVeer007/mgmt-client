import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { TicketService } from 'src/services/ticket.service';
import Swal from 'sweetalert2';

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
  @Output() addTicket = new EventEmitter<any>();

  addAssetForm: any = FormGroup;

  shortLink: string = "";
  file: File | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ticketSer: TicketService,
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
      createdBy: 1,
    },

    tasks: [
      {
        categoryId: null,
        subCategoryId: null,
        priorityId: null,
        reasonId: null,
        createdBy: 1,
      }
    ]
  }

  tasks: any = [];
  onTaskAdd(item: any) {
    let takBody = {
      'categoryId': item.categoryId,
      'subCategoryId': item.subCategoryId,
      'priorityId': item.priorityId,
      'reasonId': item.reasonId,
      'createdBy': 1,
    }
    this.tasks.push(takBody);

    this.ticketBody.tasks[0].categoryId = null;
    this.ticketBody.tasks[0].subCategoryId = null;
    this.ticketBody.tasks[0].priorityId = null;
    this.ticketBody.tasks[0].reasonId = null;
  }

  siteIds: any
  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'typeId': new FormControl('', Validators.required),
      'reasonDescription': new FormControl('', Validators.required),
      'requestedBy': new FormControl(''),
      'siteId': new FormControl(''),
      'informedThrough': new FormControl(''),

      'categoryId': new FormControl(''),
      'subCategoryId': new FormControl(''),
      'priorityId': new FormControl(''),
      'reasonId': new FormControl('')
    });

    this.onMetadataChange();
    this.siteIds = JSON.parse(localStorage.getItem('siteIds')!)?.sort((a: any, b: any) => a.siteid < b.siteid ? -1 : a.siteid > b.siteid ? 1 : 0);
  }

    /* metadata methods */

    deviceType: any;
    deviceMode: any;
    ticketType: any;
    sourceOfRequest: any;
    ticketPriority: any;
    ticketCategory: any;
    ticketSubCategory: any;
    taskReason: any;
    onMetadataChange() {
      this.dropDown.getMetadata().subscribe((res: any) => {
        for(let item of res) {
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
      })
    }

  closeAddCamera() {
    this.newItemEvent.emit(false);
    // this.addTicket.emit();
  }

  addNewAsset() {
    // console.log(this.ticketBody);
    if(this.addAssetForm.valid) {
      this.alertSer.wait();
      this.newItemEvent.emit(false);
      this.ticketBody.tasks = this.tasks;
      this.ticketSer.createTicket(this.ticketBody).subscribe((res) => {
        // console.log(res);
        if(res) {
          this.alertSer.success(res);
          // this.addTicket.emit();
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, (err: any) => {
        if(err) {
          this.alertSer.error();
        };
      });
    }
  }

}
