import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-proposal-expired',
  templateUrl: './proposal-expired.component.html',
  styleUrls: ['./proposal-expired.component.scss'],
})
export class ProposalExpiredComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProposalExpiredComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  /**
   * this fucntion use for close pop up
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
