import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import initiate_quotes_payload from './initiate_quotes_payload.json';
import { ApiConstants } from '../../api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { PremiumBreakupComponent } from '../../shared/components/dialog-components/premium-breakup/premium-breakup.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';

import { ChooseIDVComponent } from '../choose-idv/choose-idv.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOnsComponent } from '../add-ons/add-ons.component';
import { QuotesDropdownComponent } from '../quotes-dropdown/quotes-dropdown.component';
import { ShareQuotesComponent } from '../../shared/components/dialog-components/share-quotes/share-quotes.component';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import moment from 'moment';
import { SelectedShareComponent } from 'src/app/shared/components/dialog-components/selected-share/selected-share.component';
@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  initiateQuotes: any;
  @Input() receivedCheckBoxValue: any[] = [];
  showComprehensiveDiv = true;
  individualSelected: any;
  lowHighSelected = 'low';
  proposalList: any;
  quotationData: any;
  quotationArray = [];
  errorQuotationArray: any;
  tabDataList: any;
  registrationDateMonth: any;
  registrationDateYear: any;
  registrationNumber: any;
  progressValue = 0;
  initiateQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: PremiumBreakupComponent,
    widthObtained: '500px',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: false,
    classObtained: 'initiate-quotes-class',
  };
  shareQuotesJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ShareQuotesComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'share-qoutes-class',
  };
  selectedShareJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: SelectedShareComponent,
    widthObtained: '100%',
    heightObtained: 'auto',
    topObtained: '0',
    isOutSideClose: true,
    classObtained: 'selected-share-class',
  };
  knowMoreText: string = 'Know More';
  shareQuotesDropdownValue: boolean = false;
  addShare: boolean = false;
  vehicleData: any;
  parsedVehicleData: any;
  vehicleTypeValue: any;
  selectedProductType: any;
  vehicleMMVData: any;
  defaultGST = true;
  isChecked: boolean = false;
  selectedQuotes: any[] = []; // You need to define the appropriate type for your quotes
  selectedShareData: any;
  isCheckboxChecked: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    // this.postListInitiateQuotes(initiate_quotes_payload);
  }

  quotesListing: FormGroup = new FormGroup({
    proposalType: new FormControl('', Validators.required),
  });
  noQuotesInformation: any;

  ngOnInit(): void {
    this.getProposalType();
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(document.body, 'dropdown-focus');
      }
    });
    // this.startProgress();
    this.sharedDataService.quotationListing.subscribe((quotes) => {
      if (quotes) {
        // if (this.progressValue == 100) {
        this.quotationArray = quotes;
        this.quotationData = [];
        this.errorQuotationArray = [];
        for (let i = 0; i <= this.quotationArray.length - 1; i++) {
          this.quotationArray[i]['error_message'];
          if (this.quotationArray[i]['status']) {
            this.quotationData.push(this.quotationArray[i]);
          } else {
            this.errorQuotationArray.push(this.quotationArray[i]);
          }
        }
      }
    });

    this.sharedDataService.quotesData.subscribe((quotes) => {
      this.quotesTabData();
    });
    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.vehicleData = cardData;
      this.parsedVehicleData = JSON.parse(this.vehicleData);

      this.quotesTabData();
    });
  }

  getProposalType() {
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type}`)
      .subscribe((res: any) => {
        if (res) {
          this.proposalList = res;
          this.quotesListing.patchValue({
            proposalType: 1,
          });
        }
      });
  }
  getProposalDetails(quotes_data: any) {
    sessionStorage.setItem('quotes_data', JSON.stringify(quotes_data));
    const transactionId = sessionStorage.getItem('transaction_id');
    this.router.navigate([`/motor/quotes/proposal/${transactionId}`]);
  }
  /**
   * this function is used for the no quotes information details
   */
  noQuotes(text: any) {
    if (text == 'View Less') {
      this.knowMoreText = 'Know More';
    } else {
      this.knowMoreText = 'View Less';
    }
    this.noQuotesInformation = !this.noQuotesInformation;
  }
  openChangeIDV(): void {
    this.bottomSheet.open(ChooseIDVComponent);
  }
  openAddons(): void {
    const bottomSheetRef = this.bottomSheet.open(AddOnsComponent);
    bottomSheetRef.afterDismissed().subscribe((data) => {
      this.receivedCheckBoxValue = data;
    });
  }
  openSort(dropdownType: any): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: dropdownType, // Pass your data here
    };
    this.bottomSheet.open(QuotesDropdownComponent, bottomSheetConfig);
  }
  /**
   * get initiate quotes list
   */

  onComprehensiveTabChange(event: MatTabChangeEvent): void {
    this.selectedProductType = event.tab.textLabel;
    sessionStorage.setItem('productType', this.selectedProductType);
    if (event.index === 1) {
      this.showComprehensiveDiv = false;
    } else {
      this.showComprehensiveDiv = true;
    }
  }

  /**
   * Open premium breakup modal
   */
  openPremiumBreakupModal(initiateQuotes: any, event: MouseEvent): void {
    // this.openPremiumBreakup(initiateQuotes);
    this.renderer.addClass(document.body, 'premium-breakout-css');
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: initiateQuotes,
    };
    if (window.innerWidth <= 999) {
      this.bottomSheet.open(PremiumBreakupComponent, bottomSheetConfig);
    } else {
      this.openModal(initiateQuotes, this.initiateQuotesJSON);
    }
  }
  // (click)="shareQuotesOpen(null, shareQuotesJSON)"
  shareQuotesOpen(shareData: any, jsonData: any) {
    this.openModal(shareData, jsonData);
  }
  shareQuotesDropdown() {
    this.shareQuotesDropdownValue = !this.shareQuotesDropdownValue;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.shareQuotesDropdownValue = false;
    }
  }
  /**
   * Selected Quotes Count UI Open
   */
  selectQuotes(count: any) {
    this.addShare = true;
    this.shareQuotesDropdownValue = false;
    if (count == 'all') {
      this.selectedQuotes = [];
      for (const [key, value] of Object.entries(this.quotationArray)) {
        this.isCheckboxChecked = true;
        this.isChecked = true;
        if (value['status'] == true) {
          this.selectedQuotes.push(value);
        }
      }
    } else {
      this.isCheckboxChecked = false;
      this.selectedQuotes = [];
    }
  }

  // Hide Selected share Button Component on cancel click
  cancelShare(condition: boolean) {
    this.addShare = condition;
    this.isCheckboxChecked = condition;
    this.isChecked = condition;
    this.selectedQuotes = [];
  }
  /**
   * Function call on checkbox checked
   */
  onCheckboxChange(quotes: any, event: any) {
    if (event.checked) {
      this.isChecked = true;
      this.selectedQuotes.push(quotes);
    } else {
      const index = this.selectedQuotes.indexOf(quotes);
      if (index !== -1) {
        this.selectedQuotes.splice(index, 1);
      }
    }
  }

  /**
   * this fucntion use open pop up modal
   */
  openModal(ObjData: any, jsonData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '100%';
      resTop = '0';
    }

    const obj: any = {
      modalName: jsonData['modalName'],
      width: jsonData['widthObtained'],
      height: jsonData['heightObtained'],
      classNameObtained: jsonData['classObtained'],
      isOutSideClose: jsonData['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
  /**
   * get proposer type in proposal list
   */
  changeProposalType(event: any) {
    sessionStorage.setItem(
      'proposerType',
      this.proposalList.filter((res: any) => res.proposer_id == event)[0][
        'proposer_name'
      ]
    );
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
    this.sharedDataService.addOnsChange(mmvFormData);
  }

  quotesTabData() {
    if (this.parsedVehicleData != undefined) {
      let registrationDate = new Date(
        this.parsedVehicleData?.registration_date
      );
      let dateObj = moment(registrationDate, 'MM/YYYY');
      let registrationMonth = moment(dateObj).month();
      this.registrationDateMonth = moment(registrationMonth + 1, 'MM').format(
        'MM'
      );
      this.registrationDateYear = moment(dateObj).year();

      let policyExpired = new Date(this.parsedVehicleData?.policy_expiry_date);
      let expiredDate = moment(policyExpired).format('DD/MM/YYYY');
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.getCoverageType}?reg_year=${this.registrationDateYear}&vehicle_type=${this.vehicleTypeValue}&previous_policy_type=${this.parsedVehicleData?.policy_expiry}&previous_policy_expiry_date=${expiredDate}`
        )
        .subscribe((res: any) => {
          this.tabDataList = res;
          this.selectedProductType = this.tabDataList[0].code;
          sessionStorage.setItem('productType', this.selectedProductType);
          this.registrationNumber =
            sessionStorage.getItem('registrationNumber');
          this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
          let mmvFormData = sessionStorage.getItem('mmv_data');
          if (this.registrationNumber) {
            this.sharedDataService.vehicleMMVDetails(
              this.selectedProductType,
              mmvFormData,
              'registrationNumber'
            );
          } else {
            this.sharedDataService.vehicleMMVDetails(
              this.selectedProductType,
              mmvFormData,
              'mmvQuotes'
            );
          }
          this.sharedDataService.addOnsChange(mmvFormData);
        });
    }
  }
  intervalId: any = null;
  startProgress() {
    this.intervalId = setInterval(() => {
      this.progressValue += 1;
      if (this.progressValue >= 100) {
        clearInterval(this.intervalId);
      } else {
        const position = this.progressValue * 15;
        // Use the position value as needed, for example, update the style of an element
        const translatedX = this.getImagePosition();
      }
    }, 200); // Interval of 1 second
  }
  getImagePosition(): string {
    const position = this.progressValue * 15; // Adjust the multiplier based on your desired movement
    return `translateX(${position}%)`;
  }

  gstToggle(event: any) {
    if (event.checked) {
      this.defaultGST = event.checked;
    } else {
      this.defaultGST = event.checked;
    }
    sessionStorage.setItem('gstValue', JSON.stringify(this.defaultGST));
  }
}
