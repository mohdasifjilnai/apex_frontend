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
    this.getDocumentType();
    this.sharedDataService.getProposalDetails.subscribe((proposal) => {
      if (proposal?.ckyc_details !== null) {
        this.isCkycDone = true;
        this.ckycData = proposal?.ckyc_details?.document_code;
        this.ckycFormGroup.patchValue({
          document_type_based_field: proposal?.ckyc_details?.document_type,
          document_number_based_field: proposal?.ckyc_details?.document_number,
          dob: moment(proposal?.ckyc_details?.dob, 'DD/MM/YYYY').toDate(),
          ckyc_full_name: proposal?.ckyc_details?.full_name,
          ckyc_gender: proposal?.ckyc_details?.gender,
        });
      }
    });
    const kycData = JSON.parse(sessionStorage.getItem('kycData') || '{}');
    if (
      kycData?.insurer_code === this.quoteData['insurer_code'] &&
      kycData?.verification_status === true
    ) {
      this.isDisableCKyc = true;
    } else if (
      kycData?.insurer_code !== this.quoteData['insurer_code'] &&
      kycData?.verification_status === true
    ) {
      this.sharedDataService.openSnackBar(
        'As you have change the insurer company you need to do your ckyc again.',
        true,
        10000
      );
    }
    this.sharedDataService?.fetchedCkycData.subscribe((kyc) => {
      if (kyc?.verification_status === true) {
        this.isDisableCKyc = true;
      }
    });
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
    if (this.changeSubmitCkycName) {
      this.sharedDataService?.createProposalId('ckyc', this.ckycFormGroup);
    } else {
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
        ckycData['dob'] = this.datePipe.transform(
          this.ckycFormGroup.get('dob')?.value,
          'dd/MM/yyyy' // corrected format to 'dd/MM/yyyy'
        );
        ckycData['document_number'] = String(
          this.ckycFormGroup.get('document_number_based_field')?.value
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
        `${ApiConstants.document_type}?insurer_code=${
          this.quoteData?.insurer_code
        }&is_individual=${this.isProposerTrue}&is_corporate=${!this
          .isProposerTrue}&is_ckyc=true&is_ckyc_upload=false`
      )
      .subscribe((res) => {
        this.documentList = res;
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
      if (!data['error']) {
        this.isCkycDone = true;
        this.afterProceedGetData.emit(data);
        this.sharedDataService.kycFetched(data);
      }
    });
  }
  /**
   * get current document value
   */
  getDocumentTypeValue(event: any) {
    this.documentName = this.filterDocumentType(event);
    this.ckycFormGroup.patchValue({
      document_number_based_field: '',
      dob: '',
      ckyc_full_name: '',
      ckyc_gender: '',
    });
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
}
