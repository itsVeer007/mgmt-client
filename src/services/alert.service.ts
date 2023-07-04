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
    this.config.duration = 3000;
  }

  // success(message: string) {
  //   this.config.panelClass = ["success"];
  //   this.show(message);
  // }

  // error(message: string) {
  //   this.config.panelClass = ["error"];
  //   this.show(message);
  // }

  // wait(message: string, config?: MatSnackBarConfig) {
  //   this.config.panelClass = ["wait"];

  //   config = config || this.config;
  //   this.zone.run(() => {
  //     this.snackbar.open(message, '', config);
  //   });

  //   this.config.duration = 10000;
  // }


  // show(message: string, config?: MatSnackBarConfig) {
  //   config = config || this.config;
  //   this.zone.run(() => {
  //     this.snackbar.open(message, "x", config);
  //   });
  // }


  msg1: any;
  msg2: any;
  msg0: any;

  error() {
    this.msg0 = Swal.fire({
      icon: 'error',
      title: 'Failed!',
      text: 'Process failed',
    })
  }

  success(res: any) {
    this.msg1 = Swal.fire({
      icon: 'success',
      title: `Done!`,
      text: `${res.message}`
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
