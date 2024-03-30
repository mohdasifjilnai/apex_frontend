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
  updateIdvButton = false;
  chooseIdvForm: FormGroup = new FormGroup({
    chooseIdv: new FormControl('', [Validators.required]),
  });
  errorQuotationArray: any;
  customIDV: boolean = false;
  clearIdvButton: boolean = false;

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
    });

    this.sharedDataService.disableInitiatesQuotes.subscribe((idvData) => {
      this.enableIdvCard = true;
    });

    this.sharedDataService.idvSliderHide.subscribe((idvHide) => {
      this.idvShowHide = idvHide;
    });
  }
  selectedIDVOption: string = ''; // Default selected option

  onSelectIDVOption(option: string) {
    this.clearIdvButton = true;
    this.sharedDataService.sendCarLoaderMessage(0);
    if (option === '3') {
      // Show input field if "Choose IDV" option is selected
      this.customIDV = true; // Reset custom IDV value
    }
    this.selectedIDVOption = option;
    if (option == 'min') {
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
}
