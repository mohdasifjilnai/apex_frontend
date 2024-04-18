import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';
import { WindowRef } from 'src/app/core/services/window-ref.service';

@Component({
  selector: 'app-ckyc-documents',
  templateUrl: './ckyc-documents.component.html',
  styleUrls: ['./ckyc-documents.component.scss'],
})
export class CkycDocumentsComponent implements OnInit {
  fileName: any = 'Upload Document';
  uploadDocumentsForm!: FormGroup;
  isUploadDocment: boolean = false;
  showPOI: boolean = false;
  showDocumentSelect: boolean = true;
  fileURL: any;
  showPOA: boolean = false;
  showCkyc: boolean = false;
  showDocument: boolean = false;
  showEyeIcon: boolean = false;
  fetchCkycParam: any;
  documentList: any;
  document_url: any;
  flag: boolean = false;
  transactionId: any;
  proposalId: any;
  proposerType: any;
  documentHeaderText: string =
    'We are unable to fetch your details completely. Please follow up with the offline CKYC.';
  formFieldPOA: Record<string, any> = {}; // Initialize as needed;
  formFieldPOI: Record<string, any> = {};
  documentPOIText: any;
  isTwoObject: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CkycDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.fetchCkycParam = data['data'];
    this.getDocumentType(this.fetchCkycParam);
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
    this.proposerType = sessionStorage.getItem('proposerType');
  }

  ngOnInit(): void {
    this.uploadDocumentsFormControler();
  }
  /**
Event handler for when a file is selected.
@param event - The file selection event.
 */
  /**
Event handler for when a file is selected.
@param event - The file selection event.
 */
  onFileSelected(event: any, fileFormControlName: FormControl): void {
    const selectedFile: File = event.target.files[0];
    this.fileName =
      selectedFile.name.length > 30
        ? selectedFile.name.substring(0, 30) + '...'
        : selectedFile.name;
    this.showEyeIcon = true;
    let formData: FormData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    this.apiService
      .postRequestedResponse(
        `${ApiConstants['upload_document']}?transaction_id=${this.transactionId}&proposal_id=${this.proposalId}`,
        formData
      )
      ?.subscribe((res) => {
        this.checkUploadDocment(res['document_url']);
        this.uploadDocumentsForm.patchValue({
          fileFormControlName: res['document_url'],
        });
      });
  }

  submitDocuments() {
    this.showPOI = true;
    this.showDocumentSelect = false;
  }
  submitPOI() {
    this.showPOI = false;
    this.showPOA = true;
  }
  submitPOA() {
    this.showPOA = false;
    this.showCkyc = true;
  }
  /**
   * Fetches the list of document types supported by the insurer.
   */
  getDocumentType(fetchCkycParam: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.document_type}?insurer_code=${
          fetchCkycParam?.insurer_code
        }&is_individual=${
          fetchCkycParam.isProposerTrue
        }&is_corporate=${!fetchCkycParam.isProposerTrue}&is_ckyc=false&is_ckyc_upload=true`
      )
      .subscribe((res) => {
        this.documentList = res;
        console.log(this.documentList);
      });
  }
  /**
   * Closes the dialog and returns any data passed to the dialog.
   */
  popupCLose() {
    this.dialogRef.close();
  }
  /**
handles the form submit for uploading the required documents
@param valid - boolean value indicating if the form is valid or not
 */
  submitUploadDocumentsForm(valid: boolean) {
    console.log(this.uploadDocumentsForm, 'uploadDocumentsForm');
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
   * initializes the form for uploading the required documents
   */
  uploadDocumentsFormControler() {
    this.uploadDocumentsForm = this.formBuilder.group({
      document_type_based_field: ['', [Validators.required]],
    });
  }
  /**
   * Fetches the list of document types supported by the insurer.
   */
  getDocumentKey($event: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.ckyc_upload_document_fields}?insurer_code=${
          this.fetchCkycParam.insurer_code
        }&document_code=${
          this.uploadDocumentsForm.get('document_type_based_field')?.value
        }`
      )
      .subscribe((res) => {
        if (res['poa']) {
          this.formFieldPOA = res['poa'];
          this.showPOA = true;
          this.documentHeaderText = `Please complete the document details for POA`;
          for (let field in this.formFieldPOA) {
            this.uploadDocumentsForm.addControl(
              this.formFieldPOA[field].label,
              new FormControl('', Validators.required)
            );
          }
        }
        if (res['poi']) {
          this.formFieldPOI = res['poi'];
          this.showPOI = true;
          this.documentPOIText = `Please complete the document details for POI`;
          for (let field in this.formFieldPOI) {
            this.uploadDocumentsForm.addControl(
              this.formFieldPOI[field].label,
              new FormControl('', Validators.required)
            );
          }
        }
        if (res['poa'] && res['poi']) {
          this.isTwoObject = true;
        }
      });
  }
}
