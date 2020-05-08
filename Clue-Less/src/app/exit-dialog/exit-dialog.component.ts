import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-exit-dialog',
  templateUrl: './exit-dialog.component.html',
  styleUrls: ['./exit-dialog.component.less']
})
export class ExitDialogComponent {

  constructor(
      public dialogRef: MatDialogRef<ExitDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
        // data.exitFunction will be the disconnect function
      }

      onConfirm(): void {
        this.data.exitFunction();
      }

      onCancel(): void {
        this.dialogRef.close();
      }
}
