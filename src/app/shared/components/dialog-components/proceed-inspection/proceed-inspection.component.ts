import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-proceed-inspection',
  templateUrl: './proceed-inspection.component.html',
  styleUrls: ['./proceed-inspection.component.scss'],
})
export class ProceedInspectionComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProceedInspectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
