import { ElementRef, Injectable, NgZone, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { NewAdvertisementComponent } from 'src/app/components/new-advertisement/new-advertisement.component';
import { NewDeviceComponent } from 'src/app/components/new-device/new-device.component';
import Swal from 'sweetalert2';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone, private userSer: UserService) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.verticalPosition = "bottom";
    this.config.horizontalPosition = "center";
    this.config.duration = 3000;
  }

  snackSuccess(message: any) {
    this.config.panelClass = ["snackbar-container", "success"];
    this.show(message);
  }

  snackError(message: any) {
    this.config.panelClass = ["snackbar-container", "error"];
    this.show(message);
  }

  snackWarning(message: any) {
    this.config.panelClass = ["snackbar-container", "warning"];
    this.show(message);
  }

  show(message: any, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "x", config);
    });
  }


  /* sweet alert */
  error(message: any) {
    Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: message,
      showCloseButton: true
    })
  }

  success(message: any) {
    Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${message}`,
      showCloseButton: true,
      timer: 1500
    })
  }

  ruleSubject: Subject<boolean> = new Subject();
  successMessage(message: any) {
    Swal.fire({
      icon: 'success',
      title: "Advertisement Created Successfully",
      text: `${message}`,
      // showDenyButton: true,
      showCancelButton: true,
      // denyButtonText: "Use scheduled playback",
      confirmButtonText: "Do you want to add rules for this advertisement?",
    }).then((res) => {
      if (res.isConfirmed) {
        this.ruleSubject.next(true);
      }
    });
  }

  wait() {
    Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    })
  }

  confirmDialog() {
    return Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    })
  }

  async timeAlert() {
    const inputOptions = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          1: "4 hours",
          2: "6 hourseen",
          3: "8 hours"
        });
      }, 1000);
    });

    const { value: color } = await Swal.fire({
      title: "Select color",
      input: "radio",
      inputOptions: {
        1: "4 hours",
        2: "6 hours",
        3: "8 hours"
      },
      showCloseButton: true,
      allowOutsideClick: false,
      // preConfirm: (value) => {
      //   if (!value) {
      //     Swal.showValidationMessage(
      //       'You need to write something!'
      //     )
      //   }
      // }
      // inputOptions,
      // inputValidator: (value) => {
      //   if (!value) {
      //     return "You need to choose something!";
      //   }
      // }
    });
    if (color) {
      return color
    } else {
      return color
    }
  }

}
