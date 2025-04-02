import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  mobileApp: any;
  constructor(    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.mobileApp = params['mobileApp'];
    });
  }

  ngOnInit(): void {}
  // refreshPage(){
  //   window.location.reload();
  // }
  isRefreshing: boolean = false;
  startY: number =0;
  threshold: number = 300; // Adjust as needed
  
  onTouchStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    const deltaY = event.changedTouches[0].clientY - this.startY;
    if (deltaY >= this.threshold) {
      this.refresh();
    }
  }

  refresh() {
    this.isRefreshing = true;
    setTimeout(() => {
      window.location.reload();
      this.isRefreshing = false;
    }, 2000); 
  }
}
