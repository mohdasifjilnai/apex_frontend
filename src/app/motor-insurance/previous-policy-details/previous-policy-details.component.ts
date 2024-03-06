import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-previous-policy-details',
  templateUrl: './previous-policy-details.component.html',
  styleUrls: ['./previous-policy-details.component.scss'],
})
export class PreviousPolicyDetailsComponent implements OnInit {
  optReasonList: any;
  transactionId: any;
  proposalData: any;
  @Input() fetchVehicleDetails: any;
  @Output() afterPreviousVehicleDetilsData = new EventEmitter<any>();

  previousPolicyDetailsForm: FormGroup = new FormGroup({
    prev_policy_number: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]+$/),
    ]),
    previous_insurer: new FormControl('', Validators.required),
    policy_expiry_date: new FormControl('', Validators.required),
  });

  constructor(private router: Router, private sharedData: SharedDataService) {
    this.optReasonList = [
      {
        id: 1,
        optReasonName: '',
      },
    ];
  }

  ngOnInit(): void {
    this.transactionId = sessionStorage.getItem('transaction_id');
    this.sharedData.getProposalDetails.subscribe((proposal) => {
      this.proposalData = proposal;
      if (this.proposalData.previous_policy_details !== null) {
        this.navigateToProposalReview();
      }
    });
  }

  /**
   * Navigate to the Proposal Review page
   * Using Angular router to navigate to the specified route
   */
  navigateToProposalReview() {
    this.router.navigate([
      `/motor/quotes/proposal/${this.transactionId}/review`,
    ]);
  }

  getPreviousVehicleData(isValid: any) {
    if (isValid) {
      const formValues = this.previousPolicyDetailsForm.value;
      this.afterPreviousVehicleDetilsData.emit(formValues);
      this.sharedData.createProposalId(
        'previous_policy_details',
        this.previousPolicyDetailsForm
      );
    }
  }
}
