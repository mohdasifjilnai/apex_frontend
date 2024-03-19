import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from '../../../../api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wait-ckyc-verification-dialog',
  templateUrl: './wait-ckyc-verification-dialog.component.html',
  styleUrls: ['./wait-ckyc-verification-dialog.component.scss'],
})
export class WaitCkycVerificationDialogComponent implements OnInit {
  uploadDocumentsForm!: FormGroup;
  isWaitingTime: boolean = false;
  ckycData: any;
  documentList: any;
  quoteData: any;
  ckycBody: any;
  isCustomerDetails: boolean = true;
  redirectionUrlViaForm: any;
  error_message: any;
  isUpload: boolean = false;
  uploadedImage: any = '/assets/icon/browseFile.svg';
  getUploadFile: any;
  transactionId: any;
  proposalId: any;
  isDocumentUploaded: boolean = true;
  isDcocumentUploadProceesing: boolean = false;
  fileName: any;
  documentName: any;
  isShowPhoto: boolean = false;
  document_image_url: any;
  constructor(
    public dialogRef: MatDialogRef<WaitCkycVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private formBuilder: FormBuilder
  ) {
    this.ckycBody = data['data'];
    this.documentName = this.ckycBody['document_type'].split('_')[0];
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
  }

  ngOnInit(): void {
    this.fetchCkyc(this.ckycBody);
  }

  /**
   * Fetches the CKYC data from the API.
   *
   * @param body - The request body containing the customer details.
   */
  fetchCkyc(body: any) {
    this.isWaitingTime = false;
    this.apiService
      .postRequestedResponse(ApiConstants.fetch_ckyc_data, body)
      .subscribe((res) => {
        if (
          res['customer_details'] != null &&
          res['upload_document'] == false
        ) {
          this.isWaitingTime = true;
          this.isCustomerDetails = true;
          this.isUpload = false;
          this.ckycData = res.customer_details;
          this.sharedDataService?.fetchCKycFormData.subscribe((res) => {
            this.sharedDataService?.createProposalId('ckyc', res);
          });
          this.sharedDataService.getFetchedCkycData(res);
        } else if (
          res['customer_details'] == null &&
          res['upload_document'] == false
        ) {
          this.redirectionUrlViaForm = res['redirection_url_via_form'];
          this.error_message = res['error_message'];
          this.isWaitingTime = true;
          this.isCustomerDetails = false;
          this.isUpload = false;
        } else if (
          res['customer_details'] == null &&
          res['upload_document'] == true
        ) {
          this.isWaitingTime = true;
          this.isCustomerDetails = true;
          this.isUpload = true;
          this.uploadDocumentsFormControler();
          this.getDocumentType();
        }
      });
  }

  /**
   * this fucntion use for close pop up
   */

  onProceedData(resData: any) {
    this.dialogRef.close(resData);
  }
  /**
   *  this function use redirect to insurer
   */
  redirectInsurer(redirectionUrlViaForm: any) {
    window.location.href = redirectionUrlViaForm;
  }

  /**
   * Event triggered when a file is selected
   * @param event - The event object
   */

  // onFileSelected(event: any) {
  //   this.getUploadFile = event.target.files;
  //   let file: File = this.getUploadFile[0];
  //   let formData: FormData = new FormData();
  //   this.fileName = file.name;
  //   formData.append('file', file, file.name);
  //   this.isDcocumentUploadProceesing = true;
  //   this.apiService
  //     .postRequestedResponse(
  //       `${ApiConstants['upload_document']}?transaction_id=${this.transactionId}&proposal_id=${this.proposalId}`,
  //       formData
  //     )
  //     .subscribe((res) => {
  //       if (res['status_code'] == 201) {
  //         this.isDcocumentUploadProceesing = false;
  //         this.isDocumentUploaded = false;
  //         this.uploadedImage = '/assets/gif/success.gif';
  //       }
  //     });
  // }

  /**
   * Opens a modal dialog to display the uploaded document image.
   * @param fileName - The name of the uploaded file.
   */
  // viewPics(fileName: any) {
  //   this.isShowPhoto = true;
  //   let url = `${ApiConstants['get_document_image_url']}?document_url=documents/ckyc/${this.transactionId}/${fileName}`;
  //   this.apiService.getRequestedResponse(url).subscribe((res) => {
  //     this.document_image_url = res;
  //   });
  // }
  /**
   * Fetches the list of document types supported by the insurer.
   */
  getDocumentType() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.document_type}?insurer_code=${this.ckycBody?.insurer_code}`
      )
      .subscribe((res) => {
        this.documentList = res;
      });
  }
  /**
   * initializes the form for uploading the required documents
   */
  uploadDocumentsFormControler() {
    this.uploadDocumentsForm = this.formBuilder.group({
      document_type_based_field: ['', [Validators.required]],
      document_number_based_field: ['', [Validators.required]],
    });
  }
  /**
   * submits the form data to the backend for uploading the required documents
   * @param isValid - boolean value indicating whether the form is valid or not
   */
  submitUploadDocumentsForm(isValid: boolean) {
    if (isValid) {
      let body = {
        document_no: this.uploadDocumentsForm.get('document_number_based_field')
          ?.value,
        document_type: this.uploadDocumentsForm.get('document_type_based_field')
          ?.value,
        document_url: this.uploadDocumentsForm.get('file')?.value,
        proposal_id: this.proposalId,
        transaction_id: this.transactionId,
      };
      this.apiService
        .postRequestedResponse(`${ApiConstants['upload_document_save']}`, body)
        .subscribe((data) => {
          this.dialogRef.close(data);
        });
    }
  }
  /**
   * Closes the dialog and returns the result to the dialog opener.
   * @param resData - The result to be returned.
   */
  onClose(resData: any) {
    this.dialogRef.close(resData);
  }
}
