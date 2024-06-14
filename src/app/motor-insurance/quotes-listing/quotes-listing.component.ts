import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { NonPosPopupComponent } from '../non-pos-popup/non-pos-popup.component';
@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  initiateQuotes: any;
  // @Input() receivedCheckBoxValue: any[] = [];
  showComprehensiveDiv = true;
  individualSelected: any;
  lowHighSelected = 'low';
  proposalList: any;
  quotationData: any = [];
  quotationArray = [];
  errorQuotationArray: any;
  tabDataList: any;
  registrationDateMonth: any;
  registrationDateYear: any;
  registrationNumber: any;
  progressValue = 0;
  chooseIdvArray: any;
  mmvFormData: any = '';
  owner_type: any = '';
  gstValue: any;
  emailInsurer: any;
  selectedTabIndex: any;
  refreshPageApiHandling = false;
  proposalTypeValueOninit = true;
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
  defaultGST: any;
  isChecked: boolean = false;
  selectedQuotes: any[] = []; // You need to define the appropriate type for your quotes
  selectedShareData: any;
  isCheckboxChecked: boolean = false;
  selectAddOnsList: any;
  shareType: any = '';
  enableIdvCard: boolean = true;
  isIdvGreaterThan50Lac: any;
  inspectionCase = '';
  tabChangeOninit = true;
  proposalTypeOninit = true;
  policyExpiryInspection: any = '';
  currentDate: any = '';
  sortObjectkey: any;
  nonPOSJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: NonPosPopupComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'nonPOS-class',
  };
  minIdv: any;
  maxIdv: any;
  averageIdv: any;
  registrationNumberData: any;
  renewalDetails: any;
  renewalType: any;
  insurerCode: any;
  renewalDataList = false;
  // isPageRefresh = true;
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
    // sessionStorage.removeItem('gstValue');
    if (sessionStorage.getItem('sortObjectkey') == null) {
      sessionStorage.setItem('sortObjectkey', 'low');
    }
    this.gstValue = sessionStorage.getItem('gstValue');
    if (this.gstValue) {
      this.defaultGST = JSON.parse(this.gstValue);
    } else {
      this.defaultGST = false;
    }
    this.sortObjectkey = sessionStorage.getItem('sortObjectkey');
    if (this.sortObjectkey) {
      this.lowHighSelected = this.sortObjectkey;
    }
    this.sharedDataService.enableQuotesAction.subscribe((idvData) => {
      if (this.enableIdvCard) {
        this.enableIdvCard = false;
        this.tabChangeOninit = false;
        this.sortObjectkey = sessionStorage.getItem('sortObjectkey');
        if (this.sortObjectkey) {
          this.lowHighSelected = this.sortObjectkey;
        }

        this.sorting(this.sortObjectkey);
      }
    });

    this.sharedDataService.disableInitiatesQuotes.subscribe((idvData) => {
      this.enableIdvCard = true;
      this.quotationData = [];
    });

    this.sharedDataService.updateVehicleType.subscribe((updateVehicleType) => {
      this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    });

    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(document.body, 'dropdown-focus');
      }
    });
    let popupData = sessionStorage.getItem('vehiclePopup');
    // if (popupData) {
    //   this.progressValue = 0;
    //   this.startProgress(0);
    // }

    this.sharedDataService.getProgressValue.subscribe((res) => {
      this.progressValue = 0;
      this.startProgress(res);
    });
    this.sharedDataService.quotationListing.subscribe((quotes) => {
      if (quotes) {
        // if (this.progressValue == 100) {
        this.selectedQuotes = [];
        this.isCheckboxChecked = false;
        this.quotationArray = quotes;
        // this.quotationData = [];
        this.errorQuotationArray = [];
        this.chooseIdvArray = [];
        if (this.quotationArray.length > 0) {
          for (let i = 0; i <= this.quotationArray.length - 1; i++) {
            this.quotationArray[i]['error_message'];
            if (this.quotationArray[i]['status']) {
              let quotesValueList = this.quotationData.findIndex(
                (item: any) => {
                  if (
                    item.insurer_code == this.quotationArray[i]['insurer_code']
                  ) {
                    return item;
                  }
                }
              );

              if (quotesValueList == -1) {
                this.quotationData.push(this.quotationArray[i]);
              }
            } else {
              this.errorQuotationArray.push(this.quotationArray[i]);
            }
          }
          if (this.quotationData.length > 0) {
            for (let i = 0; i <= this.quotationData.length - 1; i++) {
              if (
                this.quotationData[i]?.premium_details?.min_idv ||
                this.quotationData[i]?.premium_details?.min_idv == 0
              ) {
                let idvData = {
                  insurer_code: this.quotationData[i]?.insurer_code,
                  min_idv: this.quotationData[i]?.premium_details?.min_idv,
                  max_idv: this.quotationData[i]?.premium_details?.max_idv,
                  idv: this.quotationData[i]?.premium_details?.idv,
                };
                this.chooseIdvArray.push(idvData);
              }
            }
          }
          this.chooseIdv();
        } else {
          this.quotationData = [];
          this.errorQuotationArray = [];
          this.chooseIdvArray = [];
        }
        if (window.innerWidth <= 999) {
          this.sharedDataService?.sendQuoteData(this.quotationData);
        }
      }
    });

    this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
      this.vehicleData = cardData;

      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.tabChangeOninit = true;
      this.quotesTabData('notSendTransactionId');
    });
    this.sharedDataService.vehicleCardEmailValue.subscribe((cardData) => {
      this.vehicleData = cardData;

      this.parsedVehicleData = JSON.parse(this.vehicleData);
      this.tabChangeOninit = true;
      this.quotesTabData();
    });

    this.sharedDataService.selectedADDOnsList.subscribe((addons) => {
      this.selectAddOnsList = [];
      this.selectAddOnsList = addons;
    });
    let mmvFromData = sessionStorage.getItem('mmv_data');
    if (mmvFromData) {
      this.parsedVehicleData = JSON.parse(mmvFromData);

      // this.quotesTabData();
    }

    sessionStorage.removeItem('renewalInsurerQuotesId');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    if (!this.registrationNumber) {
      this.getProposalType();
    }
    this.sharedDataService.regNumberData.subscribe((numberData) => {
      this.registrationNumberData = numberData;
      this.getProposalType();
    });
    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType == 'renewal') {
      const quotesData: any = JSON.parse(
        sessionStorage.getItem('quotes_data') || '{}'
      );
      this.insurerCode = quotesData?.insurer_code;
    }

    // let currentPageUrl = this.router.url;
    // if (window.performance.navigation.type === 1) {
    //   console.log('Page was refreshed');

    //   let vehicledetailPopup = sessionStorage.getItem('vehiclePopup');
    //   if (vehicledetailPopup) {
    //     this.isPageRefresh = false;
    //     sessionStorage.setItem(
    //       'pageRefresh',
    //       JSON.stringify(this.isPageRefresh)
    //     );
    //   } else {
    //     this.isPageRefresh = true;
    //     sessionStorage.setItem(
    //       'pageRefresh',
    //       JSON.stringify(this.isPageRefresh)
    //     );
    //   }
    // } else {
    //   console.log('Page was not refreshed');
    //   this.isPageRefresh = true;
    //   sessionStorage.setItem('pageRefresh', JSON.stringify(this.isPageRefresh));
    // }
  }

  getProposalType() {
    if (this.proposalTypeValueOninit) {
      this.proposalTypeValueOninit = false;
      this.apiService
        .getRequestedResponse(`${ApiConstants.proposal_type}`)
        .subscribe((res: any) => {
          if (res) {
            this.proposalList = res;
            if (this.registrationNumberData) {
              let proposalTypeValue = sessionStorage.getItem('proposerType');
              if (!proposalTypeValue) {
                this.owner_type = this.registrationNumberData.customer_type;
                for (let i = 0; i <= this.proposalList.length - 1; i++) {
                  if (this.proposalList[i].proposer_name == this.owner_type) {
                    this.quotesListing.patchValue({
                      proposalType: this.proposalList[i].proposer_id,
                    });
                  }
                }
                sessionStorage.setItem('proposerType', this.owner_type);
              } else {
                this.owner_type = proposalTypeValue;
                for (let i = 0; i <= this.proposalList.length - 1; i++) {
                  if (this.proposalList[i].proposer_name == this.owner_type) {
                    this.quotesListing.patchValue({
                      proposalType: this.proposalList[i].proposer_id,
                    });
                  }
                }
              }
            } else {
              let proposalTypeValue = sessionStorage.getItem('proposerType');
              if (!proposalTypeValue) {
                this.owner_type = this.proposalList[0]?.proposer_name;
                this.quotesListing.patchValue({
                  proposalType: this.proposalList[0].proposer_id,
                });
                sessionStorage.setItem('proposerType', this.owner_type);
              } else {
                this.owner_type = proposalTypeValue;
                for (let i = 0; i <= this.proposalList.length - 1; i++) {
                  if (this.proposalList[i].proposer_name == this.owner_type) {
                    this.quotesListing.patchValue({
                      proposalType: this.proposalList[i].proposer_id,
                    });
                  }
                }
              }
            }
          }
        });
    }
  }

  /**
   * chooseIdv use for get the minimum and maximum idv from the quotes
   */
  chooseIdv() {
    if (this.chooseIdvArray.length > 0) {
      let minIdv = this.chooseIdvArray[0]?.min_idv;
      let maxIdv = this.chooseIdvArray[0]?.max_idv;

      this.chooseIdvArray.forEach((obj: any) => {
        if (obj.min_idv < minIdv) {
          minIdv = obj.min_idv;
        }
        if (obj.max_idv > maxIdv) {
          maxIdv = obj.max_idv;
        }
      });
      let totalIdv = 0;
      this.chooseIdvArray.forEach((item: any) => {
        totalIdv += item.idv;
      });
      const averageIdv = totalIdv / this.chooseIdvArray.length;
      this.minIdv = minIdv;
      this.maxIdv = maxIdv;
      this.averageIdv = averageIdv.toFixed(0);

      this.sharedDataService.chooseIdvData(
        minIdv,
        maxIdv,
        averageIdv.toFixed(0)
      );
    }
  }
  getProposalDetails(quotes_data: any) {
    sessionStorage.setItem('quotes_data', JSON.stringify(quotes_data));
    const transactionId = sessionStorage.getItem('transaction_id');

    if (quotes_data?.premium_details?.idv > 5000000) {
      this.isIdvGreaterThan50Lac = true;
    }
    if (this.isIdvGreaterThan50Lac) {
      this.openNonPOSPopup(null);
    } else {
      this.router.navigate([`quotes/proposal/${transactionId}`]);
    }
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
    this.chooseIdv();
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: {
        minIdv: this.minIdv,
        maxIdv: this.maxIdv,
        averageIdv: this.averageIdv,
        noOfInsurur: this.chooseIdvArray.length,
      }, // Pass your data here
    };
    const bottomSheetRef = this.bottomSheet.open(
      ChooseIDVComponent,
      bottomSheetConfig
    );
    bottomSheetRef.afterDismissed().subscribe((dataReceived: any) => {});
    ``;
    this.sharedDataService.enableQuotesData('false');
  }
  openAddons(): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      data: {
        addonList: sessionStorage.getItem('selectedAddons'),
      }, // Pass your data here
    };
    const bottomSheetRef = this.bottomSheet.open(
      AddOnsComponent,
      bottomSheetConfig
    );
    bottomSheetRef.afterDismissed().subscribe((data) => {
      // this.receivedCheckBoxValue = data;
    });
    // this.sharedDataService.sendSelectedData(this.quotationData);
    this.sharedDataService.enableQuotesData(this.quotationData);
  }
  openSort(dropdownType: any): void {
    const bottomSheetConfig: MatBottomSheetConfig = {
      disableClose: true,
      data: dropdownType, // Pass your data here
    };
    const bottomSheetRef = this.bottomSheet.open(
      QuotesDropdownComponent,
      bottomSheetConfig
    );
    bottomSheetRef.afterDismissed().subscribe((dataReceived: any) => {
      this.progressValue = 0;
      // this.startProgress(this.progressValue);
      // Handle the data received from the bottom sheet
      this.owner_type = sessionStorage.getItem('proposerType');
    });
  }
  /**
   * get initiate quotes list
   */

  onComprehensiveTabChange(event: MatTabChangeEvent): void {
    // this.progressValue = 0;
    // this.startProgress(0);
    this.selectAddOnsList = [];
    const selectedIndex = event.index;
    if (event.index === 1) {
      this.showComprehensiveDiv = false;
    } else {
      this.showComprehensiveDiv = true;
    }
    /**
     * Access the tab data using the index
     */
    const selectedTab = this.tabDataList[selectedIndex];
    const selectedName = selectedTab.name;
    const selectedCode = selectedTab.code;
    /**
     * Create an object to store both name and code
     */
    const selectedTabData = { name: selectedName, code: selectedCode };
    sessionStorage.setItem('planType', JSON.stringify(selectedTabData));
    const lastIndex = sessionStorage.getItem('lastSelectedTabIndex');
    if (lastIndex !== null && lastIndex !== 'undefined') {
      // Set the last selected tab
      this.selectedTabIndex = JSON.parse(lastIndex);
    } else {
      this.selectedTabIndex = 0;
    }
    this.selectedProductType = event.tab.textLabel;
    sessionStorage.setItem('productType', this.selectedProductType);
    if (!this.tabChangeOninit) {
      sessionStorage.setItem(
        'lastSelectedTabIndex',
        JSON.stringify(event.index)
      );
      sessionStorage.removeItem('selectedAddons');
      // this.progressValue = 0;
      // this.startProgress(0);
      this.selectedProductType = event.tab.textLabel;
      sessionStorage.setItem('productType', this.selectedProductType);
      let productTypeValue = sessionStorage.getItem('productType');
      this.mmvFormData = sessionStorage.getItem('mmv_data');
      let mmvFormValue = JSON.parse(this.mmvFormData);
      this.registrationNumber = sessionStorage.getItem('registrationNumber');
      this.quotationData = [];
      this.errorQuotationArray = [];
      if (!this.parsedVehicleData?.policy_expiry_date_email) {
        if (this.registrationNumber) {
          this.sharedDataService.vehicleMMVDetails(
            productTypeValue,
            this.mmvFormData,
            'registrationNumber'
          );
        } else {
          this.sharedDataService.vehicleMMVDetails(
            productTypeValue,
            this.mmvFormData,
            'mmvQuotes'
          );
        }
      }

      this.sharedDataService.addOnsChange(this.mmvFormData);
      // if (event.index === 1) {
      //   this.showComprehensiveDiv = false;
      // } else {
      //   this.showComprehensiveDiv = true;
      // }

      if (
        productTypeValue == 'comprehensive' &&
        this.parsedVehicleData?.policy_expiry == 'satp'
      ) {
        this.inspectionCase = 'Inspection';
      } else if (mmvFormValue?.policy_expiry_date) {
        this.policyExpiryInspection = new Date(
          mmvFormValue?.policy_expiry_date
        );

        this.currentDate = new Date();
        this.currentDate.setHours(0, 0, 0, 0); // Set time part to midnight

        this.policyExpiryInspection.setHours(0, 0, 0, 0); // Set time part to midnight
        this.inspectionCase = '';
        if (this.policyExpiryInspection < this.currentDate) {
          if (productTypeValue == 'saod') {
            this.inspectionCase = 'Inspection';
          }
        }
      } else {
        this.inspectionCase = '';
      }
      this.sharedDataService.inspectionCaseData(this.inspectionCase);

      this.sharedDataService.chooseIdvHide(this.selectedProductType);
      this.sharedDataService.tabChangeModified(true);
      this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
      this.tabChangeOninit = true;
    }
    // this.tabChangeOninit = false;
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
  @ViewChild('checkboxRef')
  checkboxRef!: MatCheckbox;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.shareQuotesDropdownValue = false;
      if (this.shareType == 'all') {
        this.isChecked = true;
        this.shareType = '';
      } else if (this.shareType == 'single') {
        this.isChecked = false;
        this.shareType = '';
      } else {
        this.isChecked = false;
      }
      // this.checkboxRef.checked = false;
    }
  }
  /**
   * Selected Quotes Count UI Open
   */
  selectQuotes(count: any) {
    this.shareType = count;
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
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
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
    if (!this.proposalTypeOninit) {
      // this.progressValue = 0;
      // this.startProgress(0);
      let proposarTypeData = sessionStorage.getItem('proposerType');
      let selectedProposarType = this.proposalList.filter(
        (res: any) => res.proposer_id == event
      )[0]['proposer_name'];

      if (selectedProposarType != proposarTypeData) {
        sessionStorage.removeItem('selectedAddons');
        this.refreshPageApiHandling = false;
      }
      sessionStorage.setItem('proposerType', selectedProposarType);
      let productTypeValue = sessionStorage.getItem('productType');
      let mmvFormData = sessionStorage.getItem('mmv_data');
      this.registrationNumber = sessionStorage.getItem('registrationNumber');
      this.quotationData = [];
      this.errorQuotationArray = [];
      this.chooseIdvArray = [];
      if (this.registrationNumber) {
        this.sharedDataService.vehicleMMVDetails(
          productTypeValue,
          mmvFormData,
          'registrationNumber'
        );
      } else {
        let mmvIdData = JSON.parse(sessionStorage.getItem('mmv_data') || '{}');
        let objectValue = Object.keys(mmvIdData);
        this.renewalDataList = false;

        for (let i = 0; i <= objectValue.length - 1; i++) {
          if (objectValue[i] == 'vehicle_make') {
            this.renewalDataList = true;
          }
        }
        if (this.renewalDataList && !this.refreshPageApiHandling) {
          this.sharedDataService.vehicleMMVDetails(
            productTypeValue,
            mmvFormData,
            'mmvQuotes'
          );
        }
        this.refreshPageApiHandling = false;
      }
      this.sharedDataService.addOnsChange(mmvFormData);
      this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
    } else {
      this.proposalTypeOninit = false;
    }
  }

  quotesTabData(notSendTransactionId?: any) {
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
      let expiredDate;
      if (this.parsedVehicleData?.policy_expiry_date) {
        let policyExpired = new Date(
          this.parsedVehicleData?.policy_expiry_date
        );
        expiredDate = moment(policyExpired).format('DD/MM/YYYY');
      } else if (this.parsedVehicleData?.policy_expiry_date_email) {
        expiredDate = this.parsedVehicleData?.policy_expiry_date_email;
      } else {
        expiredDate = '';
      }
      this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.getCoverageType}?reg_year=${this.registrationDateYear}&vehicle_type=${this.vehicleTypeValue}&previous_policy_type=${this.parsedVehicleData?.policy_expiry}&previous_policy_expiry_date=${expiredDate}`
        )
        .subscribe((res: any) => {
          this.tabDataList = res;
          this.selectedProductType = this.tabDataList[0].code;
          let productTypeValue = sessionStorage.getItem('productType');
          let tabData = this.tabDataList.findIndex((item: any) => {
            if (item.code == productTypeValue) {
              return item;
            }
          });

          if (tabData == -1) {
            sessionStorage.setItem('productType', this.selectedProductType);
          }
          if (!productTypeValue) {
            sessionStorage.setItem('productType', this.selectedProductType);
          }
          let getProductTypeName = sessionStorage.getItem('productType');
          this.mmvFormData = sessionStorage.getItem('mmv_data');
          let mmvFormValue = JSON.parse(this.mmvFormData);

          if (
            productTypeValue == 'comprehensive' &&
            this.parsedVehicleData?.policy_expiry == 'satp'
          ) {
            this.inspectionCase = 'Inspection';
          } else if (mmvFormValue?.policy_expiry_date) {
            this.policyExpiryInspection = new Date(
              mmvFormValue?.policy_expiry_date
            );

            this.currentDate = new Date();
            this.currentDate.setHours(0, 0, 0, 0); // Set time part to midnight

            this.policyExpiryInspection.setHours(0, 0, 0, 0); // Set time part to midnight
            this.inspectionCase = '';
            if (this.policyExpiryInspection < this.currentDate) {
              if (productTypeValue == 'saod') {
                this.inspectionCase = 'Inspection';
              }
            }
          } else {
            this.inspectionCase = '';
          }
          this.sharedDataService.inspectionCaseData(this.inspectionCase);
          this.registrationNumber =
            sessionStorage.getItem('registrationNumber');
          this.vehicleMMVData = sessionStorage.getItem('vehicleMMVData');
          if (this.registrationNumber) {
            this.sharedDataService.vehicleMMVDetails(
              getProductTypeName,
              this.mmvFormData,
              'registrationNumber',
              '',
              notSendTransactionId
            );
          } else if (
            this.parsedVehicleData?.policy_expiry_date_email &&
            this.parsedVehicleData?.allQuotesRequest
          ) {
            this.renewalDetails = sessionStorage.getItem('renewalDetails');
            if (!this.renewalDetails) {
              this.sharedDataService.getQuotesOnTransactionId(
                this.parsedVehicleData?.allQuotesRequest
              );
            }

            let inputDate =
              this.parsedVehicleData.allQuotesRequest?.previous_policy_exp_date;
            let [day, month, year] = inputDate.split('/');
            let reformattedDate = `${month}/${day}/${year}`;

            this.parsedVehicleData.policy_expiry_date = new Date(
              reformattedDate
            );

            this.emailInsurer = sessionStorage.getItem('mmv_data_email');
            if (this.emailInsurer) {
              let insurerData = JSON.parse(this.emailInsurer);
              this.parsedVehicleData.previous_insurer = insurerData;
              sessionStorage.removeItem('mmv_data_email');
            }

            let vehicleForm = JSON.stringify(this.parsedVehicleData);

            sessionStorage.setItem('mmv_data', vehicleForm);
          } else {
            let mmvIdData = JSON.parse(
              sessionStorage.getItem('mmv_data') || '{}'
            );
            let objectValue = Object.keys(mmvIdData);

            this.renewalDataList = false;

            for (let i = 0; i <= objectValue.length - 1; i++) {
              if (objectValue[i] == 'vehicle_make') {
                this.renewalDataList = true;
              }
            }
            if (this.renewalDataList) {
              this.sharedDataService.vehicleMMVDetails(
                getProductTypeName,
                this.mmvFormData,
                'mmvQuotes',
                '',
                notSendTransactionId
              );
              this.refreshPageApiHandling = true;
            }
          }
          this.sharedDataService.addOnsChange(this.mmvFormData);
          this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
        });
    }
  }
  intervalId: any = null;
  startProgress(progressValue: any) {
    // if (this.intervalId) {
    //   return;
    // }
    this.progressValue = progressValue;
    this.intervalId = setInterval(() => {
      this.progressValue += 0.1;
      if (this.progressValue >= 100) {
        clearInterval(this.intervalId);
      } else {
        const position = this.progressValue * 3.5;
        const translatedX = this.getImagePosition();
      }
    }, 15);
  }
  getImagePosition(): string {
    if (window.innerWidth <= 999) {
      const position = this.progressValue * 6.5; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1000 && window.innerWidth <= 1100) {
      const position = this.progressValue * 12; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1100 && window.innerWidth <= 1200) {
      const position = this.progressValue * 13; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1200 && window.innerWidth <= 1400) {
      const position = this.progressValue * 15.5; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1400 && window.innerWidth <= 1500) {
      const position = this.progressValue * 18; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1500 && window.innerWidth <= 1600) {
      const position = this.progressValue * 19; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1600 && window.innerWidth <= 1700) {
      const position = this.progressValue * 20; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1700 && window.innerWidth <= 1800) {
      const position = this.progressValue * 22; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 1800 && window.innerWidth <= 2000) {
      const position = this.progressValue * 24; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else if (window.innerWidth > 2000 && window.innerWidth <= 2200) {
      const position = this.progressValue * 27.5; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    } else {
      const position = this.progressValue * 31; // Adjust the multiplier based on your desired movement
      return `translateX(${position}%)`;
    }
  }

  gstToggle(event: any) {
    if (event.checked) {
      this.defaultGST = event.checked;
    } else {
      this.defaultGST = event.checked;
    }
    sessionStorage.setItem('gstValue', JSON.stringify(this.defaultGST));
  }
  sorting(data: any) {
    if (this.quotationData.length > 0) {
      if (data?.value) {
        sessionStorage.setItem('sortObjectkey', data.value);
      }
      if (this.defaultGST) {
        if (data == 'low' || data?.value == 'low') {
          this.quotationData.sort(
            (a: any, b: any) =>
              a.premium_details.gross_premium - b.premium_details.gross_premium
          );
        } else {
          this.quotationData.sort(
            (a: any, b: any) =>
              b.premium_details.gross_premium - a.premium_details.gross_premium
          );
        }
      } else {
        if (data == 'low' || data?.value == 'low') {
          this.quotationData.sort(
            (a: any, b: any) =>
              a.premium_details.net_premium - b.premium_details.net_premium
          );
        } else {
          this.quotationData.sort(
            (a: any, b: any) =>
              b.premium_details.net_premium - a.premium_details.net_premium
          );
        }
      }
    }
  }

  openNonPOSPopup(objData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = 'auto';
      resTop = '5%';
    } else {
      resWidth = 'auto';
      resTop = '5%';
    }
    const obj: any = {
      modalName: this.nonPOSJSON['modalName'],
      width: this.nonPOSJSON['widthObtained'],
      height: this.nonPOSJSON['heightObtained'],
      classNameObtained: this.nonPOSJSON['classObtained'],
      isOutSideClose: this.nonPOSJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: objData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj);
  }
}
