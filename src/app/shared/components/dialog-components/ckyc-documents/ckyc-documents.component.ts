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
    this.fileControlName = fileFormControlName;
    const fileType = selectedFile.type;
    let doc_type;
    this.docTypeData = '';
    this.fileName =
      selectedFile.name.length > 20
        ? selectedFile.name.substring(0, 20) + '...'
        : selectedFile.name;
    if (fileFormControlName == 'poa_doc_url') {
      doc_type = 'poa';
      this.docTypeData = 'poa';
      if (
        !(
          fileType === 'image/jpeg' ||
          fileType === 'image/png' ||
          fileType === 'application/pdf'
        )
      ) {
        this.POAFileName = '';
        this.fileInputError = false;
        this.isfileInputError = true;
      } else {
        this.POAFileName = this.fileName;
        this.fileInputError = false;
        this.isfileInputError = false;
      }
    }
    if (fileFormControlName == 'poa_doc_url_1') {
      doc_type = 'poa';
      this.docTypeData = 'poa';
      if (
        !(
          fileType === 'image/jpeg' ||
          fileType === 'image/png' ||
          fileType === 'application/pdf'
        )
      ) {
        this.POAFileName1 = '';
        this.fileInputError1 = false;
        this.isfileInputError1 = true;
      } else {
        this.POAFileName1 = this.fileName;
        this.fileInputError1 = false;
        this.isfileInputError1 = false;
      }
    }
    if (fileFormControlName == 'doc_url') {
      doc_type = 'other';
      this.docTypeData = 'other';
      if (
        !(
          fileType === 'image/jpeg' ||
          fileType === 'image/png' ||
          fileType === 'application/pdf'
        )
      ) {
        this.OtherFileName = '';
        this.fileInputError1 = false;
        this.isfileInputError1 = true;
      } else {
        this.OtherFileName = this.fileName;
        this.fileInputError1 = false;
        this.isfileInputError1 = false;
      }
    }

    if (fileFormControlName == 'poi_doc_url') {
      doc_type = 'poi';
      this.docTypeData = 'poi';
      if (
        !(
          fileType === 'image/jpeg' ||
          fileType === 'image/png' ||
          fileType === 'application/pdf'
        )
      ) {
        this.POIFileName = '';
        this.PoiFileInputError = false;
        this.isPoiFileInputError = true;
      } else {
        this.POIFileName = this.fileName;
        this.PoiFileInputError = false;
        this.isPoiFileInputError = false;
      }
    }
    let formData: FormData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    this.apiService
      .postRequestedResponse(
        `${ApiConstants['upload_document']}?transaction_id=${this.transactionId}&proposal_id=${this.proposalId}&document_type=${doc_type}`,
        formData
      )
      ?.subscribe(
        (res) => {
          if (res['status']) {
            if (isReupload) {
              this.isReUploadDocument = true;
              this.checkUploadDocment(res['document_url']);
            }
            if (this.docTypeData == 'poi') {
              this.documentURlPOI = res['document_url'];
            } else if (this.docTypeData == 'poa') {
              this.documentURlPOA = res['document_url'];
            } else if (this.docTypeData == 'other') {
              this.documentURlOther = res['document_url'];
            }

            this.uploadDocumentsForm
              .get(fileFormControlName)
              ?.setValue(res['document_url']);
          } else {
            this.apiService.errorHandler(res);
          }
        },
        (error) => {
          if (fileFormControlName == 'poa_doc_url') {
            this.POAFileName = '';
            this.fileInputError = false;
            this.isfileInputError = true;
          } else if (fileFormControlName == 'poi_doc_url') {
            this.POIFileName = '';
            this.PoiFileInputError = false;
            this.isPoiFileInputError = true;
          } else if (fileFormControlName == 'poa_doc_url_1') {
            this.POAFileName1 = '';
            this.fileInputError = false;
            this.isfileInputError = true;
          }
        }
      );
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
        `${ApiConstants.document_type}?insurer_code=${
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
            ? this.uploadDocumentsForm.get('poi_type')?.value
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
  checkUploadDocment(url: string) {
    this.isUploadDocment = true;
    this.showPOA = false;
    this.showPOI = false;
    this.document_url = '';
    this.showOther=false;
    this.isTwoObject=false
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
          for (let field in this.formFieldPOA) {
            this.uploadDocumentsForm.addControl(
              this.formFieldPOA[field]?.label,
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
              this.formFieldPOI[field]?.label,
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
            for (let field in this.formFieldOther) {
              this.uploadDocumentsForm.addControl(
                this.formFieldOther[field]?.label,
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
        }else if (documentTypeValue == 'gstin_number') {
          this.documentMaxLength = 15;
          documentNumberBasedField?.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
          ]);
        }
         else if (documentTypeValue == 'cin') {
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
