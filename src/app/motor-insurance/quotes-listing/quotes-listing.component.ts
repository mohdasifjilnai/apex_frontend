import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
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
  knowMoreText: string = 'Know More';
  shareQuotesDropdownValue: boolean = false;
  addShare: boolean = false;
  vehicleData: any;
  parsedVehicleData: any;
  vehicleTypeValue: any;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.postListInitiateQuotes(initiate_quotes_payload);
  }

  quotesListing: FormGroup = new FormGroup({
    proposalType: new FormControl('', Validators.required),
  });
  noQuotesInformation: any;

  ngOnInit(): void {
    this.getProposalType();
    this.vehicleTypeValue = localStorage.getItem('vehicleType');
    this.quotesTabData();
    this.startProgress();
    this.sharedDataService.quotationListing.subscribe((quotes) => {
      if (quotes) {
        if (this.progressValue == 100) {
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
      }
    });
    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.vehicleData = cardData;
        this.parsedVehicleData = JSON.parse(this.vehicleData);
        // this.getAddonList(this.vehicleTypeValue);
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

  postListInitiateQuotes(data: any) {
    // this.apiService.postRequestedResponse(ApiConstants.initiate_quotes,data).subscribe((res:any)=>{
    //   this.initiateQuotes=res;
    //   console.log(res,'res')
    // })
  }

  onComprehensiveTabChange(event: MatTabChangeEvent): void {
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
  selectQuotes() {
    this.addShare = true;
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
  getProposarType(event: any) {
    localStorage.setItem(
      'proposerType',
      this.proposalList.filter((res: any) => res.proposer_id == event)[0][
        'proposer_name'
      ]
    );
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
}
