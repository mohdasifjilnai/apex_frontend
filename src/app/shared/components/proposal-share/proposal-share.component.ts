import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-proposal-share',
  templateUrl: './proposal-share.component.html',
  styleUrls: ['./proposal-share.component.scss']
})
export class ProposalShareComponent implements OnInit {
  isCommunicationGroup: boolean = true;
  isCommunicationField: boolean = false;
  isActiveIcon: any;
  inputPlaceholder: any;

  constructor(public dialogRef: MatDialogRef<ProposalShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {}
    /**
     * this fucntion use for close pop up
     */
    onClose(): void {
      this.dialogRef.close();
    }
    /**
     * this fucntion use for share inspection
     */
    share() {
      this.isCommunicationGroup = false;
    }
    /**
     * this fucntion use for share inspection by social media
     */
    communication(event: any) {
      this.isActiveIcon=event
      if(event=='whatsapp'){
        this.inputPlaceholder = "Enter Whatsapp Number";
        this.isCommunicationField = true;
      }
      if(event=='sms'){
        this.inputPlaceholder = "Enter Mobile Number";
        this.isCommunicationField = true;
      }
      if(event=='mail'){
        this.inputPlaceholder = "Enter Email Id";
        this.isCommunicationField = true;
      }
      
    }

}
