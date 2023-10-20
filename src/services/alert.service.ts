import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  config: MatSnackBarConfig;

  constructor(private snackbar: MatSnackBar, private zone: NgZone) {
    this.config = new MatSnackBarConfig();
    this.config.panelClass = ["snackbar-container"];
    this.config.horizontalPosition = "right";
    this.config.duration = 3000;
  }

  snackSuccess(message: any) {
    this.config.panelClass = ["success"];
    this.show(message);
  }

  snackError(message: any) {
    this.config.panelClass = ["error"];
    this.config.panelClass = ['blue-snackbar']
    this.show(message);
  }

  snackWait(message: any, config?: MatSnackBarConfig) {
    this.config.panelClass = ["wait"];
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, '', config);
    });

    this.config.duration = 10000;
  }


  show(message: any, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "x", config);
    });
  }


  /* sweet alert */

  msg1: any;
  msg2: any;
  msg0: any;

  error(message: any) {
    this.msg0 = Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: message,
    })
  }

  success(message: any) {
    this.msg1 = Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${message}`
    })
  }

  wait() {
    this.msg2 = Swal.fire({
      text: "Please wait",
      imageUrl: "assets/gif/ajax-loading-gif.gif",
      showConfirmButton: false,
      allowOutsideClick: false
    })
  }

}
