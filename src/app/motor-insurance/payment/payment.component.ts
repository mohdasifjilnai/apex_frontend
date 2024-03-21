import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from 'src/app/api.constant';
import { ApiService } from 'src/app/core/services/api.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSuccess: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}
  policyNumber: any;
  proposalNumber: any;
  transactionId: any;
  ngOnInit(): void {
    this.route.url.subscribe((params) => {
      if (params[4]['path'] == 'payment-success') {
        this.paymentSuccess = true;
      } else {
        this.paymentSuccess = false;
      }

      this.transactionId = params[2]['path'];
    });
    this.route.queryParamMap.subscribe((params) => {
      const policyNo = params?.get('policy_no');
      const proposalNo = params?.get('proposal_no');
      if (policyNo) {
        this.policyNumber = policyNo;
        this.downloadPolicy();
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

  downloadPolicy() {
    this.apiService
      .getRequestedResponse(
        `${ApiConstants?.downloadPolicy}?transaction_id=${this.transactionId}`
      )
      .subscribe((res: any) => {
        window.open(res?.document_url);
      });
  }
}
