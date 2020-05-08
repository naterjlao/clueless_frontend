import { Component, Inject } from '@angular/core';
import { ServerService } from '../server-service/server.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exit-dialog',
  templateUrl: './exit-dialog.component.html',
  styleUrls: ['./exit-dialog.component.less']
})
export class ExitDialogComponent {

  constructor(private router: Router, private serverSvc: ServerService,
      public dialogRef: MatDialogRef<ExitDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        // data.exitFunction will be the disconnect function
      }

      onConfirm(): void {
        this.disconnect();
      }

      onCancel(): void {
        this.dialogRef.close();
      }

      goToPage(pageName:string){
        this.router.navigate([`${pageName}`]);
      }

      disconnect() {
        this.serverSvc.removeSocket();
        this.goToPage('start');
      }
}
