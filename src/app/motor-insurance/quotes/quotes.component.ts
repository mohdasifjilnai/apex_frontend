import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDetailsPopupComponent } from '../vehicle-details-popup/vehicle-details-popup.component';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.openDialog()
  }

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

      disableClose: true
    });

    /**
 * Subscribe to the afterClosed event to perform actions when the dialog is closed
 */
    dialogRef.afterClosed().subscribe(result => {
    });

  }


}
