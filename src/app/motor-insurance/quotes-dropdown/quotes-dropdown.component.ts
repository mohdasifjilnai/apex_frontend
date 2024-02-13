import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-quotes-dropdown',
  templateUrl: './quotes-dropdown.component.html',
  styleUrls: ['./quotes-dropdown.component.scss']
})
export class QuotesDropdownComponent implements OnInit {
  proposalList: any;

  constructor(public bottomSheetRef: MatBottomSheetRef<QuotesDropdownComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private apiService: ApiService,) { }

  ngOnInit(): void {
    this.getProposalType()
  }
  cancelChangeIDv(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
  getProposalType() {
    this.apiService
      .getRequestedResponse(`${ApiConstants.proposal_type}`)
      .subscribe((res: any) => {
        if (res) {
          this.proposalList = res;
        }
      });
  }
}
