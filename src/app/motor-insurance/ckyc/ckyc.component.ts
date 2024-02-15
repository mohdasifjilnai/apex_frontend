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
  proposerType:any
  dobPlaceholder:String='Select Date of Birth'
  waitCkycVerificationJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: WaitCkycVerificationDialogComponent,
    widthObtained: '75%',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'wait-ckyc-verification-class',
  };
  constructor(
    private formBuild: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private matDialog: WindowRef
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
  }

  ngOnInit(): void {
    if (this.isCheckKyc == false) {
      this.withOutCkycNumber();
    }
    this.setCalenderRange();
    this.getDocumentType();
    this.proposerType=localStorage.getItem('proposerType');
    (this.proposerType=='individual')?this.dobPlaceholder:this.dobPlaceholder='Select Date of Incorporation';
  }

  /**
   *  with out ckyc number get value from form controler
   */
  withOutCkycNumber() {
    this.ckycFormGroup = this.formBuild.group({
      ckyc_id: [2],
      document_type: ['', [Validators.required]],
      document_number: [
        '',
        [Validators.required,this.documentNumberValidator.bind(this)],
      ],
      dob: ['', [Validators.required]],
    });
  }
  /**
   *  with ckyc number get value from form controler
   */
  withCkycNumber() {
    this.ckycFormGroup = this.formBuild.group({
      ckyc_id: [1],
      CKYC_Number: ['', [Validators.required]],
    });
  }
  submitCkycFormGroup(isValid: boolean) {
    if (isValid && this.ckycFormGroup.get('ckyc_id')?.value == 2) {
      let body = {
        proposal_id: 2332,
        proposer_type: 'individual',
        insurer_code: 'icici',
        transaction_id: '67392wruirew',
        dob: this.datePipe.transform(
          this.ckycFormGroup.get('dob')?.value,
          'dd-mm-yyyy'
        ),
        document_number: String(
          this.ckycFormGroup.get('document_number')?.value
        ),
        ckyc_id: String(this.ckycFormGroup.get('ckyc_id')?.value),
        document_type: this.filterDocumentType(
          this.ckycFormGroup.get('document_type')?.value
        ),
      };
      this.openWaitCkycVerificationPopup(body);
    }
  }
  /**
   * calender min max handling
   */
  setCalenderRange() {
    const currentDate = new Date();
    this.maxDate = new Date(
      this.maxDate.setFullYear(currentDate.getFullYear() - 18)
    );
    this.minDate = new Date(
      this.minDate.setFullYear(currentDate.getFullYear() - 85)
    );
  }

  /**
   *  document list filter based on document id
   */
  filterDocumentType(document_id: number) {
    const filteredDocuments = this.documentList.filter(
      (el: any) => el.document_id == document_id
    );
    if (filteredDocuments.length > 0) {
      return filteredDocuments[0].document_name;
    }
  }

  /**
   * get document type api
   */

  getDocumentType() {
    this.apiService
      .getRequestedResponse(ApiConstants.document_type)
      .subscribe((res) => {
        this.documentList = res;
      });
  }

  /**
   * get ckyc number
   */
  checkKycNumber(event: any) {
    if (event.value == 1) {
      this.withCkycNumber();
      this.isCheckKyc = true;
    } else {
      this.withOutCkycNumber();
      this.isCheckKyc = false;
    }
  }

  /**
   * this fucntion use wait ckyc verification modal
   */
  openWaitCkycVerificationPopup(ObjData: any) {
    let resWidth;
    let resTop;
    if (window.screen.width <= 767) {
      resWidth = '95%';
      resTop = '5%';
    } else {
      resWidth = '75%';
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

    this.matDialog.openDialog(obj).subscribe((data)=>{
      this.afterProceedGetData.emit(data);
    })
  }
/**
* get current document value
*/  
  getDocumentTypeValue(event: any) {
    this.documentName = this.filterDocumentType(event);
    this.ckycFormGroup.patchValue({
      document_number: '' 
    })
  }
/**
 *   document validator function
 */  
  documentNumberValidator(control: FormControl) {
    if (this.documentName == 'PAN') {
      this.numberRegex = /^[A-Za-z]{5}\d{4}[A-Za-z]$/;
    }
    if (this.documentName == 'AADHAR') {
      this.numberRegex = /^\d{12}$/;
    }
    if (
      this.documentName == 'Driving License' ||
      this.documentName == 'Voter ID' ||
      this.documentName == 'Passport Number '
    ) {
      this.numberRegex = /^[A-Za-z0-9]*$/;
    }
    if (!this.numberRegex?.test(control.value) && control.value != '') {
      return { validDOC: true };
    }

    return null;
  }
}
