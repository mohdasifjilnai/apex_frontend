import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiConstants } from '../../api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { DatePipe } from '@angular/common';
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
  ckycList: any;
  isCheckKyc: boolean = false;
  documentList: any;
  minDate = new Date();
  maxDate = new Date();
  constructor(
    private formBuild: FormBuilder,
    private apiService: ApiService,
    private datePipe: DatePipe
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
    if(this.isCheckKyc==false){
      this.withOutCkycNumber();
    }
    this.setCalenderRange();
    this.getDocumentType();
  }

   /**
   *  with out ckyc number get value from form controler
   */ 
  withOutCkycNumber() {
    this.ckycFormGroup = this.formBuild.group({
      ckyc_id: [2],
      document_type: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
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
    if (isValid && this.ckycFormGroup.get('ckyc_id')?.value==2) {
       
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
      this.apiService
        .postRequestedResponse(ApiConstants.fetch_ckyc_data, body)
        .subscribe((res) => {});
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
}
