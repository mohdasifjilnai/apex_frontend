import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { ApiConstants } from 'src/app/api.constant';
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class UploadDocumentComponent implements OnInit {
  formFileUpload!: FormGroup;
  transactionId: any;
  proposalId: any;
  @Input('required') isRequired = false;
  @Output() isUploadDocument = new EventEmitter<boolean>();

  fileName: any = 'Upload Document';
  constructor(
    private ctrlContainer: FormGroupDirective,
    private apiService: ApiService
  ) {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.proposalId = sessionStorage.getItem('proposal_Id');
  }

  ngOnInit(): void {
    this.formFileUpload = this.ctrlContainer.form;
    if (this.isRequired) {
      this.formFileUpload.addControl(
        'file',
        new FormControl(null, Validators.required)
      );
    } else {
      this.formFileUpload.addControl('file', new FormControl());
    }
  }
  /**
Event handler for when a file is selected.
@param event - The file selection event.
 */
  onFileSelected(event: any): void {
    const selectedFile: File = event.target.files[0];
    this.fileName = selectedFile.name;
    let formData: FormData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    this.apiService
      .postRequestedResponse(
        `${ApiConstants['upload_document']}?transaction_id=${this.transactionId}&proposal_id=${this.proposalId}`,
        formData
      )
      ?.subscribe((res) => {
        this.isUploadDocument.emit(true);
        this.formFileUpload.patchValue({
          file: res['document_url'],
        });
      });
  }
}
