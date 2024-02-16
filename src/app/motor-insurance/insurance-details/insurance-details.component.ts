import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { WindowRef } from 'src/app/core/services/window-ref.service';
import { ShareQuotesComponent } from 'src/app/shared/components/dialog-components/share-quotes/share-quotes.component';
import { ProposalShareComponent } from 'src/app/shared/components/proposal-share/proposal-share.component';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.scss'],
})
export class InsuranceDetailsComponent implements OnInit {
  insuranceDetailsJSON: {
    modalName: any;
    widthObtained: string;
    heightObtained: string;
    topObtained: string;
    isOutSideClose: boolean;
    classObtained: string;
  } = {
    modalName: ProposalShareComponent,
    widthObtained: '100%',
    heightObtained: '77%',
    topObtained: 'auto',
    isOutSideClose: true,
    classObtained: 'insurance-details-class',
  };

  constructor(
    public matDialog: WindowRef,
    public bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openShareModal() {
    this.bottomSheet.open(ProposalShareComponent);
  }
}
