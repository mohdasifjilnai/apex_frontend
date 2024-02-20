import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

@Component({
  selector: 'app-proposal-review',
  templateUrl: './proposal-review.component.html',
  styleUrls: ['./proposal-review.component.scss'],
})
export class ProposalReviewComponent implements OnInit {
  constructor(private route :Router,private shareData:SharedDataService) {}

  ngOnInit(): void {}

  navigateToUrl(titleName:string){
    this.route.navigate(['/motor/quotes/proposal/']);
    this.shareData.sendProposalReviewEditId(titleName)
  }
  back() {
    this.route.navigate(['/motor/quotes/proposal']);
  }
}
