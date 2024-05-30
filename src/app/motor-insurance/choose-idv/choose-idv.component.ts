import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
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
  updateIdvButton = false;
  showIdv: any;
  isMobileView: boolean = false;
  // isPageRefresh = true;
  chooseIdvForm: FormGroup = new FormGroup({
    chooseIdv: new FormControl('', [Validators.required]),
  });
  errorQuotationArray: any;
  customIDV: boolean = false;
  clearIdvButton: boolean = false;

  currency: any;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<ChooseIDVComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
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

      this.chooseIdvValue = sessionStorage.getItem('idvData');
      let chooseIdvAmount;
      if (this.chooseIdvValue == 'undefined') {
        chooseIdvAmount = '';
      } else {
        chooseIdvAmount = JSON.parse(this.chooseIdvValue);
      }

      if (chooseIdvAmount) {
        this.clearIdvButton = true;
      }
      if (chooseIdvAmount?.chooseIdv) {
        this.investedAmount = chooseIdvAmount.chooseIdv;
        this.selectedIDVOption = 'choose';
        this.amountShow = this.averageIdv;
      } else if (chooseIdvAmount?.minIdv) {
        this.selectedIDVOption = 'min';

        this.amountShow = this.averageIdv;
        this.investedAmount = this.averageIdv;
      } else if (chooseIdvAmount?.maxIdv) {
        this.selectedIDVOption = 'max';
        this.amountShow = this.averageIdv;

        this.investedAmount = this.averageIdv;
      } else {
        this.investedAmount = this.averageIdv;
        this.amountShow = this.averageIdv;
      }
      this.chooseIdvForm.patchValue({
        chooseIdv: this.investedAmount,
      });
      this.changeToCurrency();
    });
    this.sharedDataService.idvValue.subscribe((idvData) => {
      if (idvData.min_idv != undefined) {
        this.minIdv = idvData.min_idv;
        this.maxIdv = idvData.max_idv;
        this.averageIdv = parseInt(idvData.averageIdv);
        this.currentAmount = this.averageIdv;
        this.chooseIdvValue = sessionStorage.getItem('idvData');
        let chooseIdvAmount;
        if (this.chooseIdvValue == 'undefined') {
          chooseIdvAmount = '';
        } else {
          chooseIdvAmount = JSON.parse(this.chooseIdvValue);
        }

        if (chooseIdvAmount) {
          this.clearIdvButton = true;
        }
        if (chooseIdvAmount?.chooseIdv) {
          this.investedAmount = chooseIdvAmount.chooseIdv;
          this.selectedIDVOption = 'choose';
          this.amountShow = this.averageIdv;
        } else if (chooseIdvAmount?.minIdv) {
          this.selectedIDVOption = 'min';

          this.amountShow = this.averageIdv;
          this.investedAmount = this.averageIdv;
        } else if (chooseIdvAmount?.maxIdv) {
          this.selectedIDVOption = 'max';
          this.amountShow = this.averageIdv;

          this.investedAmount = this.averageIdv;
        } else {
          this.investedAmount = this.averageIdv;
          this.amountShow = this.averageIdv;
        }
        this.chooseIdvForm.patchValue({
          chooseIdv: this.investedAmount,
        });
        this.changeToCurrency();
      }
    });

    this.sharedDataService.quotesEnableForMobile.subscribe((data) => {
      this.enableIdvCard = false;
    });
    this.sharedDataService.disableInitiatesQuotes.subscribe((idvData) => {
      this.enableIdvCard = true;
    });

    this.sharedDataService.chooseIdvDataShow.subscribe((idvData) => {
      this.showIdv = idvData;
    });

    this.sharedDataService.idvSliderHide.subscribe((idvHide) => {
      this.idvShowHide = idvHide;
    });
    if (window.innerWidth <= 999) {
      this.chooseIdvValue = sessionStorage.getItem('idvData');
      let chooseIdvAmount = JSON.parse(this.chooseIdvValue);
      this.isMobileView = true;
      this.quotesCount = this.data?.noOfInsurur;
      if (chooseIdvAmount != null) {
        if (chooseIdvAmount?.minIdv != '') {
          this.selectedIDVOption = 'min';
          this.minIdv = chooseIdvAmount?.minIdv;
        } else {
          this.minIdv = this.data?.minIdv;
        }
        if (chooseIdvAmount?.maxIdv != '') {
          this.selectedIDVOption = 'max';
          this.maxIdv = chooseIdvAmount?.maxIdv;
        } else {
          this.maxIdv = this.data?.maxIdv;
        }
        if (chooseIdvAmount?.chooseIdv != '') {
          this.selectedIDVOption = 'choose';
          this.amountShow = chooseIdvAmount?.chooseIdv;
        } else {
          this.amountShow = this.data?.averageIdv;
        }
      } else {
        this.minIdv = this.data?.minIdv;
        this.maxIdv = this.data?.maxIdv;
        this.amountShow = this.data?.averageIdv;
      }
      this.chooseIdvForm.patchValue({
        chooseIdv: this.amountShow,
      });
      this.changeToCurrency();
    }
  }
  selectedIDVOption: string = ''; // Default selected option

  onSelectIDVOption(option: string) {
    this.clearIdvButton = true;
    // this.sharedDataService.sendCarLoaderMessage(0);
    if (option === '3') {
      // Show input field if "Choose IDV" option is selected
      this.customIDV = true; // Reset custom IDV value
    }
    this.selectedIDVOption = option;
    if (option == 'min') {
      if (window.innerWidth <= 999) {
        this.bottomSheetRef.dismiss();
      }
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
      if (window.innerWidth <= 999) {
        this.bottomSheetRef.dismiss();
      }
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

  updateIdv() {
    if (this.selectedIDVOption) {
      // this.sharedDataService.sendCarLoaderMessage(0);
      if (window.innerWidth <= 999) {
        this.bottomSheetRef.dismiss();
      }
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
      this.updateIdvButton = false;
      this.idvBaseQuotes();
    }
  }
  cancelIdv() {
    // this.sharedDataService.sendCarLoaderMessage(0);
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    }
    this.selectedIDVOption = '';
    let idvData = sessionStorage.getItem('idvData');
    if (idvData) {
      sessionStorage.removeItem('idvData');
      this.idvBaseQuotes();
    }

    this.clearIdvButton = false;
    this.updateIdvButton = false;
  }
  idvBaseQuotes() {
    let productTypeValue = sessionStorage.getItem('productType');
    let mmvFormData = sessionStorage.getItem('mmv_data');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    // if (window.performance.navigation.type === 1) {
    //   console.log('Page was refreshed');
    //   this.isPageRefresh = false;
    //   sessionStorage.setItem('pageRefresh', JSON.stringify(this.isPageRefresh));
    // } else {
    //   console.log('Page was not refreshed');
    //   this.isPageRefresh = true;
    //   sessionStorage.setItem('pageRefresh', JSON.stringify(this.isPageRefresh));
    // }
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
    this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
  }
  /**
   * when user change in idv input field than min idv base handling doing in this function
   */
  chooseIdvData() {
    if (!this.enableIdvCard) {
      let formControlIdv = this.chooseIdvForm.value.chooseIdv;
      this.updateIdvButton = true;
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
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  changeToCurrency() {
    this.currency = this.chooseIdvForm.get('chooseIdv');

    let a = this.currency.value;
    if (/,/.test(a)) {
      a = a.replace(/,/g, '');
    } else {
      a = a;
    }

    if (a && !isNaN(+a)) {
      let num: number = +a;
      let currencyValue = new Intl.NumberFormat('en-IN').format(num); //inplace of en-IN you can mention your country's code

      currencyValue = currencyValue ? currencyValue.toString() : '';

      this.currency.setValue(currencyValue);
    }
  }
}
