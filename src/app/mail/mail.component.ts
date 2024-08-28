import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, FormControl,Validators,} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent {
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public alert:AlertService,
    private http:HttpClient,
    private adver:AdvertisementsService

  ) {

  }

  ngOnInit() {
    this.userForm = this.fb.group({
      'recipientEmails': new FormControl('', Validators.required),
      'name':new FormControl('', Validators.required),
      'Bcc': new FormControl(''),
      'Cc': new FormControl(''),
      'subject':new FormControl('',Validators.required),
      'body': new FormControl('', Validators.required),
      'files':new FormControl('', Validators.required),
      'fileName':new FormControl(''),
      'footer': new FormControl(''),
      'regardsFrom': new FormControl('', Validators.required),
      'createdBy': new FormControl('')
    })
  }

  userForm!: FormGroup;
  

  @ViewChild('mailItemsDialog') mailItemsDialog = {} as TemplateRef<any>;
  // openButton() {
  //   this.dialog.open(this.mailItemsDialog)
   
  // }

  openButton() {
    const dialogRef = this.dialog.open(this.mailItemsDialog, {
      width:'30%',
      // height:'90%'
      // position: { right: '10px', top: '280px' }
    });
    this.userForm.reset()
  
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  maximizeDialog(): void {
    const dialogRef = this.dialog.open(this.mailItemsDialog, {
      width: '50vw',
      height: '70vh',
      position: { right: '30%' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
    });
  }


  openForm:boolean = false;
  openForm2:boolean = false;
  openFirst() {
    this.openForm = ! this.openForm
    }

    openSecond() {
      this.openForm2 = !this.openForm2
    }
 

  submit() {
    if(this.userForm.valid) {
      // this.alert.wait();
      this.adver.postMail(this.userForm.value, this.selectedFile).subscribe((res:any)=> {
        console.log(res)
        this.userForm.reset();
        if(res.statusCode == 200) {
          this.alert.success(res.message)
        }
      },(err:any)=> {
        this.alert.error(err?.error?.message)
      })
    } 
   
  }

  selectedFile:any = [];
  fileUpload(event:any) {
    console.log(event.target.files[0])
    this.selectedFile = event.target.files[0]
  }

}
