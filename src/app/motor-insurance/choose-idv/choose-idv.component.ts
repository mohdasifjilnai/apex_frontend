import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-choose-idv',
  templateUrl: './choose-idv.component.html',
  styleUrls: ['./choose-idv.component.scss'],
})
export class ChooseIDVComponent implements OnInit {
  investedAmount: number = 0;
  currentAmount: number = 0;
  quotationData: any;
  quotationArray = [];
  progressValue = 0;
  minIdv: any;
  maxIdv: any;
  sliderValue: any;
  registrationNumber: any;
  idvShowHide: any;
  averageIdv: any;

  errorQuotationArray: any;
  customIDV: boolean=false;
  constructor(
    public bottomSheetRef: MatBottomSheetRef<ChooseIDVComponent>,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.sharedDataService.idvValue.subscribe((idvData) => {
      this.minIdv = idvData.min_idv;
      this.maxIdv = idvData.max_idv;
      this.averageIdv = idvData.averageIdv;
      this.currentAmount = this.averageIdv;
      let chooseIdvValue = sessionStorage.getItem('idvData');
      if (chooseIdvValue) {
        this.investedAmount = JSON.parse(chooseIdvValue);
      } else {
        this.investedAmount = this.averageIdv;
      }
    });

    this.sharedDataService.idvSliderHide.subscribe((idvHide) => {
      this.idvShowHide = idvHide;
    });
  }
  selectedIDVOption: string = ''; // Default selected option

  onSelectIDVOption(option: string) {
    if (option === '3') {
      // Show input field if "Choose IDV" option is selected
      this.customIDV = true; // Reset custom IDV value
    }
  }
  /**
   * onSliderRangeAmount function get value from slider
   */
  onSliderRangeAmount(event: any) {
    this.currentAmount = event;

    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    let chooseIdvValue = sessionStorage.setItem(
      'idvData',
      JSON.stringify(this.currentAmount)
    );
    if (this.registrationNumber) {
      this.sharedDataService.vehicleMMVDetails(
        productTypeValue,
        mmvFormData,
        'registrationNumber'
      );
    } else {
      this.sharedDataService.vehicleMMVDetails(
        productTypeValue,
        mmvFormData,
        'mmvQuotes'
      );
    }
  }

  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
