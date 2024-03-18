import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-choose-idv',
  templateUrl: './choose-idv.component.html',
  styleUrls: ['./choose-idv.component.scss'],
})
export class ChooseIDVComponent implements OnInit {
  investedAmount: number = 0;
  currentAmount: any = 0;
  quotationData: any = [];
  quotationArray = [];
  progressValue = 0;
  minIdv: any;
  maxIdv: any;
  sliderValue: any;
  registrationNumber: any;
  idvShowHide: any;
  averageIdv: any;
  amountShow: any;
  chooseIdvValue: any;
  quotesCount: any;
  idvError: any;
  chooseIdvForm: FormGroup = new FormGroup({
    chooseIdv: new FormControl('', [Validators.required]),
  });
  errorQuotationArray: any;
  customIDV: boolean=false;
  constructor(
    public bottomSheetRef: MatBottomSheetRef<ChooseIDVComponent>,
    private sharedDataService: SharedDataService
  ) {}
  enableIdvCard = true;
  ngOnInit(): void {
    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      // this.quotesCount = idvData;
      this.enableIdvCard = false;
      this.quotationData = [];
      if (idvData.length > 0) {
        for (let i = 0; i <= idvData.length - 1; i++) {
          idvData[i]['error_message'];
          if (idvData[i]['status']) {
            this.quotationData.push(idvData[i]);
          }
        }
      }
      if (this.quotationData.length > 0) {
        this.quotesCount = this.quotationData.length;
      } else {
        this.quotesCount = 0;
      }
    });
    this.sharedDataService.idvValue.subscribe((idvData) => {
      this.minIdv = idvData.min_idv;
      this.maxIdv = idvData.max_idv;
      this.averageIdv = parseInt(idvData.averageIdv);
      this.currentAmount = this.averageIdv;
      this.chooseIdvValue = sessionStorage.getItem('idvData');
      let chooseIdvAmount = JSON.parse(this.chooseIdvValue);
      if (chooseIdvAmount?.chooseIdv) {
        this.investedAmount = chooseIdvAmount.chooseIdv;
        this.selectedIDVOption = 'choose';
        this.amountShow = chooseIdvAmount.chooseIdv;
      } else if (chooseIdvAmount?.minIdv) {
        this.selectedIDVOption = 'min';

        this.investedAmount = this.averageIdv;
      } else if (chooseIdvAmount?.maxIdv) {
        this.selectedIDVOption = 'max';

        this.investedAmount = this.averageIdv;
      } else {
        this.investedAmount = this.averageIdv;
        this.amountShow = this.averageIdv;
      }
      this.chooseIdvForm.patchValue({
        chooseIdv: this.investedAmount,
      });
    });

    this.sharedDataService.idvSliderHide.subscribe((idvHide) => {
      this.idvShowHide = idvHide;
    });
  }
  selectedIDVOption: string = ''; // Default selected option

  onSelectIDVOption(option: string) {
    this.sharedDataService.sendCarLoaderMessage(0);
    if (option === '3') {
      // Show input field if "Choose IDV" option is selected
      this.customIDV = true; // Reset custom IDV value
    }
    this.selectedIDVOption = option;
    if (option == 'min') {
      this.amountShow = this.minIdv;
      let idvObject = {
        minIdv: this.minIdv,
        maxIdv: '',
        chooseIdv: '',
      };
      let chooseIdvValue = sessionStorage.setItem(
        'idvData',
        JSON.stringify(idvObject)
      );
      this.idvBaseQuotes();
    } else if (option == 'max') {
      this.amountShow = this.maxIdv;
      let idvObject = {
        minIdv: '',
        maxIdv: this.maxIdv,
        chooseIdv: '',
      };
      let chooseIdvValue = sessionStorage.setItem(
        'idvData',
        JSON.stringify(idvObject)
      );
      this.idvBaseQuotes();
    }
  }
  /**
   * onSliderRangeAmount function get value from slider
   */
  onSliderRangeAmount(event: any) {
    // this.currentAmount = event;
    // let productTypeValue = sessionStorage.getItem('productType');
    // let mmvFormData = sessionStorage.getItem('mmv_data');
    // this.registrationNumber = sessionStorage.getItem('registrationNumber');
    // let chooseIdvValue = sessionStorage.setItem(
    //   'idvData',
    //   JSON.stringify(this.currentAmount)
    // );
    // if (this.registrationNumber) {
    //   this.sharedDataService.vehicleMMVDetails(
    //     productTypeValue,
    //     mmvFormData,
    //     'registrationNumber'
    //   );
    // } else {
    //   this.sharedDataService.vehicleMMVDetails(
    //     productTypeValue,
    //     mmvFormData,
    //     'mmvQuotes'
    //   );
    // }
  }

  updateIdv() {
    if (this.selectedIDVOption) {
      this.currentAmount = this.chooseIdvForm.value.chooseIdv;
      this.investedAmount = this.currentAmount;
      let idvObject = {
        minIdv: '',
        maxIdv: '',
        chooseIdv: this.currentAmount,
      };
      let chooseIdvValue = sessionStorage.setItem(
        'idvData',
        JSON.stringify(idvObject)
      );
      this.idvBaseQuotes();
    }
  }
  idvBaseQuotes() {
    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');

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
    this.enableIdvCard = true;
  }
  /**
   * when user change in idv input field than min idv base handling doing in this function
   */
  chooseIdvData() {
    let formControlIdv = this.chooseIdvForm.value.chooseIdv;
    if (parseInt(formControlIdv) < parseInt(this.minIdv)) {
      this.idvError = true;
    } else if (parseInt(formControlIdv) > parseInt(this.maxIdv)) {
      this.idvError = true;
    } else {
      this.idvError = false;
    }
    let count = 0;

    for (let i = 0; i <= this.quotationData.length - 1; i++) {
      if (
        parseInt(formControlIdv) >= this.minIdv &&
        parseInt(formControlIdv) <= this.maxIdv
      ) {
        count += 1;
      }
    }
    this.quotesCount = count;
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
