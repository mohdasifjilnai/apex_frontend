import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from '../../../../api.constant';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CkycDocumentsComponent } from '../ckyc-documents/ckyc-documents.component';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  getUploadFile: any;
  transactionId: any;
  proposalId: any;
  isDocumentUploaded: boolean = true;
  isDcocumentUploadProceesing: boolean = false;
  documentName: any;
  isShowPhoto: boolean = false;
  document_image_url: any;
  isUploadDocment: boolean = false;
  document_url: any;
  fileName: any = 'Upload Document';
  proposerType: any;
  isProposerTrue: boolean = true;
  loader: boolean = false;
  universalShampoo:boolean=false
  safeUrl: SafeResourceUrl | undefined;
  ckycDocumentsJson: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: CkycDocumentsComponent,
    widthObtained: 'auto',
    heightObtained: 'auto',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'ckyc-documents',
  };
  sompoCkycData: any;
  constructor(
    public dialogRef: MatDialogRef<WaitCkycVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public bottomSheet: MatBottomSheet,
    private matDialog: WindowRef,
    private sanitizer: DomSanitizer
  ) {
    this.ckycBody = data['data'];
    this.documentName = this.ckycBody['document_type'].split('_')[0];
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
    this.proposerType = sessionStorage.getItem('proposerType');
    this.proposerType == 'individual'
      ? (this.isProposerTrue = true)
      : (this.isProposerTrue = false);
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
      .subscribe(
        (res) => {
          if (
            res['customer_details'] != null &&
            res['upload_document'] == false
          ) {
            this.isWaitingTime = true;
            this.isCustomerDetails = true;
            this.ckycData = res.customer_details;
            this.sharedDataService?.fetchCKycFormData.subscribe((res) => {
              this.sharedDataService?.createProposalId('ckyc', res);
            });
            this.sharedDataService.getFetchedCkycData(res);
            sessionStorage.setItem('kycData', JSON.stringify(res));
          } else if (
            res['customer_details'] == null &&
            res['upload_document'] == false
          ) {
            this.redirectionUrlViaForm = res['redirection_url_via_form'];
            if(this.ckycBody?.insurer_code=='universal_sompo'){
              this.universalShampoo=true
              window.open(res['redirection_url_via_form'],'_blank')
              // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.redirectionUrlViaForm);
            }
            this.error_message = res['error_message'];
            this.isWaitingTime = true;
            this.isCustomerDetails = false;
            sessionStorage.setItem('kycData', JSON.stringify(res));
          } else if (
            res['customer_details'] == null &&
            res['upload_document'] == true
          ) {
            this.isWaitingTime = true;
            this.isCustomerDetails = true;
            this.uploadDocumentsFormControler();
            let paramData = {
              insurer_code: this.ckycBody?.insurer_code,
              isProposerTrue: this.isProposerTrue,
            };
            if (window.innerWidth <= 999) {
              const bottomSheetConfig: MatBottomSheetConfig = {
                data: paramData,
              };
              const bottomSheetRef = this.bottomSheet.open(
                CkycDocumentsComponent,
                bottomSheetConfig
              );
              bottomSheetRef.afterDismissed().subscribe((dataReceived: any) => {
                if (dataReceived['verification_status']) {
                  this.sharedDataService.getFetchedCkycData(dataReceived);
                  this.sharedDataService.kycFetched(dataReceived);
                  sessionStorage.setItem(
                    'kycData',
                    JSON.stringify(dataReceived)
                  );
                }
              });
            } else {
              this.openCkycDocumentsPopup(paramData);
            }
            this.dialogRef.close();
          }
        },
        (error) => {
          this.dialogRef.close();
        }
      );
  }

  /**
   * this fucntion use for close pop up
   */

  onProceedData(resData: any) {
    this.dialogRef.close();
  }
  /**
   *  this function use redirect to insurer
   */
  redirectInsurer(redirectionUrlViaForm: any) {
    this.loader = true;
    window.location.href = redirectionUrlViaForm;
  }
  sompoCkycDetails(){
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.get_usgi_ckyc_details}?transaction_id=${
          this.transactionId
        }&proposal_id=${this.proposalId}`
      )
      .subscribe((res) => {
        this.sompoCkycData = res;
        if(res?.status){
          this.sharedDataService.createProposalId();
          this.dialogRef.close();
        }
      });
  }
  /**
   * Fetches the list of document types supported by the insurer.
   */
  getDocumentType() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.document_type}?insurer_code=${
          this.ckycBody?.insurer_code
        }&is_individual=${this.isProposerTrue}&is_corporate=${!this
          .isProposerTrue}&is_ckyc=true&is_ckyc_upload=false`
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
      file: ['', [Validators.required]],
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
        document_code: this.uploadDocumentsForm.get('document_type_based_field')
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
    this.loader = false;
  }
  /**
   * Closes the dialog and returns the result to the dialog opener.
   * @param resData - The result to be returned.
   */
  popupCLose() {
    this.dialogRef.close();
  }
  /**
   * This function is used to check if the uploaded document is valid or not.
   * @param event - The event object that contains the file information.
   */
  checkUploadDocment(url: string) {
    this.isUploadDocment = true;
    if (this.isUploadDocment) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.get_document_image_url}?document_path=${url}`
        )
        .subscribe((res) => {
          this.document_url = res['document_url'];
        });
    }
  }

  /**
   * this fucntion use wait ckyc verification modal
   */
  openCkycDocumentsPopup(ObjData: any) {
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
      modalName: this.ckycDocumentsJson['modalName'],
      width: this.ckycDocumentsJson['widthObtained'],
      height: this.ckycDocumentsJson['heightObtained'],
      classNameObtained: this.ckycDocumentsJson['classObtained'],
      isOutSideClose: this.ckycDocumentsJson['isOutSideClose'],
      minWidth: resWidth,
      dataInfo: {
        data: ObjData,
        top: resTop,
      },
    };

    this.matDialog.openDialog(obj).subscribe((data) => {
      if (data['verification_status']) {
        this.sharedDataService.getFetchedCkycData(data);
        this.sharedDataService.kycFetched(data);
        sessionStorage.setItem('kycData', JSON.stringify(data));
      } else {
        this.apiService.errorHandler(data);
      }
    });
  }
}
