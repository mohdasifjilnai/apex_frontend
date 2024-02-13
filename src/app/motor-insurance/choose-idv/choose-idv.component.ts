import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-choose-idv',
  templateUrl: './choose-idv.component.html',
  styleUrls: ['./choose-idv.component.scss'],
})
export class ChooseIDVComponent implements OnInit {
  investedAmount: number = 600000;
  currentAmount:number=0;
  constructor(public bottomSheetRef: MatBottomSheetRef<ChooseIDVComponent>) {}

  ngOnInit(): void {}

  /**
   * onSliderRangeAmount function get value from slider
   */
  onSliderRangeAmount(event: any) {
    this.currentAmount=event?.value
  }


  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
