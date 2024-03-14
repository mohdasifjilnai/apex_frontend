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
  @Input('required') isRequired = false;
  fileName: any = 'Upload Document';
  constructor(private ctrlContainer: FormGroupDirective) {}

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

  onFileSelected(event: any): void {
    const selectedFile: File = event.target.files[0];
    this.fileName = selectedFile.name;
  }
}
