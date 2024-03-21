import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
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

  fileName: any = 'Upload Document';
  constructor(private ctrlContainer: FormGroupDirective) {
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
   * Event handler for when a file is selected.
   * @param event - the file selection event
   */
  onFileSelected(event: Event) {
    // TODO: implement file upload
  }
}
