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
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddOnsComponent } from '../add-ons/add-ons.component';
import { QuotesDropdownComponent } from '../quotes-dropdown/quotes-dropdown.component';
import { ShareQuotesComponent } from '../../shared/components/dialog-components/share-quotes/share-quotes.component';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { SelectedShareComponent } from 'src/app/shared/components/dialog-components/selected-share/selected-share.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { NonPosPopupComponent } from '../non-pos-popup/non-pos-popup.component';
import { PayoutInfoComponent } from 'src/app/shared/components/dialog-components/payout-info/payout-info.component';
import { VehicleRegistrationNumberComponent } from 'src/app/shared/components/dialog-components/vehicle-registration-number/vehicle-registration-number.component';
import { environment } from 'src/environments/environment';
declare const webengage: any;
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
  storedData = false;
  refreshPageApiHandling = false;
  proposalTypeValueOninit = true;
  vehicleCardMultipleCall: any;
  traceIdTab: any;
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
  payoutInfoJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: PayoutInfoComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '10%',
    isOutSideClose: true,
    classObtained: 'payout-info-class',
  };
  vehicleRegistrationNUmber: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: VehicleRegistrationNumberComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: '10%',
    isOutSideClose: true,
    classObtained: 'vehicle-registration',
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
  payAsyouDrive = [
    { value: 2500, label: '2500 Kms' },
    { value: 5000, label: '5000 Kms' },
    { value: 7500, label: '7500 Kms' },
    { value: 10000, label: '10000 Kms' },
    { value: 0, label: 'Unlimited' },
  ];
  knowMoreText: string = 'Know More';
  shareQuotesDropdownValue: boolean = false;
  addShare: boolean = false;
  vehicleData: any;
  parsedVehicleData: any;
  vehicleTypeValue: any;
  selectedProductType: any;
  vehicleMMVData: any;
  defaultGST: any;
  defaultEarning: boolean = true;
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
  totalIdvData: any;
  flexiButton = false;
  flexiAmountArray: any = [];
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
  carLoader: boolean = true;
  payout: boolean = false;
  selectedKmsValue: any;
  showRenewalQuotes: boolean = false;
  isPrevoiusInsurer: any;
  traceIdResponse: any;
  totalPremiumData: any;
  insurerLogoData: any;
  insurerNameData: any;
  gstEarningShow: boolean = false;
  flexiLoader: boolean = false;
  loaderOnCardId: any;
  FlexiError: boolean[] = [];
    // isPageRefresh = true;
  constructor(
    private router: Router,
    private apiService: ApiService,
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private datePipe: DatePipe
  ) {
    // this.postListInitiateQuotes(initiate_quotes_payload);
  }

  quotesListing: FormGroup = new FormGroup({
    proposalType: new FormControl('', Validators.required),
  });
  noQuotesInformation: any;

  ngOnInit(): void {
    // sessionStorage.removeItem('gstValue');
    const token = sessionStorage.getItem('token');
    const partner_code = sessionStorage.getItem('partner_code');

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
    this.sharedDataService.enableCarLoader.subscribe((idvData) => {
      this.carLoader = true;
      for (let i = 0; i < this.quotationData.length; i++) {
        const quote = this.quotationData[i];

        if (quote?.flexi_discounting?.is_active) {
          // Set applyButton based on your logic
          this.quotationData[i].applyButton = true;
          this.quotationData[i].applyInputButton = true;
          const formGroup = this.flexiDiscountFormArray.at(i);
          const flexiControl = formGroup.get('flexiDiscount');
          this.FlexiError[i] = false;
          // Enable/disable input based on applyButton flag
          if (this.quotationData[i].applyButton) {
            flexiControl?.disable();
          } else {
            flexiControl?.enable();
          }

          // Load value from session or use default
          const flexiDetails = sessionStorage.getItem('flexiAmount');
          if (flexiDetails) {
            const flexiValues = JSON.parse(flexiDetails); // This is now an array

            const insurerCode = quote?.insurer_code?.toLowerCase();
            const isPayd = quote?.payd?.status;

            // Find the matching entry in the array
            const matched = flexiValues.find(
              (item: any) =>
                item.insurerCode?.toLowerCase() === insurerCode &&
                item.is_payd === isPayd
            );

            if (matched) {
              // Patch the matched discount value
              flexiControl?.patchValue(matched.discount_percentage);
              this.quotationData[i].flexi_discounting.discount_percentage =
                matched.discount_percentage;
            } else {
              // Fallback to min_discount
              flexiControl?.patchValue(
                quote?.flexi_discounting?.discount_percentage
              );
            }
          } else {
            flexiControl?.patchValue(
              quote?.flexi_discounting?.discount_percentage
            );
          }
        }
      }
      let timeout: any;
      if (environment.dev) {
        timeout = 50000;
      } else {
        timeout = 10000;
      }
      setTimeout(() => {
        if (this.carLoader) {
          for (let i = 0; i < this.quotationData.length; i++) {
            const quote = this.quotationData[i];

            if (quote?.flexi_discounting?.is_active) {
              // Reset applyButton logic (default is false)
              this.quotationData[i].applyButton = false;
              this.quotationData[i].applyInputButton = false;

              const formGroup = this.flexiDiscountFormArray.at(i);
              const flexiControl = formGroup.get('flexiDiscount');

              // Enable or disable the control
              flexiControl?.enable(); // or conditionally disable if needed

              // Load all stored flexi discount values from sessionStorage
              const flexiDetails = sessionStorage.getItem('flexiAmount');
              if (flexiDetails) {
                const flexiValues = JSON.parse(flexiDetails); // This is now an array

                const insurerCode = quote?.insurer_code?.toLowerCase();
                const isPayd = quote?.payd?.status;

                // Find the matching entry in the array
                const matched = flexiValues.find(
                  (item: any) =>
                    item.insurerCode?.toLowerCase() === insurerCode &&
                    item.is_payd === isPayd
                );

                if (matched) {
                  // Patch the matched discount value
                  flexiControl?.patchValue(matched.discount_percentage);
                  this.quotationData[i].flexi_discounting.discount_percentage =
                    matched.discount_percentage;
                } else {
                  // Fallback to min_discount
                  flexiControl?.patchValue(
                    quote?.flexi_discounting?.discount_percentage
                  );
                }
              } else {
                // No session data; use default min_discount
                flexiControl?.patchValue(
                  quote?.flexi_discounting?.discount_percentage
                );
              }
            }
          }

          this.flexiButton = true;
          this.carLoader = false;
          const mmv_data = JSON.parse(
            sessionStorage.getItem('mmv_data') || '{}'
          );
          const addons = JSON.parse(
            sessionStorage.getItem('selectedAddons') || '{}'
          );
          let idvValue = JSON.parse(sessionStorage.getItem('idvData') || '{}');
          let idvData;
          if (idvValue?.minIdv) {
            idvData = idvValue?.minIdv;
          } else if (idvValue?.maxIdv) {
            idvData = idvValue?.maxIdv;
          } else {
            idvData = idvValue?.chooseIdv;
          }
          const sortObjectkey = sessionStorage.getItem('sortObjectkey');
          const token = sessionStorage.getItem('token');
          let proposarTypeData = sessionStorage.getItem('proposerType');
          const transformedDateString = mmv_data?.registration_date
            ? this.datePipe.transform(
                mmv_data?.registration_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';

          let regDate = transformedDateString
            ? new Date(transformedDateString as string)
            : '';

          const transformedMgfDate = mmv_data?.manufacture_date
            ? this.datePipe.transform(
                mmv_data?.manufacture_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';
          let mgfDate = transformedMgfDate
            ? new Date(transformedMgfDate as string)
            : '';

          const transformedPolicyExpiry = mmv_data?.policy_expiry_date
            ? this.datePipe.transform(
                mmv_data?.policy_expiry_date,
                'yyyy-MM-ddTHH:mm:ss.SSSZ'
              )
            : '';
          let policyExpDate = transformedPolicyExpiry
            ? new Date(transformedPolicyExpiry as string)
            : '';
          const formData = {
            Vehicle_Variant:
              mmv_data?.vehicle_variant?.rb_make_name +
              ' ' +
              mmv_data?.vehicle_variant?.rb_model_name +
              ' ' +
              mmv_data?.vehicle_variant?.rb_variant_name +
              ' ' +
              mmv_data?.vehicle_variant?.cubic_capacity +
              ' cc',
            Fuel: mmv_data?.vehicle_variant?.fuel,
            Registration_City: mmv_data?.registration_city?.display_name,
            'Mfg._Year': mgfDate,
            Registration_Date: regDate,
            Policy_Expiry_Date: policyExpDate,
            Previous_Insurer: mmv_data?.previous_insurer,
            Previous_NCB: mmv_data?.ncb_discount,
            New_NCB: mmv_data?.offeredNCBValue,
            Trace_ID: sessionStorage.getItem('transaction_id'),
            IDV: idvData,
            Add_Ons: addons,

            Customer_sort_by: proposarTypeData,
            Price_sort_by:
              sortObjectkey == 'low' ? 'Low to High' : 'High to Low',
            Plan_Details: this.quotationData,
            User_Type: token != null ? 'Partner' : 'Customer',
            Motor_Type: this.vehicleTypeValue,
            Partner_code: sessionStorage.getItem('partner_code'),
          };
          const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([key, value]) => {
              if (value == null || value === '') {
                return false;
              }
              return true;
            })
          );
          webengage.track('Motor_Insurance_Plans_Found', filteredData);
        }
      }, timeout);
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
                    item.insurer_code ==
                      this.quotationArray[i]['insurer_code'] &&
                    item.payd?.status ==
                      this.quotationArray[i]['payd']['status']
                  ) {
                    return item;
                  }
                }
              );

              if (quotesValueList == -1) {
                this.quotationData.push(this.quotationArray[i]);
              } else {
                ////////////////check key exist or not
                const checkCurrentDataKey = Object.keys(
                  this.quotationArray[i]
                ).includes('payout_response');
                if (checkCurrentDataKey === true) {
                  //now check previous data key exis tor no t
                  const checkPreviousDataKey = Object.keys(
                    this.quotationData[quotesValueList]
                  ).includes('payout_response');
                  if (checkPreviousDataKey === false) {
                    this.quotationData[quotesValueList]['payout_response'] =
                      this.quotationArray[i]['payout_response'];
                  }
                }
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
        this.quotationData = this.quotationData.sort((a: any, b: any) => {
          if (a.insurer_priority === null) return 1;
          if (b.insurer_priority === null) return -1;
          return a.insurer_priority - b.insurer_priority;
        });
        this.flexiDiscountFormArray.clear(); // clear existing if reinitializing
        if (this.quotationData.length > 0) {
          this.quotationData.forEach((quote: any, index: number) => {
            const control = new FormGroup({
              flexiDiscount: new FormControl({
                value: quote?.flexi_discounting?.min_discount || '', // or initial value
                disabled: quote?.applyButton || false,
                applyInputButton: false,
              }),
            });

            this.flexiDiscountFormArray.push(control);
          });
        }

        for (let i = 0; i < this.quotationData.length; i++) {
          const quote = this.quotationData[i];

          if (quote?.flexi_discounting?.is_active) {
            // Set applyButton based on your logic
            this.quotationData[i].applyButton = true;
            this.quotationData[i].applyInputButton = true;
            const formGroup = this.flexiDiscountFormArray.at(i);
            const flexiControl = formGroup.get('flexiDiscount');

            // Enable/disable input based on applyButton flag
            if (this.quotationData[i].applyButton) {
              flexiControl?.disable();
            } else {
              flexiControl?.enable();
            }

            // Load value from session or use default
            const flexiDetails = sessionStorage.getItem('flexiAmount');
            if (flexiDetails) {
              const flexiValues = JSON.parse(flexiDetails); // This is now an array

              const insurerCode = quote?.insurer_code?.toLowerCase();
              const isPayd = quote?.payd?.status;

              // Find the matching entry in the array
              const matched = flexiValues.find(
                (item: any) =>
                  item.insurerCode?.toLowerCase() === insurerCode &&
                  item.is_payd === isPayd
              );

              if (matched) {
                // Patch the matched discount value
                flexiControl?.patchValue(matched.discount_percentage);
                this.quotationData[i].flexi_discounting.discount_percentage =
                  matched.discount_percentage;
              } else {
                // Fallback to min_discount
                flexiControl?.patchValue(
                  quote?.flexi_discounting?.discount_percentage
                );
              }
            } else {
              flexiControl?.patchValue(
                quote?.flexi_discounting?.discount_percentage
              );
            }
          }
        }

        console.log(this.flexiDiscountFormArray);
        console.log(this.quotationData);

        this.quotationData
          ?.filter(
            (item: any) => item.payout_response && item.payout_response !== 'NA'
          )
          .map((item: any) => item.payout_response)
          .forEach((payout: any) => {
            if (token != null && partner_code != null) {
              this.payout = true;
            }
          });
        if (window.innerWidth <= 999) {
          this.sharedDataService?.sendQuoteData(this.quotationData);
        }
      }
    });

    this.vehicleCardMultipleCall =
      this.sharedDataService.vehicleCardValue.subscribe((cardData) => {
        this.vehicleData = cardData;
        this.parsedVehicleData = JSON.parse(this.vehicleData);
        this.tabChangeOninit = true;
        // this.quotesTabData('notSendTransactionId');
      });
    this.sharedDataService.vehicleCardEmailValue.subscribe((cardData) => {
      this.vehicleData = cardData;

      this.parsedVehicleData = this.vehicleData
        ? JSON.parse(this.vehicleData)
        : '';
      this.tabChangeOninit = true;
      if (!this.storedData) {
        this.quotesTabData();
      }
    });

    this.sharedDataService.selectedADDOnsList.subscribe((addons) => {
      this.selectAddOnsList = [];
      this.selectAddOnsList = addons;
    });
    let mmvFromData = sessionStorage.getItem('mmv_data');
    if (mmvFromData) {
      this.parsedVehicleData = JSON.parse(mmvFromData);
      this.storedData = true;
      // this.quotesTabData();
    }

    sessionStorage.removeItem('renewalInsurerQuotesId');
    this.registrationNumber = sessionStorage.getItem('registrationNumber');
    if (!this.registrationNumber) {
      // this.getProposalType();
    }
    this.sharedDataService.regNumberData.subscribe((numberData) => {
      this.registrationNumberData = numberData;
    });
    this.getProposalType();
    this.renewalType = sessionStorage.getItem('renewalType');
    if (this.renewalType == 'renewal' || this.renewalType == 'rollover') {
      this.showRenewalQuotes = true;
      const insurerName = sessionStorage.getItem('previousInsurerCode');
      const RenewalPreviousDetails: any = JSON.parse(
        sessionStorage.getItem('RenewalPreviousDetails') || '{}'
      );
      sessionStorage.setItem(
        'proposerType',
        RenewalPreviousDetails?.vehicle_details?.customer_type
      );
      this.insurerCode = insurerName;
    }
    this.sharedDataService.getTraceIdApiResponse.subscribe((res: any) => {
      this.traceIdResponse = res;
      // this.quotesTabData();
    });

    this.traceIdTab = this.sharedDataService.traceIdVehicleType.subscribe(
      (cardData: any) => {
        if (cardData) {
          this.vehicleData = cardData;
          this.parsedVehicleData = JSON.parse(this.vehicleData);
          let vehicleTypeValue = sessionStorage.getItem('vehicleType');
          if (!vehicleTypeValue) {
            sessionStorage.setItem('vehicleType', `private_car`);
          }
          this.quotesTabData();
        }
      }
    );

    // let currentPageUrl = this.router.url;
    // if (window.performance.navigation.type === 1) {

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

    //   this.isPageRefresh = true;
    //   sessionStorage.setItem('pageRefresh', JSON.stringify(this.isPageRefresh));
    // }
  }
  info() {
    this.openModal('', this.payoutInfoJSON);
  }

  getProposalType() {
    this.proposalTypeValueOninit = false;
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type()}`)
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
              if (this.owner_type) {
                sessionStorage.setItem('proposerType', this.owner_type);
              } else {
                sessionStorage.setItem(
                  'proposerType',
                  this.proposalList[0]?.proposer_name
                );
              }
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
    // }
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
    let quotesPremium = {
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: this.vehicleTypeValue,
      'Total_Own_Damage_(A)':
        quotes_data.premium_details.od_premium_details.total_od_premium != 0
          ? quotes_data.premium_details.od_premium_details.total_od_premium
          : 0,
      NCB_Discount:
        quotes_data.premium_details.od_premium_details.ncb_discount < 0
          ? -quotes_data.premium_details.od_premium_details.ncb_discount
          : quotes_data.premium_details.od_premium_details.ncb_discount,
      'Third_Party_(B)':
        quotes_data.premium_details.tp_premium_details.total_tp_premium != 0
          ? quotes_data.premium_details.tp_premium_details.total_tp_premium
          : 0,
      Total_Addons: quotes_data.premium_details?.is_addon_addition,
      'GST_(18%)_(C)':
        quotes_data.premium_details.total_gst != 0
          ? quotes_data.premium_details.total_gst
          : 0,
      'Total_Premium_(A+B+C)':
        quotes_data.premium_details.gross_premium != 0
          ? quotes_data.premium_details.gross_premium
          : 0,
      IDV:
        quotes_data.premium_details.idv != 0
          ? quotes_data.premium_details.idv
          : 0,
      Insurer_Name: quotes_data?.insurer_name,
      Total_IDV: quotes_data?.premium_details?.idv,
      Total_Premium: quotes_data?.premium_details?.gross_premium,
      Insurer_Logo: quotes_data?.insurer_logo,
      Product_id: quotes_data.quote_id,
    };
    webengage.track('Motor_Policy_details_Viewed', quotesPremium);

    const is_new_vehcile = sessionStorage.getItem('newVehicleType');
    const vehcileWithoutRegistration = sessionStorage.getItem(
      'withoutVehicleNumber'
    );
    const registration_number = sessionStorage.getItem('registrationNumber');
    sessionStorage.setItem('BuyNowClick', 'true');
    const is_renewal = sessionStorage.getItem('renewalType');
    if (
      is_new_vehcile != 'new' &&
      !registration_number &&
      is_renewal != 'renewal'
    ) {
      if (window.innerWidth <= 999) {
        const bottomSheetConfig: MatBottomSheetConfig = {
          data: quotes_data,
        };
        this.bottomSheet.open(
          VehicleRegistrationNumberComponent,
          bottomSheetConfig
        );
      } else {
        this.openModal(quotes_data, this.vehicleRegistrationNUmber);
      }
    } else {
      this.isPrevoiusInsurer = false;
      sessionStorage.setItem('alreadyCalled', 'true');
      if (quotes_data?.is_rb_renewal) {
        this.isPrevoiusInsurer = true;
        sessionStorage.setItem('renewalType', 'renewal');
      }
      sessionStorage.setItem('isprevoiusInsurer', this.isPrevoiusInsurer);
      const registrationNumber = sessionStorage.getItem('registrationNumber');
      if (is_new_vehcile == 'new' && registrationNumber) {
        sessionStorage.removeItem('registrationNumber');
      }
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
    this.renewalType = sessionStorage.getItem('renewalType');

    if (lastIndex !== null && lastIndex !== 'undefined') {
      if (this.renewalType == 'rollover' || this.renewalType == 'renewal') {
        this.selectedTabIndex = selectedIndex;
      } else {
        this.selectedTabIndex = JSON.parse(lastIndex);
      }
    } else if (
      this.renewalType == 'rollover' ||
      this.renewalType == 'renewal'
    ) {
      this.selectedTabIndex = selectedIndex;
    } else {
      this.selectedTabIndex = 0;
    }
    this.selectedProductType = event.tab.textLabel;
    sessionStorage.setItem('productType', this.selectedProductType);
    this.sharedDataService.chooseIdvHide(this.selectedProductType);
    if (
      this.selectedProductType == 'bundled_tp' ||
      this.selectedProductType == 'satp'
    ) {
      sessionStorage.removeItem('idvData');
    }
    if (!this.tabChangeOninit) {
      sessionStorage.setItem(
        'lastSelectedTabIndex',
        JSON.stringify(event.index)
      );
      sessionStorage.removeItem('selectedAddons');
      sessionStorage.removeItem('flexiAmount');
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
      // if (!this.parsedVehicleData?.policy_expiry_date_email) {
      //   if (this.registrationNumber) {
      //     this.sharedDataService.vehicleMMVDetails(
      //       productTypeValue,
      //       this.mmvFormData,
      //       'registrationNumber'
      //     );
      //   } else {
      //     this.sharedDataService.vehicleMMVDetails(
      //       productTypeValue,
      //       this.mmvFormData,
      //       'mmvQuotes'
      //     );
      //   }
      // }

      this.sharedDataService.addOnsChange(this.mmvFormData);
      this.sharedDataService.initiate_Quotes_APi(JSON.parse(this.mmvFormData));
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
    let premiumCardData = {
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Product_id: initiateQuotes.quote_id,
      'Total_Own_Damage_(A)':
        initiateQuotes.premium_details.od_premium_details.total_od_premium != 0
          ? initiateQuotes.premium_details.od_premium_details.total_od_premium
          : 0,
      NCB_Discount:
        initiateQuotes.premium_details.od_premium_details.ncb_discount < 0
          ? -initiateQuotes.premium_details.od_premium_details.ncb_discount
          : initiateQuotes.premium_details.od_premium_details.ncb_discount,
      'Third_Party_(B)':
        initiateQuotes.premium_details.tp_premium_details.total_tp_premium != 0
          ? initiateQuotes.premium_details.tp_premium_details.total_tp_premium
          : 0,
      Total_Addons: initiateQuotes.premium_details?.is_addon_addition,
      'GST_(18%)_(C)':
        initiateQuotes.premium_details.total_gst != 0
          ? initiateQuotes.premium_details.total_gst
          : 0,
      'Total_Premium_(A+B+C)':
        initiateQuotes.premium_details.gross_premium != 0
          ? initiateQuotes.premium_details.gross_premium
          : 0,
      IDV:
        initiateQuotes.premium_details.idv != 0
          ? initiateQuotes.premium_details.idv
          : 0,
      Motor_Type: this.vehicleTypeValue,
      Total_IDV:
        initiateQuotes.premium_details.idv != 0
          ? initiateQuotes.premium_details.idv
          : 0,
      Total_Premium: initiateQuotes?.premium_details?.gross_premium,
      Insurer_Name: initiateQuotes?.insurer_name,
      Insurer_Logo: initiateQuotes?.insurer_logo,
    };
    webengage.track('Motor_Policy_Premiun_Break_Up_Viewed', premiumCardData);
  }
  // (click)="shareQuotesOpen(null, shareQuotesJSON)"
  shareQuotesOpen(shareData: any, jsonData: any) {
    this.openModal(shareData, jsonData);
  }
  shareQuotesDropdown() {
    this.shareQuotesDropdownValue = !this.shareQuotesDropdownValue;
    webengage.track('Shared_Quotes_clicked', {
      Option_Selected: this.vehicleTypeValue,
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: this.vehicleTypeValue,
    });
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
      this.totalIdvData = [];
      this.totalPremiumData = [];
      this.insurerLogoData = [];
      this.insurerNameData = [];
      for (const [key, value] of Object.entries(this.quotationArray)) {
        this.isCheckboxChecked = true;
        this.isChecked = true;
        if (value['status'] == true) {
          this.selectedQuotes.push(value);
          this.totalIdvData.push(value['premium_details']['idv']);
          this.totalPremiumData.push(value['premium_details']['gross_premium']);
          this.insurerLogoData.push(value['insurer_logo']);
          this.insurerNameData.push(value['insurer_name']);
        }
      }
      webengage.track('Shared_Quotes_clicked', {
        Option_Selected: count,
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: this.vehicleTypeValue,
        Total_IDV: this.totalIdvData.join(', '),
        Total_Premium: this.totalPremiumData.join(', '),
        Insurer_Logo: this.insurerLogoData.join(', '),
      });
      webengage.track('Quotes_selected', {
        Plan_Details: this.selectedQuotes,
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: this.vehicleTypeValue,
        Total_IDV: this.totalIdvData.join(', '),
        Total_Premium: this.totalPremiumData.join(', '),
        Insurer_Logo: this.insurerLogoData.join(', '),
        Insurer_Name: this.insurerNameData.join(', '),
      });
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
      webengage.track('Quotes_selected', {
        Plan_Details: this.selectedQuotes,
        User_Type: sessionStorage.getItem('partner_code')
          ? 'Partner'
          : 'Customer',
        Motor_Type: this.vehicleTypeValue,
        Total_IDV: this.totalIdvData.join(', '),
        Total_Premium: this.totalPremiumData.join(', '),
        Insurer_Logo: this.insurerLogoData.join(', '),
        Insurer_Name: this.insurerNameData.join(', '),
      });
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
  changeProposalType(eventData: any) {
    // if (!this.proposalTypeOninit) {
    // this.progressValue = 0;
    // this.startProgress(0);
    let event = eventData?.value;
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
      // this.sharedDataService.vehicleMMVDetails(
      //   productTypeValue,
      //   mmvFormData,
      //   'registrationNumber'fv
      // );
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
        // this.sharedDataService.vehicleMMVDetails(
        //   productTypeValue,
        //   mmvFormData,
        //   'mmvQuotes'
        // );
      }
      this.refreshPageApiHandling = false;
    }
    this.sharedDataService.addOnsChange(mmvFormData);
    this.sharedDataService.initiate_Quotes_APi(JSON.parse(mmvFormData || '{}'));
    this.sharedDataService.disableInitiatesQuotesBase(this.enableIdvCard);
  }

  quotesTabData(notSendTransactionId?: any) {
    if (this.parsedVehicleData != undefined) {
      this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
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
      let vehicleTypeData;
      if (this.vehicleTypeValue == 'commercial_vehicle') {
        vehicleTypeData =
          this.traceIdResponse?.quote_data?.quotes_data?.cv_vehicle_type
            ?.vehicle_type;
      } else {
        vehicleTypeData = this.vehicleTypeValue;
      }
      if (
        this.registrationDateYear != 'NaN' &&
        this.parsedVehicleData?.policy_expiry != undefined
      ) {
        this.apiService
          .getRequestedResponse(
            `${ApiConstants.getCoverageType()}?reg_year=${
              this.registrationDateYear
            }&vehicle_type=${this.vehicleTypeValue}&previous_policy_type=${
              this.parsedVehicleData?.policy_expiry
            }&previous_policy_expiry_date=${expiredDate}`
          )
          .subscribe((res: any) => {
            this.tabDataList = res;
            this.selectedProductType = this.tabDataList[0].code;
            this.renewalType = sessionStorage.getItem('renewalType');
            if (
              this.renewalType == 'renewal' ||
              this.renewalType == 'rollover'
            ) {
              sessionStorage.setItem(
                'productType',
                this.parsedVehicleData?.policy_expiry
              );
            }
            let productTypeValue = sessionStorage.getItem('productType');
            let tabData = this.tabDataList.findIndex(
              (item: any) => item.code === productTypeValue
            );
            if (tabData !== -1) {
              this.selectedTabIndex = tabData;
            } else {
              this.selectedTabIndex = 0;
            }

            if (tabData == -1) {
              sessionStorage.setItem('productType', this.selectedProductType);
            }
            if (!productTypeValue) {
              sessionStorage.setItem('productType', this.selectedProductType);
            }
            let getProductTypeName = sessionStorage.getItem('productType');
            this.mmvFormData = sessionStorage.getItem('mmv_data');

            let mmvFormValue = JSON.parse(this.mmvFormData);
            if (mmvFormValue) {
              this.sharedDataService.initiate_Quotes_APi(mmvFormValue);
            }

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
              // this.sharedDataService.vehicleMMVDetails(
              //   getProductTypeName,
              //   this.mmvFormData,
              //   'registrationNumber',
              //   '',
              //   notSendTransactionId
              // );
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
                this.parsedVehicleData.allQuotesRequest
                  ?.previous_policy_exp_date;
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
                // this.sharedDataService.vehicleMMVDetails(
                //   getProductTypeName,
                //   this.mmvFormData,
                //   'mmvQuotes',
                //   '',
                //   notSendTransactionId
                // );
                // this.refreshPageApiHandling = true;
              }
            }
            this.sharedDataService.addOnsChange(this.mmvFormData);
            this.sharedDataService.disableInitiatesQuotesBase(
              this.enableIdvCard
            );
          });
      }
    }
  }
  intervalId: any = null;
  startProgress(progressValue: any) {
    // if (this.intervalId) {
    //   return;
    // }
    this.progressValue = progressValue;
    this.intervalId = setInterval(() => {
      if (environment.dev) {
        this.progressValue += 0.08;
      } else {
        this.progressValue += 0.4;
      }
      if (this.progressValue >= 100) {
        clearInterval(this.intervalId);
      } else {
        const position = this.progressValue * 3.5;
        const translatedX = this.getImagePosition();
      }
    }, 40);
  }
  // getImagePosition(): string {
  //   if (window.innerWidth <= 999) {
  //     const position = this.progressValue * 6.5; // Adjust the multiplier based on your desired movement
  //     if (position >= 630) {
  //       return `translateX(630%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1000 && window.innerWidth <= 1100) {
  //     const position = this.progressValue * 14; // Adjust the multiplier based on your desired movement
  //     if (position >= 1360) {
  //       return `translateX(1360%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1100 && window.innerWidth <= 1200) {
  //     const position = this.progressValue * 15;
  //     if (position >= 1455) {
  //       return `translateX(1455%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1200 && window.innerWidth <= 1400) {
  //     const position = this.progressValue * 17;
  //     if (position >= 1650) {
  //       return `translateX(1650%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //     // Adjust the multiplier based on your desired movement
  //   } else if (window.innerWidth > 1400 && window.innerWidth <= 1500) {
  //     const position = this.progressValue * 19; // Adjust the multiplier based on your desired movement
  //     if (position >= 1840) {
  //       return `translateX(1840%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1500 && window.innerWidth <= 1600) {
  //     const position = this.progressValue * 20; // Adjust the multiplier based on your desired movement
  //     if (position >= 1940) {
  //       return `translateX(1940%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1600 && window.innerWidth <= 1700) {
  //     const position = this.progressValue * 21; // Adjust the multiplier based on your desired movement
  //     if (position >= 2030) {
  //       return `translateX(2030%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1700 && window.innerWidth <= 1800) {
  //     const position = this.progressValue * 23; // Adjust the multiplier based on your desired movement
  //     if (position >= 2230) {
  //       return `translateX(2230%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 1800 && window.innerWidth <= 2000) {
  //     const position = this.progressValue * 25; // Adjust the multiplier based on your desired movement
  //     if (position >= 2425) {
  //       return `translateX(2425%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else if (window.innerWidth > 2000 && window.innerWidth <= 2200) {
  //     const position = this.progressValue * 27.5; // Adjust the multiplier based on your desired movement
  //     if (position >= 2660) {
  //       return `translateX(2660%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   } else {
  //     const position = this.progressValue * 33; // Adjust the multiplier based on your desired movement
  //     if (position >= 3201) {
  //       return `translateX(3201%)`;
  //     } else {
  //       return `translateX(${position}%)`;
  //     }
  //   }
  // }

  getImagePosition(): string {
    let maxTranslateX = 3201; // Default max for very large screens

    const w = window.innerWidth;

    if (w <= 999) {
      maxTranslateX = 600;
    } else if (w <= 1100) {
      maxTranslateX = 1330;
    } else if (w <= 1200) {
      maxTranslateX = 1425;
    } else if (w <= 1400) {
      maxTranslateX = 1620;
    } else if (w <= 1500) {
      maxTranslateX = 1820;
    } else if (w <= 1600) {
      maxTranslateX = 1910;
    } else if (w <= 1700) {
      maxTranslateX = 2000;
    } else if (w <= 1800) {
      maxTranslateX = 2200;
    } else if (w <= 2000) {
      maxTranslateX = 2405;
    } else if (w <= 2200) {
      maxTranslateX = 2630;
    }

    const position = (this.progressValue / 100) * maxTranslateX;

    return `translateX(${position}%)`;
  }

  gstToggle(event: any) {
    if (event.checked) {
      this.defaultGST = event.checked;
    } else {
      this.defaultGST = event.checked;
    }
    if (window.innerWidth <= 999 && this.payout) {
      this.gstEarningShow = !this.gstEarningShow;
    }
    sessionStorage.setItem('gstValue', JSON.stringify(this.defaultGST));
    sessionStorage.setItem('gstValue', JSON.stringify(this.defaultGST));
    webengage.track('GST_enabled', {
      User_Type: sessionStorage.getItem('partner_code')
        ? 'Partner'
        : 'Customer',
      Motor_Type: this.vehicleTypeValue,
    });
  }
  earningToggle(event: any) {
    this.defaultEarning = event.checked;
    if (window.innerWidth <= 999) {
      this.gstEarningShow = !this.gstEarningShow;
    }
  }
  viewMoreGST() {
    this.gstEarningShow = !this.gstEarningShow;
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
  selectedKms(value: any, insurer_code: any) {
    this.selectedKmsValue = value;
    this.sharedDataService.initiateInsurerQuotePremium(value, insurer_code);
  }

  ngOnDestroy() {
    this.vehicleCardMultipleCall.unsubscribe();
    this.traceIdTab.unsubscribe();
  }
  renewalRedirection(url: any) {
    window.open(url, '_blank');
  }

  // FLEXI DISCOUNT
  sliderValue = 100;

  getSliderPercentage(value: number): number {
    return ((value - this.minIdv) / (this.maxIdv - this.minIdv)) * 100;
  }

  flexiApply(quotes: any, index: any) {
    const transactionId = sessionStorage.getItem('transaction_id');
    this.flexiLoader = true;
    this.loaderOnCardId = quotes?.quote_id;

    let flexiApplyObject = {
      insurerCode: quotes?.insurer_code,
      discount_percentage:
        this.quotationData[index].flexi_discounting.discount_percentage,
      is_payd: quotes?.payd?.status,
    };
    // Check if a matching entry already exists
    const existingIndex = this.flexiAmountArray.findIndex(
      (item: any) =>
        item.insurerCode === flexiApplyObject.insurerCode &&
        item.is_payd === flexiApplyObject.is_payd
    );

    if (existingIndex !== -1) {
      //  Update existing item
      this.flexiAmountArray[existingIndex] = flexiApplyObject;
    } else {
      //  Push new item
      this.flexiAmountArray.push(flexiApplyObject);
    }
    
    let flexiObject = {
      transaction_id: transactionId,
      discount_percentage:
        this.quotationData[index].flexi_discounting.discount_percentage,
      is_payd: quotes?.payd?.status,
    };
    this.apiService
      .postRequestedResponse(
        `${ApiConstants.flexi_discount_api}?insurer=${quotes?.insurer_code}`,
        flexiObject,true
      )
      .subscribe((res) => {
        this.flexiLoader = false;
        if (res?.status) {
          for (let i = 0; i <= this.quotationData.length - 1; i++) {
            if (this.quotationData[i]?.quote_id == quotes?.quote_id) {
              this.quotationData[i] = res;
            }
          }
          sessionStorage.setItem(
            'flexiAmount',
            JSON.stringify(this.flexiAmountArray)
          );
        }else{
          this.FlexiError[index]=true
        }
      });
  }

  flexiAmountValue(quotes: any, index: number): void {
    this.FlexiError[index]=false
    if (this.flexiButton) {
      const flexiSliderValue = this.flexiDiscountFormArray
        .at(index)
        .get('flexiDiscount')?.value;

      // Update the discount percentage in your quotationData
      this.quotationData[index].flexi_discounting.discount_percentage =
        flexiSliderValue;

      // Enable/disable applyButton based on max_discount check
      const maxDiscount = quotes?.flexi_discounting?.max_discount;
      this.quotationData[index].applyButton = flexiSliderValue > maxDiscount;

      if (flexiSliderValue > maxDiscount) {
        this.quotationData[index].applyInputButton = false;
      }
    }
  }

  onFlexiSliderInput(event: any, index: number): void {
    const value = event.value;

    // Optionally update quotationData
    this.quotationData[index].flexi_discounting.discount_percentage = value;

    if (this.flexiDiscountFormArray.at(index)) {
      this.flexiDiscountFormArray
        .at(index)
        .get('flexiDiscount')
        ?.setValue(value, { emitEvent: false });
    }
  }

  onFlexiSliderRangeAmount(value: number, index: number): void {
    this.FlexiError[index]=false
    this.quotationData[index].flexi_discounting.discount_percentage = value;

    if (this.flexiDiscountFormArray.at(index)) {
      this.flexiDiscountFormArray
        .at(index)
        .get('flexiDiscount')
        ?.setValue(value, { emitEvent: false });
    }
  }

  flexiForm: FormGroup = new FormGroup({
    flexiDiscountFormArray: new FormArray<FormGroup>([]),
  });

  get flexiDiscountFormArray(): FormArray<FormGroup> {
    return this.flexiForm.get('flexiDiscountFormArray') as FormArray<FormGroup>;
  }
}
