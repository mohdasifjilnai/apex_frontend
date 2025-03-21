import {
  ChangeDetectorRef,
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
import { DatePipe } from '@angular/common';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
declare const webengage: any;

@Component({
  selector: 'app-ckyc-documents',
  templateUrl: './ckyc-documents.component.html',
  styleUrls: ['./ckyc-documents.component.scss'],
})
export class CkycDocumentsComponent implements OnInit {
  fileName: any = 'Upload Document';
  vehicleTypeValue: any;
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
  POAFileName: string = '';
  POIFileName: string = '';
  OtherFileName: string = '';
  documentUploaded: any;
  documentURl: any;
  fileControlName: string = '';
  isReUploadDocument: boolean = false;
  formGetData: any;
  maxDate: any;
  minDate: any;
  maxDoiDate = new Date();
  minDoiDate = new Date();
  fileInputError: boolean = true;
  fileInputError1: boolean = true;
  PoiFileInputError: boolean = true;
  isPoiFileInputError: boolean = false;
  isfileInputError: boolean = false;
  isOtherfileInputError: boolean = false;
  isfileInputError1: boolean = false;
  documentMaxLength: any;
  loader: boolean = false;
  POAFileName1: string = '';
  showOther: boolean = false;
  formFieldOther: Record<string, any> = {};
  documentOtherText: any;
  isIndividualTrue: any;
  docTypeData: any;
  documentURlPOI: any;
  documentURlPOA: any;
  documentURlOther: any;
  otherfileInputError: boolean = false;
  reUploadFileCOntrolName: any;
  userType: any;
  ckycdocumentData: any;
  constructor(
    public dialogRef: MatDialogRef<CkycDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private sharedData: SharedDataService,
    public bottomSheetRef: MatBottomSheetRef<CkycDocumentsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetdata: any,
    private cdr: ChangeDetectorRef
  ) {
    if (window.innerWidth <= 999) {
      this.fetchCkycParam = bottomSheetdata;
    } else {
      this.fetchCkycParam = data['data'];
    }

    this.getDocumentType(this.fetchCkycParam);
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
    this.proposerType = sessionStorage.getItem('proposerType');
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('partnerCodeTraceId')
      ? sessionStorage.getItem('partnerCodeTraceId')
      : null;
    this.vehicleTypeValue = sessionStorage.getItem('vehicleType');
    this.uploadDocumentsFormControler();
    const currentDate = new Date();
    this.minDate = new Date(1900, 1, 1);
    this.maxDate = new Date();
    this.maxDate.setFullYear(currentDate.getFullYear() - 18);

    this.maxDoiDate = new Date(
      this.maxDoiDate.setFullYear(currentDate.getFullYear() - 0)
    );

    this.minDoiDate = new Date(
      this.minDoiDate.setFullYear(currentDate.getFullYear() - 124)
    );
  }
  /**
Event handler for when a file is selected.
@param event - The file selection event.
 */
  onFileSelected(
    event: any,
    fileFormControlName: any,
    isReupload: boolean = false
  ): void {
    const selectedFile: File = event.target.files[0];
    const fileInput = event.target as HTMLInputElement; // Reference to the file input element
    this.fileControlName = fileFormControlName;
    const fileType = selectedFile.type;

    // Truncate file name if it's too long
    this.fileName =
      selectedFile.name.length > 20
        ? selectedFile.name.substring(0, 20) + '...'
        : selectedFile.name;

    let isValidFile = false;
    let doc_type = '';

    // Determine file type and valid extensions
    switch (fileFormControlName) {
      case 'poa_doc_url':
      case 'poa_doc_url_1':
        doc_type = 'poa';
        isValidFile = ['image/jpeg', 'image/png', 'application/pdf'].includes(
          fileType
        );
        this.docTypeData = 'poa';
        break;
      case 'doc_url':
        doc_type = 'other';
        isValidFile = ['image/jpeg', 'image/png'].includes(fileType);
        this.docTypeData = 'other';
        break;
      case 'poi_doc_url':
        doc_type = 'poi';
        isValidFile = ['image/jpeg', 'image/png', 'application/pdf'].includes(
          fileType
        );
        this.docTypeData = 'poi';
        break;
    }

    if (!isValidFile) {
      fileInput.value = ''; // This clears the file input
      this.uploadDocumentsForm.get(fileFormControlName)?.reset(); // Reset the form control
      this.setFileInputError(fileFormControlName, true); // Set error state
      return;
    }

    // If file is valid, proceed with the file upload
    const formData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);

    this.apiService
      .postRequestedResponse(
        `${ApiConstants['upload_document']}?transaction_id=${this.transactionId}&proposal_id=${this.proposalId}&document_type=${doc_type}`,
        formData
      )
      .subscribe(
        (res) => {
          if (res['status']) {
            if (isReupload) {
              this.isReUploadDocument = true;
              this.checkUploadDocment(res['document_url'], fileFormControlName);
            }
            this.uploadDocumentsForm
              .get(fileFormControlName)
              ?.setValue(res['document_url']);
            this.setFileInputError(fileFormControlName, false);
          } else {
            fileInput.value = '';
            this.uploadDocumentsForm.get(fileFormControlName)?.reset();
            this.setFileInputError(fileFormControlName, true);
          }
        },
        (error) => {
          fileInput.value = '';
          this.uploadDocumentsForm.get(fileFormControlName)?.reset();
          this.setFileInputError(fileFormControlName, true);
        }
      );
  }

  setFileInputError(fileFormControlName: string, hasError: boolean) {
    switch (fileFormControlName) {
      case 'poa_doc_url':
        this.POAFileName = hasError ? '' : this.fileName;
        this.isfileInputError = hasError;
        break;
      case 'poi_doc_url':
        this.POIFileName = hasError ? '' : this.fileName;
        this.isPoiFileInputError = hasError;
        break;
      case 'poa_doc_url_1':
        this.POAFileName1 = hasError ? '' : this.fileName;
        this.isfileInputError = hasError;
        break;
      case 'doc_url':
        this.OtherFileName = hasError ? '' : this.fileName;
        this.isOtherfileInputError = hasError;
        break;
    }
  }
  /**
   * Event handler for when a file is selected.
   * @param event - The file selection event.
   */
  onSelectionChange(event: any, controlName: string): void {
    this.uploadDocumentsForm.get(controlName)?.setValue(event.value);
  }
  /**
   * Fetches the list of document types supported by the insurer.
   */
  getDocumentType(fetchCkycParam: any) {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants.document_type()}?insurer_code=${
          fetchCkycParam?.insurer_code
        }&is_individual=${
          fetchCkycParam.isProposerTrue
        }&is_corporate=${!fetchCkycParam.isProposerTrue}&is_ckyc=false&is_ckyc_upload=true`
      )
      .subscribe((res) => {
        this.documentList = res;
      });
    this.isIndividualTrue = fetchCkycParam.isProposerTrue;
  }
  /**
   * Closes the dialog and returns any data passed to the dialog.
   */
  popupCLose() {
    if (window.innerWidth <= 999) {
      this.bottomSheetRef.dismiss();
    } else {
      this.dialogRef.close();
    }
  }
  /**
handles the form submit for uploading the required documents
@param valid - boolean value indicating if the form is valid or not
 */
  submitUploadDocumentsForm(valid: boolean) {
    // if (this.uploadDocumentsForm.get('poa_doc_url_1')?.value.includes('fakepath') || this.uploadDocumentsForm.get('poa_doc_url')?.value.includes('fakepath')) {
    //  valid=false
    //  this.uploadDocumentsForm.get('poa_doc_url_1')?.reset();
    //  this.uploadDocumentsForm.get('poa_doc_url')?.reset();
    // }
    console.log(this.uploadDocumentsForm.value);
    const token = sessionStorage.getItem('token');
    this.ckycdocumentData = sessionStorage.getItem('quotes_data');
    let parseCkycData = JSON.parse(this.ckycdocumentData);
    webengage.track('Offline_CKYC_details', {
      User_Type: token != null ? 'Partner' : 'Customer',
      Motor_Type: this.vehicleTypeValue,
      Total_IDV: parseCkycData.premium_details.idv,
      Total_Premium: parseCkycData.premium_details.gross_premium,
      Insurer_Name: parseCkycData.insurer_name,
      Insurer_Logo: parseCkycData.insurer_logo,
    });
    if (valid && !this.loader) {
      this.loader = true;
      let body = {
        proposal_id: this.proposalId,
        transaction_id: this.transactionId,
        proposer_type: this.proposerType,
        insurer_code: this.fetchCkycParam.insurer_code,
        dob: this.uploadDocumentsForm.get('dob')?.value
          ? this.datePipe.transform(
              this.uploadDocumentsForm.get('dob')?.value,
              'dd/MM/yyyy'
            )
          : this.datePipe.transform(
              this.uploadDocumentsForm.get('doi')?.value,
              'dd/MM/yyyy'
            ),
        family_member_name: this.uploadDocumentsForm.get('family_member_name')
          ?.value
          ? this.uploadDocumentsForm.get('family_member_name')?.value
          : null,
        family_member_relation: this.uploadDocumentsForm.get(
          'family_member_relation'
        )?.value
          ? this.uploadDocumentsForm.get('family_member_relation')?.value
          : null,
        poi_document: {
          poi_type: this.showPOI
            ? this.uploadDocumentsForm.get('document_type_based_field')?.value
            : null,
          poi_no: this.uploadDocumentsForm.get('poi_no')?.value
            ? this.uploadDocumentsForm.get('poi_no')?.value
            : null,
          poi_doc_url: this.uploadDocumentsForm.get('poi_doc_url')?.value
            ? this.uploadDocumentsForm.get('poi_doc_url')?.value
            : null,
        },
        poa_document: {
          poa_type: this.showPOA
            ? this.uploadDocumentsForm.get('document_type_based_field')?.value
            : null,
          poa_no: this.uploadDocumentsForm.get('poa_no')?.value
            ? this.uploadDocumentsForm.get('poa_no')?.value
            : null,
          pan_number: this.uploadDocumentsForm.get('pan_number')?.value
            ? this.uploadDocumentsForm.get('pan_number')?.value
            : null,
          poa_doc_url: this.uploadDocumentsForm.get('poa_doc_url')?.value
            ? this.uploadDocumentsForm.get('poa_doc_url')?.value
            : null,
          poa_doc_url_1: this.uploadDocumentsForm.get('poa_doc_url_1')?.value
            ? this.uploadDocumentsForm.get('poa_doc_url_1')?.value
            : null,
        },
        other: {
          photograph: {
            doc_url: this.uploadDocumentsForm.get('doc_url')?.value
              ? this.uploadDocumentsForm.get('doc_url')?.value
              : null,
          },
        },
      };
      if (this.uploadDocumentsForm.get('poi_type')?.value != null) {
        body.poi_document.poi_type =
          this.uploadDocumentsForm.get('poi_type')?.value;
      }
      if (
        this.uploadDocumentsForm.get('document_type_based_field')?.value ==
        'aadhaar_number'
      ) {
        if (
          this.fetchCkycParam['insurer_code'] === 'liberty' ||
          this.fetchCkycParam['insurer_code'] === 'future' ||
          this.fetchCkycParam['insurer_code'] === 'sbi_general' ||
          this.fetchCkycParam['insurer_code'] === 'universal_sompo'
        ) {
          body.poa_document.poa_no = this.uploadDocumentsForm
            .get('poa_no')
            ?.value.slice(-4);
        }
      }
      this.apiService
        .postRequestedResponse(`${ApiConstants.upload_document_save}`, body)
        .subscribe(
          (response) => {
            if (response) {
              this.loader = false;
              setTimeout(() => {
                if (window.innerWidth <= 999) {
                  this.bottomSheetRef.dismiss(response);
                } else {
                  this.dialogRef.close(response);
                }
              }, 300);
            }
          },
          (error) => {
            this.loader = false;
            setTimeout(() => {
              if (window.innerWidth <= 999) {
                this.bottomSheetRef.dismiss();
              } else {
                this.dialogRef.close();
              }
            }, 300);
          }
        );
    }
  }
  /**
   * This function is used to check if the uploaded document is valid or not.
   * @param event - The event object that contains the file information.
   */
  checkUploadDocment(url: string, fileFormControlName: any) {
    this.isUploadDocment = true;
    this.showPOA = false;
    this.showPOI = false;
    this.document_url = '';
    this.showOther = false;
    this.isTwoObject = false;
    this.reUploadFileCOntrolName = fileFormControlName;
    this.documentHeaderText = 'Please review the uploaded document';
    if (this.isUploadDocment) {
      this.apiService
        .getRequestedResponse(
          `${ApiConstants.get_document_image_url}?document_path=${url}`
        )
        .subscribe((res) => {
          if (res) {
            this.document_url = res['document_url'];
          }
        });
    }
  }
  /**
   * initializes the form for uploading the required documents
   */
  uploadDocumentsFormControler() {
    this.uploadDocumentsForm = this.formBuilder.group({
      document_type_based_field: ['', [Validators.required]],
      reupload_document: [''],
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
        this.formGetData = res;

        if (res['poa']) {
          this.formFieldPOA = res['poa'];
          this.showPOA = true;
          this.documentHeaderText = `Please complete the document details for POA`;
          for (let field in res['poa']) {
            this.uploadDocumentsForm.addControl(
              res['poa'][field]?.label,
              new FormControl('', Validators.required)
            );
          }
        }
        if (res['poi']) {
          this.formFieldPOI = res['poi'];
          this.showPOI = true;
          this.documentPOIText = `Please complete the document details for POI`;
          for (let field in res['poi']) {
            this.uploadDocumentsForm.addControl(
              res['poi'][field]?.label,
              new FormControl('', Validators.required)
            );
          }
        }
        if (res['other']) {
          if (
            this.isIndividualTrue &&
            this.fetchCkycParam['insurer_code'] === 'iffco'
          ) {
            this.formFieldOther = res?.other['photograph'];
            this.showOther = true;
            this.documentOtherText = `Please complete your other details`;
            for (let field in res?.other['photograph']) {
              this.uploadDocumentsForm.addControl(
                res?.other['photograph'][field]?.label,
                new FormControl('', Validators.required)
              );
            }
          }
        }
        if (res['poa'] && res['poi']) {
          this.isTwoObject = true;
        }
        const documentNumberBasedField = this.uploadDocumentsForm.get('poa_no');
        const panNumberValidation =
          this.uploadDocumentsForm.get('pan_number')?.value;
        const panNumberValidationField =
          this.uploadDocumentsForm.get('pan_number');
        const documentTypeValue = this.uploadDocumentsForm.get(
          'document_type_based_field'
        )?.value;
        if (documentTypeValue == 'pan_number') {
          this.documentMaxLength = 10;
          documentNumberBasedField?.setValidators([
            Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
          ]);
        } else if (panNumberValidation == '') {
          this.documentMaxLength = 10;
          panNumberValidationField?.setValidators([
            Validators.pattern(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
            Validators.required,
          ]);
        } else if (documentTypeValue == 'mobile_number') {
          this.documentMaxLength = 10;
          documentNumberBasedField?.setValidators([
            Validators.pattern('[0-9]{10}'),
          ]);
        } else if (documentTypeValue == 'aadhaar_number') {
          this.documentMaxLength = 12;
          documentNumberBasedField?.setValidators([
            Validators.pattern('[0-9]{12}'),
          ]);
        } else if (documentTypeValue == 'ckyc_number') {
          this.documentMaxLength = 14;
          documentNumberBasedField?.setValidators([
            Validators.pattern('[0-9]{14}'),
          ]);
        } else if (documentTypeValue == 'driving_license') {
          this.documentMaxLength = 15;
          documentNumberBasedField?.setValidators([
            Validators.pattern(/^[A-Za-z]{2}\d{13}$/),
          ]);
        } else if (documentTypeValue == 'voter_id') {
          this.documentMaxLength = 10;
          documentNumberBasedField?.setValidators([
            Validators.pattern(/^[A-Za-z][A-Za-z0-9]{8}[0-9]$/),
          ]);
        } else if (documentTypeValue == 'passport_number') {
          this.documentMaxLength = 8;
          documentNumberBasedField?.setValidators([
            Validators.pattern(/^[A-Za-z][A-Za-z0-9]{6}[0-9]$/),
          ]);
        } else if (documentTypeValue == 'gstin_number') {
          this.documentMaxLength = 15;
          documentNumberBasedField?.setValidators([
            Validators.required,
            Validators.pattern(
              /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/i
            ),
          ]);
        } else if (documentTypeValue == 'cin') {
          this.documentMaxLength = 21;
          documentNumberBasedField?.setValidators([
            Validators.pattern(/^[A-Za-z0-9]{21}$/),
          ]);
        } else {
          this.documentMaxLength = 30;
        }
      });
  }
  /**
   * This function is used to re-upload the document after the first upload is unsuccessful.
   */
  reUploadDone(data?: any) {
    this.cdr.detectChanges();
    this.isUploadDocment = false;
    if (data != 'close') {
      this.isReUploadDocument = false;
    }
    if (this.formGetData['poa']) {
      this.formFieldPOA = this.formGetData['poa'];
      this.showPOA = true;
      this.documentHeaderText = `Please complete the document details for POA`;
    }
    if (this.formGetData['poi']) {
      this.formFieldPOI = this.formGetData['poi'];
      this.showPOI = true;
      this.documentPOIText = `Please complete the document details for POI`;
    }
    if (this.formGetData['other']) {
      this.formFieldOther = this.formGetData['other']['photograph'];
      this.showOther = true;
      this.documentOtherText = `Please complete  your other details`;
    }
    if (this.formGetData['poa'] && this.formGetData['poi']) {
      this.isTwoObject = true;
    }
    setTimeout(() => {
      const element = document.getElementById('show-poi');
      element?.click();
    }, 0);
    setTimeout(() => {
      const element = document.getElementById('show-poi');
      element?.click();
    }, 0);
  }
}
