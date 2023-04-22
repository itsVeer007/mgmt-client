import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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

  success(message: string) {
    this.config.panelClass = ["success"];
    this.show(message);
  }

  error(message: string) {
    this.config.panelClass = ["error"];
    this.show(message);
  }

  wait(message: string, config?: MatSnackBarConfig) {
    this.config.panelClass = ["wait"];

    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, '', config);
    });

    this.config.duration = 10000;
  }


  show(message: string, config?: MatSnackBarConfig) {
    config = config || this.config;
    this.zone.run(() => {
      this.snackbar.open(message, "x", config);
    });
  }

}
