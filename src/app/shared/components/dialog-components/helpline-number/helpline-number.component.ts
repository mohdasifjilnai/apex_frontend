import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-helpline-number',
  templateUrl: './helpline-number.component.html',
  styleUrls: ['./helpline-number.component.scss']
})
export class HelplineNumberComponent implements OnInit {

  constructor(
    public bottomSheetRef: MatBottomSheetRef<HelplineNumberComponent>,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Function to close bottomSheet
   */
  cancelDial(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
