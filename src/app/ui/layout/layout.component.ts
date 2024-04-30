import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  // refreshPage(){
  //   window.location.reload();
  // }
  isRefreshing: boolean = false;
  startY: number =0;
  threshold: number = 100; // Adjust as needed
  
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
    }, 1000); 
  }
}
