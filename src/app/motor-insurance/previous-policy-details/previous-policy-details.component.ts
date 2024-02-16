import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-previous-policy-details',
  templateUrl: './previous-policy-details.component.html',
  styleUrls: ['./previous-policy-details.component.scss'],
})
export class PreviousPolicyDetailsComponent implements OnInit {
  optReasonList: any;
  @Input()fetchVehicleDetails:any

  previousPolicyDetailsForm: FormGroup = new FormGroup({
    prev_policy_number: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    opt_out_reason: new FormControl('', Validators.required),
    cpa_insurance_company: new FormControl('', Validators.required),
    cpa_policy_start_date: new FormControl('', Validators.required),
    cpa_policy_end_date: new FormControl('', Validators.required),
    cpa_policy_number: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    cpa_sum_insured: new FormControl('', Validators.required),
    previous_insurer: new FormControl('', Validators.required),
  });

  constructor(private router :Router) {
    this.optReasonList = [
      {
        id: 1,
        optReasonName: '',
      },
    ];
  }

  ngOnInit(): void {
  }

  /**
   * Navigate to the Proposal Review page
   * Using Angular router to navigate to the specified route
   */
  navigateToProposalReview(){
    this.router.navigate(['/motor/quotes/proposal/review']);
  }
}
