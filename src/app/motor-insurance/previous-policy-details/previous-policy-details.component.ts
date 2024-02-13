import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-previous-policy-details',
  templateUrl: './previous-policy-details.component.html',
  styleUrls: ['./previous-policy-details.component.scss'],
})
export class PreviousPolicyDetailsComponent implements OnInit {
  optReasonList: any;

  previousPolicyDetailsForm: FormGroup = new FormGroup({
    prev_policy_number: new FormControl('', Validators.required),
    opt_out_reason: new FormControl('', Validators.required),
    cpa_insurance_company: new FormControl('', Validators.required),
    cpa_policy_start_date: new FormControl('', Validators.required),
    cpa_policy_end_date: new FormControl('', Validators.required),
    cpa_policy_number: new FormControl('', Validators.required),
    cpa_sum_insured: new FormControl('', Validators.required),
    previous_insurer: new FormControl('', Validators.required),
  });

  constructor() {
    this.optReasonList = [
      {
        id: 1,
        optReasonName: '',
      },
    ];
  }

  ngOnInit(): void {}
}
