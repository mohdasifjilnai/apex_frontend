import { Component, OnInit } from '@angular/core';
import { ApiConstants } from 'src/app/api.constant';

@Component({
  selector: 'app-ckyc-documents',
  templateUrl: './ckyc-documents.component.html',
  styleUrls: ['./ckyc-documents.component.scss'],
})
export class CkycDocumentsComponent implements OnInit {
  fileName: any = 'Upload Document';
  showPOI: boolean=false;
  showDocumentSelect: boolean=true;
  fileURL: any;
  showPOA: boolean=false;
  showCkyc: boolean=false;

  constructor() {}

  ngOnInit(): void {}
  /**
Event handler for when a file is selected.
@param event - The file selection event.
 */
  onFileSelected(event: any): void {
    const selectedFile: File = event.target.files[0];
    this.fileName =
      selectedFile.name.length > 20
        ? selectedFile.name.substring(0, 20) + '...'
        : selectedFile.name;
    let formData: FormData = new FormData();
    formData.append('file', selectedFile, selectedFile.name);
    const reader = new FileReader();
  reader.onload = (e: any) => {
    this.fileURL = e.target.result;
  };
  reader.readAsDataURL(selectedFile);
  }
  submitDocuments(){
      this.showPOI=true
      this.showDocumentSelect=false
  }
  submitPOI(){
    this.showPOI=false
    this.showPOA=true
  }
  submitPOA(){
    this.showPOA=false
    this.showCkyc=true
  }
}
