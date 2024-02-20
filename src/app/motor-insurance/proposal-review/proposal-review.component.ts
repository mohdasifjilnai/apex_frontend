import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal-review',
  templateUrl: './proposal-review.component.html',
  styleUrls: ['./proposal-review.component.scss'],
})
export class ProposalReviewComponent implements OnInit {
  constructor(public router:Router) {}

  ngOnInit(): void {}
  back() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
}
