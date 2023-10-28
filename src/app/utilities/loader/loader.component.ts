import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="loader"></div>`,
  styles: [`
    .loader {
      border: 8px solid #f3f3f3; /* Light grey */
      border-top: 8px solid #084982 ; /* Blue */
      border-radius: 50%;
      width: 100px;
      height: 100px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { 
        transform: rotate(0deg); 
      }
      100% {
        transform: rotate(360deg); 
      }
    }
  `]
})

export class LoaderComponent { }
