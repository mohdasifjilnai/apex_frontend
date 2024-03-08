import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  paymentSuccess: boolean = true;
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe((params) => {
      if (params[4]['path'] == 'payment-success') {
        this.paymentSuccess = true;
      } else {
        this.paymentSuccess = false;
      }
    });
  }
}
