import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from 'src/services/asset.service';
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

  @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`camera`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddCamera(false);
  //     }
  //   }
  // }

  addAssetForm: any = FormGroup;

  shortLink: string = "";
  file: File | null = null;
  // loading: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private ticketSer: TicketService, private dropDown: MetadataService) { }

  x = {
    ticket: {
      ticketType: '',
      ticketReason: '',
      site: '',
      siteId: '',
      dateCreated: '',
      priority: '',
      status: 'active',
    },
    tasks: [
      {
        taskName: "",
        description: "",
        remarks: ""
      }
    ]
  }

  taskss: any = [];

  onTaskAdd(item: any) {
    let x = {
      'taskName': item.taskName,
      'description': item.description,
      'remarks': item.remarks
    }

    this.taskss.push(x);
    // console.log(this.taskss);

    // this.x.tasks[0].taskName = '';
    // this.x.tasks[0].description = '';
    // this.x.tasks[0].remarks = ''
  }

  ngOnInit(): void {
    this.addAssetForm = this.fb.group({
      'ticketType': new FormControl(''),
      'ticketReason': new FormControl(''),
      'site': new FormControl('', Validators.required),
      'siteId': new FormControl('', Validators.required),
      'dateCreated': new FormControl(''),
      'priority': new FormControl(''),
      'status': new FormControl(''),

      // 'tasks': this.fb.group({
        'taskName': new FormControl(''),
        'desc': new FormControl(''),
        'remarks': new FormControl(''),
      // }),
    });
  }

  closeAddCamera() {
    this.newItemEvent.emit(false);
  }

  // openAnotherForm(newform:any) {
  //   // this.newItemEvent.emit(false);
  //   localStorage.setItem('opennewform', newform)
  //   this.closeAddCamera(false);
  // }

  addTicket0: any;
  addTicket1: any;
  addTicket2: any;
  addNewAsset() {
    // this.x.tasks = this.taskss;

    if(this.addAssetForm.valid) {
      this.addTicket2 = Swal.fire({
        text: "Please wait",
        imageUrl: "assets/gif/ajax-loading-gif.gif",
        showConfirmButton: false,
        allowOutsideClick: false
      });

      this.ticketSer.createTicket(this.x).subscribe((res) => {
        // console.log(res);

        if(res) {
          this.addTicket1 = Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: 'Created Ticket Successfully!',
          });
        }

        setTimeout(() => {
          // window.location.reload();
        }, 3000);
      }, (err: any) => {
        if(err) {
          this.addTicket0 = Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Ticket Creation failed',
            // timer: 3000,
          });
        };
      });
    }
    // console.log(this.x);
  }

}
