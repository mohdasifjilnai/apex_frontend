import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quotes-listing',
  templateUrl: './quotes-listing.component.html',
  styleUrls: ['./quotes-listing.component.scss'],
})
export class QuotesListingComponent implements OnInit {
  constructor(private router : Router) {}

  ngOnInit(): void {}

  getProposalDetails() {
    this.router.navigate(['/motor/quotes/proposal']);
  }
  
}
