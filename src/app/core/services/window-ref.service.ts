import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailsPopupComponent } from 'src/app/motor-insurance/vehicle-details-popup/vehicle-details-popup.component';

function _window(): any {
  return window;
}

@Injectable()
export class WindowRef {
  get nativeWindow(): any {
    return _window();
  }

  constructor(public dialog: MatDialog) {}

  /**
   * This Function open the vehicle Details popup
   */
  openDialog(): void {
    /**
     * Open the dialog using the MatDialog service
     */
    const dialogRef = this.dialog.open(VehicleDetailsPopupComponent, {
      /**
       * Set the width of the dialog
       */
      width: '750px',
      /**
       * Set the position of the dialog at the top of the screen with a small margin from the top
       */
      position: { top: '9.50rem' },

      disableClose: true,
    });

    /**
     * Subscribe to the afterClosed event to perform actions when the dialog is closed
     */
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
