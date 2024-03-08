import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-choose-idv',
  templateUrl: './choose-idv.component.html',
  styleUrls: ['./choose-idv.component.scss'],
})
export class ChooseIDVComponent implements OnInit {
  investedAmount: number = 500000;
  currentAmount:number=500000;
  quotationData: any;
  quotationArray = [];
  progressValue = 0;
  errorQuotationArray: any;
  constructor(public bottomSheetRef: MatBottomSheetRef<ChooseIDVComponent>,
    private sharedDataService: SharedDataService,) {
  }

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
