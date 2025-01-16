import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiConstants } from '../../api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { DatePipe } from '@angular/common';
import { WaitCkycVerificationDialogComponent } from 'src/app/shared/components/dialog-components/wait-ckyc-verification-dialog/wait-ckyc-verification-dialog.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
declare var HyperKYCModule: any;
@Component({
  selector: 'app-ckyc',
  templateUrl: './ckyc.component.html',
  styleUrls: [
    './ckyc.component.scss',
    '../vehicle-owner-details/vehicle-owner-details.component.scss',
  ],
})
export class CkycComponent implements OnInit {
  ckycFormGroup!: FormGroup;
  @Output() afterProceedGetData = new EventEmitter<any>();
  ckycList: any;
  isCheckKyc: boolean = false;
  documentList: any;
  documentName: any;
  numberRegex: any;
  minDate = new Date();
  maxDate = new Date();
  proposerType: any;
  dobPlaceholder: String = 'Select Date of Birth';
  qoutes_data: any;
  transactionId: any;
  quoteData: any;
  insurer_code: any;
  changeSubmitCkycName: boolean = false;
  isDownloading: boolean = false;
  insurerCode: any;
  isDisableCKyc: boolean = false;
  isEnableCKyc: boolean = true;
  proposalId: any;
  unitedTokenValue: any;
  decodedString: any;
  regNo: any;
  waitCkycVerificationJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: WaitCkycVerificationDialogComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'wait-ckyc-verification-class',
  };
  ckycData: any;
  isProposerTrue: boolean = true;
  isCkycDone: boolean = false;
  documentNumber: any;
  renewalDetails: any;
  documentMaxLength: any;
  getInsurerDetails: any;
  proposalData: any;
  showFullName: boolean = false;
  previousDetails: any;
  details: any;
  selectedDocument: any;

  constructor(
    private formBuild: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    private sharedDataService: SharedDataService
  ) {
    this.ckycList = [
      {
        id: 1,
        name: 'Yes',
      },
      {
        id: 2,
        name: 'No',
      },
    ];
    if (this.isCheckKyc == false) {
      this.ckycFormGroup = this.formBuild.group({
        // ckyc_id: [2],
        document_type_based_field: [''],
        document_number_based_field: [
          '',
          [this.documentNumberValidator.bind(this)],
        ],
        dob: [''],
        ckyc_number: [''],
        ckyc_full_name: [''],
        ckyc_gender: [''],
        ckyc_download_data: [''],
      });
      this.validationAddCkycForm();
    }
  }

  ngOnInit(): void {
    this.setCalenderRange();
    this.proposerType = sessionStorage.getItem('proposerType');
    this.proposerType == 'individual'
      ? this.dobPlaceholder
      : (this.dobPlaceholder = 'Select Date of Incorporation');
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.quoteData = JSON.parse(sessionStorage.getItem('quotes_data') || '{}');
    if (this.quoteData['insurer_code'] === 'digit') {
      this.changeSubmitCkycName = true;
    }
    this.proposerType == 'individual'
      ? (this.isProposerTrue = true)
      : (this.isProposerTrue = false);
    this.sharedDataService?.insurerDetails?.subscribe((getInsurerDetails) => {
      this.getInsurerDetails = getInsurerDetails;
      this.getDocumentType();
    });
    if (this.quoteData?.insurer_code) {
      this.getDocumentType();
    }
    if (sessionStorage.getItem('withoutVehicleNumber') == 'true') {
      this.sharedDataService.getVahaanDetails.subscribe((res: any) => {
        this.ckycFormGroup.patchValue({
          document_number_based_field: res?.customer_details?.pan_number,
          dob: res?.customer_details?.dob,
        });
      });
    }
    let isSubmitCkycFormGroupCalled = false;
    this.sharedDataService.getProposalDetails.subscribe((proposal) => {
      this.proposalId = proposal?.proposal_id;
      this.proposalData = proposal;
      if (proposal?.ckyc_details !== null) {
        if (this.quoteData?.insurer_code == 'united_india') {
          if (proposal?.ckyc_details?.is_verification) {
            this.isDisableCKyc = true;
          }
        }
        if (proposal?.ckyc_details?.is_verification) {
          this.isDisableCKyc = true;
        }
        this.isCkycDone = true;
        this.ckycData = proposal?.ckyc_details?.document_code;
        this.ckycFormGroup.patchValue({
          // document_type_based_field: proposal?.ckyc_details?.document_type,
          document_number_based_field: proposal?.ckyc_details?.document_number,
          dob: moment(proposal?.ckyc_details?.dob, 'DD/MM/YYYY').toDate(),
          ckyc_full_name: proposal?.ckyc_details?.full_name,
          ckyc_gender: proposal?.ckyc_details?.gender,
        });
        if (
          this.documentList &&
          this.proposalData?.ckyc_details?.document_type
        ) {
          for (let document of this.documentList) {
            if (
              document?.document_code ===
              this.proposalData?.ckyc_details?.document_type
            ) {
              this.ckycFormGroup.patchValue({
                document_type_based_field:
                  this.proposalData?.ckyc_details?.document_type,
                document_number_based_field:
                  this.proposalData?.ckyc_details?.document_number,
                dob: moment(
                  this.proposalData?.ckyc_details?.dob,
                  'DD/MM/YYYY'
                ).toDate(),
                ckyc_full_name: this.proposalData?.ckyc_details?.full_name,
                ckyc_gender: this.proposalData?.ckyc_details?.gender,
              });
            }
            this.documentNumberValidation()
          }
        }
        // let renewalDataType = sessionStorage.getItem('renewalType');
        // const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
        // if (renewalDataType == 'renewal' && !isSubmitCkycFormGroupCalled) {
        //   if (this.ckycFormGroup.valid) {
        //     let isCkycDone = sessionStorage.getItem('isCKycDOne');
        //     if (!isCkycDone) {
        //       if (!kycData?.verification_status) {
        //         this.submitCkycFormGroup(true);
        //       }
        //       isSubmitCkycFormGroupCalled = true;
        //     }
        //   }
        // }
        // let previous_insurer = JSON.parse(
        //   sessionStorage.getItem('previous_insurerCode') || ''
        // );
        // if (
        //   kycData?.insurer_code == this.quoteData?.insurer_code &&
        //   sessionStorage.getItem('proposerType') === kycData?.proposer_type &&
        //   proposal?.ckyc_details?.is_verification
        // ) {
        //   this.isDisableCKyc = true;
        // } else if (previous_insurer == this.proposalData?.insurer_code) {
        //   this.isDisableCKyc = true;
        // }
      } else {
        this.isDisableCKyc = false;
      }
    });
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    const renewalType = sessionStorage.getItem('renewalType');
    if (renewalType != 'rollover' && renewalType != 'renewal') {
      // if (
      //   kycData?.insurer_code === this.quoteData['insurer_code'] &&
      //   sessionStorage.getItem('proposerType') === kycData?.proposer_type &&
      //   kycData?.verification_status === true
      // ) {
      //   this.isDisableCKyc = true;
      // } else if (
      //   kycData?.insurer_code !== this.quoteData['insurer_code'] &&
      //   sessionStorage.getItem('proposerType') !== kycData?.proposer_type &&
      //   kycData?.verification_status === true
      // ) {
      //   this.sharedDataService.openSnackBar(
      //     'As you have change the insurer company you need to do your ckyc again.',
      //     true,
      //     10000
      //   );
      // }
    } else {
      this.previousDetails = sessionStorage.getItem('RenewalPreviousDetails');
      this.details = JSON.parse(this.previousDetails);
      if (this.details == null) {
        this.regNo = sessionStorage.getItem('registrationNumber');

        let apiUrl;

        apiUrl = `?registration_number=${this.regNo.toUpperCase()}`;

        this.apiService
          .getRequestedResponse(`${ApiConstants.get_renewal_policy}${apiUrl}`)
          .subscribe((res: any) => {
            if (res?.status) {
              sessionStorage.setItem(
                'RenewalPreviousDetails',
                JSON.stringify(res)
              );
              this.previousDetails = sessionStorage.getItem(
                'RenewalPreviousDetails'
              );
              this.sharedDataService.getRenewalData(res);
              this.details = JSON.parse(this.previousDetails);
              const ckycDetails =
                this.details?.previous_policy_details?.ckyc_details;
              this.ckycFormGroup.patchValue({
                document_type_based_field: ckycDetails?.document_type,
                document_number_based_field: ckycDetails?.document_number,
                dob: ckycDetails?.dob,
                ckyc_full_name: ckycDetails?.full_name,
                ckyc_gender: ckycDetails?.gender,
                ckyc_download_data: ckycDetails?.is_verification,
              });
            }
          });
      } else {
        const ckycDetails = this.details?.previous_policy_details?.ckyc_details;
        this.ckycFormGroup.patchValue({
          document_type_based_field: ckycDetails?.document_type,
          document_number_based_field: ckycDetails?.document_number,
          dob: ckycDetails?.dob,
          ckyc_full_name: ckycDetails?.full_name,
          ckyc_gender: ckycDetails?.gender,
          ckyc_download_data: ckycDetails?.is_verification,
        });
      }
    }
    // this.sharedDataService?.fetchedCkycData.subscribe((kyc) => {
    //   if (kyc?.customer_details?.dob) {
    //     this.ckycFormGroup.patchValue({
    //       dob: moment(kyc?.customer_details?.dob, 'DD/MM/YYYY').toDate(),
    //     });
    //   }
    //   if (kyc?.verification_status === true) {
    //     this.isDisableCKyc = true;
    //   }
    // });
    this.renewalDetails = sessionStorage.getItem('renewalDetails');
    const parsedRenewalDetails = JSON.parse(this.renewalDetails);
    if (parsedRenewalDetails?.ckyc_status) {
      this.ckycFormGroup?.disable();
    }
    if (this.quoteData?.insurer_code == 'united_india') {
      // this.ckycFormGroup.disable();
      this.isEnableCKyc = false;
    }

    // this.previousDetails = sessionStorage.getItem('RenewalPreviousDetails');
    // this.details = JSON.parse(this.previousDetails);

    // const ckycDetails = this.details?.previous_policy_details?.ckyc_details;
    // this.ckycFormGroup.patchValue({
    //   document_type_based_field: ckycDetails?.document_type,
    //   document_number_based_field: ckycDetails?.document_number,
    //   dob: ckycDetails?.dob,
    //   ckyc_full_name: ckycDetails?.full_name,
    //   ckyc_gender: ckycDetails?.gender,
    //   ckyc_download_data: ckycDetails?.is_verification,
    // });
  }

  /**
   *  with  ckyc number get value from form controler
   */
  validationAddCkycForm() {
    this.ckycFormGroup.get('ckyc_number')?.setValidators([]);
    this.ckycFormGroup.get('ckyc_number')?.updateValueAndValidity();
    this.ckycFormGroup
      .get('document_type_based_field')
      ?.setValidators([Validators.required]);
    this.ckycFormGroup
      .get('document_type_based_field')
      ?.updateValueAndValidity();
    this.ckycFormGroup
      .get('document_number_based_field')
      ?.setValidators([Validators.required]);
    this.ckycFormGroup
      .get('document_number_based_field')
      ?.updateValueAndValidity();
    this.ckycFormGroup.get('dob')?.setValidators([Validators.required]);
    this.ckycFormGroup.get('dob')?.updateValueAndValidity();
  }
  /**
   *  with ckyc number get value from form controler
   */
  // withCkycNumber() {
  //   // this.ckycFormGroup.patchValue({
  //   //   ckyc_id: [1],
  //   // });
  //   this.ckycFormGroup.get('ckyc_number')?.setValidators([Validators.required]);
  //   this.ckycFormGroup.get('ckyc_number')?.updateValueAndValidity();
  //   this.ckycFormGroup.get('document_type_based_field')?.setValidators([]);
  //   this.ckycFormGroup
  //     .get('document_type_based_field')
  //     ?.updateValueAndValidity();
  //   this.ckycFormGroup.get('document_number_based_field')?.setValidators([]);
  //   this.ckycFormGroup
  //     .get('document_number_based_field')
  //     ?.updateValueAndValidity();
  //   this.ckycFormGroup.get('dob')?.setValidators([]);
  //   this.ckycFormGroup.get('dob')?.updateValueAndValidity();
  // }
  submitCkycFormGroup(isValid: boolean) {
    if (this.quoteData?.insurer_code == 'united_india') {
      this.getUnitedCkycToken();
    } else {
      if (this.changeSubmitCkycName) {
        this.sharedDataService?.createProposalId('ckyc', this.ckycFormGroup);
      } else {
        this.changeSubmitCkycName = false;
        this.qoutes_data = JSON.parse(
          sessionStorage.getItem('quotes_data') || '{}'
        );
        let ckycData: any = {
          proposal_id: sessionStorage.getItem('proposal_Id'),
          proposer_type: sessionStorage.getItem('proposerType'),
          insurer_code: this.qoutes_data['insurer_code'],
          transaction_id: sessionStorage.getItem('transaction_id'),
        };
        if (isValid) {
          if (this.documentName == 'aadhaar_number') {
            if (
              this.qoutes_data['insurer_code'] === 'liberty' ||
              this.qoutes_data['insurer_code'] === 'future' ||
              this.qoutes_data['insurer_code'] === 'sbi_general' ||
              this.qoutes_data['insurer_code'] === 'universal_sompo'
            ) {
              let inputString = this.ckycFormGroup.get(
                'document_number_based_field'
              )?.value;
              this.documentNumber = inputString.substr(inputString.length - 4);
            } else {
              this.documentNumber = this.ckycFormGroup.get(
                'document_number_based_field'
              )?.value;
            }
          } else {
            this.documentNumber = this.ckycFormGroup.get(
              'document_number_based_field'
            )?.value;
          }

          ckycData['dob'] = this.datePipe.transform(
            this.ckycFormGroup.get('dob')?.value,
            'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
          );
          ckycData['document_number'] = String(
            this.documentNumber
              ? this.documentNumber
              : this.ckycFormGroup.get('document_number_based_field')?.value
          ).toLocaleUpperCase();
          // ckycData['ckyc_number'] = '';
          ckycData['document_type'] = this.filterDocumentType(
            this.ckycFormGroup.get('document_type_based_field')?.value
          );
          ckycData['is_consent_given'] = true;
          ckycData['full_name'] =
            this.ckycFormGroup.get('ckyc_full_name')?.value != undefined &&
            this.ckycFormGroup.get('ckyc_full_name')?.value != ''
              ? this.ckycFormGroup.get('ckyc_full_name')?.value
              : null;
          ckycData['gender'] =
            this.ckycFormGroup.get('ckyc_gender')?.value != undefined &&
            this.ckycFormGroup.get('ckyc_gender')?.value != ''
              ? String(this.ckycFormGroup.get('ckyc_gender')?.value)
              : null;
          this.openWaitCkycVerificationPopup(ckycData);
          this.sharedDataService?.sendCkycFormData(this.ckycFormGroup);
        }
      }
    }
    sessionStorage.setItem(
      'previous_insurerCode',
      JSON.stringify(this.quoteData['insurer_code'])
    );
  }
  /**
   * calender min max handling
   */
  setCalenderRange() {
    const currentDate = new Date();
    if (sessionStorage.getItem('proposerType') == 'corporate') {
      this.maxDate = new Date(
        this.maxDate.setFullYear(currentDate.getFullYear() - 0)
      );
    } else {
      this.maxDate = new Date(
        this.maxDate.setFullYear(currentDate.getFullYear() - 18)
      );
    }
    this.minDate = new Date(
      this.minDate.setFullYear(currentDate.getFullYear() - 124)
    );
  }

  /**
   *  document list filter based on document id
   */
  filterDocumentType(document_code: any) {
    const filteredDocuments = this.documentList?.filter(
      (el: any) => el.document_code == document_code
    );
    if (filteredDocuments?.length > 0) {
      return filteredDocuments[0].document_code;
    }
  }

  /**
   * get document type api
   */

  getDocumentType() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.document_type()}?insurer_code=${
          this.quoteData?.insurer_code
            ? this.quoteData?.insurer_code
            : this.getInsurerDetails?.quote_response?.insurer_code
        }&is_individual=${this.isProposerTrue}&is_corporate=${!this
          .isProposerTrue}&is_ckyc=true&is_ckyc_upload=false`
      )
      .subscribe((res) => {
        this.documentList = res;
        if (this.documentList.length > 0) {
          this.ckycFormGroup
            .get('document_type_based_field')
            ?.setValue(this.documentList[0].document_code);
        }
        this.selectedDocument=this.documentList[0].document_code
        this.getDocumentTypeValue(this.documentList[0].document_code)
        if (
          this.documentList &&
          this.proposalData?.ckyc_details?.document_type
        ) {
          for (let document of this.documentList) {
            if (
              document?.document_code ===
              this.proposalData?.ckyc_details?.document_type
            ) {
              this.ckycFormGroup.patchValue({
                document_type_based_field:
                  this.proposalData?.ckyc_details?.document_type,
                document_number_based_field:
                  this.proposalData?.ckyc_details?.document_number,
                dob: moment(
                  this.proposalData?.ckyc_details?.dob,
                  'DD/MM/YYYY'
                ).toDate(),
                ckyc_full_name: this.proposalData?.ckyc_details?.full_name,
                ckyc_gender: this.proposalData?.ckyc_details?.gender,
              });
            }
          }
        }
      });
  }

  /**
   * get ckyc number
   */
  // checkKycNumber(event: any) {
  //   if (event.value == 1) {
  //     this.withCkycNumber();
  //     this.isCheckKyc = true;
  //   } else {
  //     this.validationAddCkycForm();
  //     this.isCheckKyc = false;
  //   }
  // }

  /**
   * this fucntion use wait ckyc verification modal
   */
  openWaitCkycVerificationPopup(ObjData: any) {
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
      modalName: this.waitCkycVerificationJSON['modalName'],
      width: this.waitCkycVerificationJSON['widthObtained'],
      height: this.waitCkycVerificationJSON['heightObtained'],
      classNameObtained: this.waitCkycVerificationJSON['classObtained'],
      isOutSideClose: this.waitCkycVerificationJSON['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj).subscribe((data) => {
      if (data == undefined) {
        this.isCkycDone = false;
      }
      if (data != undefined) {
        if (!data['error']) {
          this.isCkycDone = true;
          this.afterProceedGetData.emit(data);
          this.sharedDataService.kycFetched(data);
        }
      }
    });
  }
  /**
   * get current document value
   */
  getDocumentTypeValue(event: any) {
    this.documentName = this.filterDocumentType(event);
    const documentNumberBasedField = this.ckycFormGroup.get(
      'document_number_based_field'
    );
    if (event == 'pan_number') {
      this.documentMaxLength = 10;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
      ]);
    } else if (event == 'mobile_number') {
      this.documentMaxLength = 10;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern('[0-9]{10}'),
      ]);
    } else if (event == 'aadhaar_number') {
      this.documentMaxLength = 12;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern('[0-9]{12}'),
      ]);
    } else if (event == 'ckyc_number') {
      this.documentMaxLength = 14;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern('[0-9]{14}'),
      ]);
    } else if (event == 'driving_license') {
      this.documentMaxLength = 15;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z]{2}\d{13}$/),
      ]);
    } else if (event == 'voter_id') {
      this.documentMaxLength = 10;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z][A-Za-z0-9]{8}[0-9]$/),
      ]);
    } else if (event == 'passport_number') {
      this.documentMaxLength = 8;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z][A-Za-z0-9]{6}[0-9]$/),
      ]);
    } else if (event == 'cin') {
      this.documentMaxLength = 21;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]{21}$/),
      ]);
    } else if (event == 'gstin_number') {
      this.documentMaxLength = 15;
      documentNumberBasedField?.setValidators([
        Validators.required,
        Validators.pattern(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
        ),
      ]);
    } else {
      this.documentMaxLength = 30;
      documentNumberBasedField?.setValidators([
        Validators.pattern(/^[A-Za-z0-9]{30}$/),
      ]);
    }
    if(this.selectedDocument!=event){
      this.ckycFormGroup.patchValue({
      document_number_based_field: '',
      dob: '',
      ckyc_full_name: '',
      ckyc_gender: '',
    });
    }
    if (this.documentName == 'aadhaar_number') {
      this.ckycFormGroup
        .get('ckyc_full_name')
        ?.setValidators([Validators.required]);
      this.ckycFormGroup.get('ckyc_full_name')?.updateValueAndValidity();
      this.ckycFormGroup
        .get('ckyc_gender')
        ?.setValidators([Validators.required]);
      this.ckycFormGroup.get('ckyc_gender')?.updateValueAndValidity();
    } else {
      this.ckycFormGroup.get('ckyc_full_name')?.setValidators([]);
      this.ckycFormGroup.get('ckyc_full_name')?.updateValueAndValidity();
      this.ckycFormGroup.get('ckyc_gender')?.setValidators([]);
      this.ckycFormGroup.get('ckyc_gender')?.updateValueAndValidity();
    }
    if (this.quoteData['insurer_code'] === 'cholamandalam') {
      if (this.documentName != 'aadhaar_number') {
        this.showFullName = true;
        this.ckycFormGroup
          .get('ckyc_full_name')
          ?.setValidators([Validators.required]);
        this.ckycFormGroup.get('ckyc_full_name')?.updateValueAndValidity();
      } else {
        this.showFullName = false;
        this.ckycFormGroup
          .get('ckyc_full_name')
          ?.removeValidators([Validators.required]);
        this.ckycFormGroup.get('ckyc_full_name')?.updateValueAndValidity();
      }
    }
  }
  /**
   *   document validator function
   */
  documentNumberValidator(control: FormControl) {
    if (this.documentName == 'pan_number') {
      this.numberRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]$/;
    }
    if (this.documentName == 'aadhaar_number') {
      this.numberRegex = /^\d{12}$/;
    }
    if (
      this.documentName == 'driving_license' ||
      this.documentName == 'voter_id' ||
      this.documentName == 'ckyc_number' ||
      this.documentName == 'passport_number'
    ) {
      this.numberRegex = /^[A-Za-z0-9]*$/;
    }
    if (!this.numberRegex?.test(control.value) && control.value != '') {
      return { validDOC: true };
    }

    return null;
  }
  /**
   * Downloads the terms and conditions document as a.docx file.
   */

  downloadTerms() {
    let url = '/assets/file/Download_consent_form_format.docx';
    var anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = 'Download consent form format';
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }
  /**
   * This function is used to check the terms and conditions checkbox
   */
  checkedTerms(event: any) {
    this.isDownloading = event.checked;
  }
  EnterKey(event: Event, manufacture: MatDatepicker<Date>) {
    this.sharedDataService.handleEnterKey(event, manufacture);
  }
  /**
   * get united Ckyc Token api
   */

  getUnitedCkycToken() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.united_ckyc_token}?insurer_quote_id=${this.quoteData?.quote_id}&transaction_id=${this.quoteData?.transaction_id}`
      )
      .subscribe((res) => {
        this.unitedTokenValue = res;
        const base64String = `${res?.workflow_id}`;
        this.decodedString = atob(base64String);
        setTimeout(() => {
          this.unitedCkycVerification(res?.token, this.decodedString);
        }, 1000);
      });
  }

  unitedCkycVerification(token: any, workflod_id: any) {
    const accessToken = `${token}`;
    const hyperKycConfig = new (window as any).HyperKycConfig(
      accessToken,
      `${workflod_id}`,
      `${this.proposalId}`
    );
    // (window as any).HyperKYCModule.launch(hyperKycConfig, this.handler);
    this.launchHyperKYC(hyperKycConfig);
  }

  launchHyperKYC(config: any) {
    HyperKYCModule.launch(config, this.handler);
  }

  handler = (HyperKycResult: any) => {
    switch (HyperKycResult.status) {
      case 'user_cancelled':
        this.sharedDataService.openSnackBar(
          HyperKycResult['errorMessage'],
          false,
          3000
        );
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'error':
        this.sharedDataService.openSnackBar(
          HyperKycResult['errorMessage'],
          false,
          3000
        );
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'auto_approved':
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'auto_declined':
        this.unitedCkycResponse(HyperKycResult);
        break;
      case 'needs_review':
        this.unitedCkycResponse(HyperKycResult);
        break;
    }
  };

  /**
   * United CKYC Response Update
   */

  unitedCkycResponse(ckycResponse: any) {
    const data = {
      transaction_id: this.quoteData?.transaction_id,
      proposal_id: this.proposalId,
      ckyc_response: { ckycResponse },
    };
    this.apiService
      .postRequestedResponse(ApiConstants.united_ckyc_response, data)
      .subscribe((res) => {
        if (res?.status == true) {
          this.sharedDataService.openSnackBar(res?.message, true, 3000);
          this.sharedDataService.createProposalId();
        } else {
          this.sharedDataService.openSnackBar(res?.message, false, 3000);
          this.sharedDataService.createProposalId();
        }
      });
  }
  documentNumberValidation() {
    const alternateControl = this.ckycFormGroup.get('document_number_based_field')?.value;
    if (alternateControl && alternateControl.includes('*')) {
      this.ckycFormGroup.get('document_number_based_field')?.setValidators([this.sharedDataService.customFieldValidator('pan')]);
      this.ckycFormGroup.get('document_number_based_field')?.updateValueAndValidity(); 
    }
  }
}
