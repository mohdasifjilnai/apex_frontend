import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSuccess: boolean = true;
  constructor(private route: ActivatedRoute, private router: Router) {}
  policyNumber: any;
  proposalNumber: any;
  ngOnInit(): void {
    this.route.url.subscribe((params) => {
      if (params[4]['path'] == 'payment-success') {
        this.paymentSuccess = true;
      } else {
        this.paymentSuccess = false;
      }
    });
    this.route.queryParamMap.subscribe((params) => {
      const policyNo = params?.get('policy_no');
      const proposalNo = params?.get('proposal_no');
      if (policyNo) {
        this.policyNumber = policyNo;
      }
      if (proposalNo) {
        this.proposalNumber = proposalNo;
      }
    });
  }

  /**
   * redirection form payment page to home page
   */
  goTohome() {
    this.router.navigate(['/motor']);
  }
}
