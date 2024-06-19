import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { SseService } from './core/services/sse.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'apex_frontend';
  connectionData: any;
  eventSource: any;
  isLoading: boolean = false;

  constructor(
    private sseService: SseService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading().subscribe((isLoading: any) => {
      this.isLoading = isLoading;
      if (!isLoading) {
        return;
      }
    });
    // if (environment.production) {
    //   this.loadScript(
    //     'https://www.googletagmanager.com/gtag/js?id=G-CTWKWSPJQ1',
    //     true
    //   )
    //     .then(() => {
    //       this.addGtagConfig();
    //       this.checkScriptPresence(
    //         'https://www.googletagmanager.com/gtag/js?id=G-CTWKWSPJQ1'
    //       );
    //     })
    //     .catch((error) => {
    //       console.error('Error loading the script:', error);
    //     });
    // }
  }

  // loadScript(url: string, isAsync: boolean = false): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     const script = document.createElement('script');
  //     script.src = url;
  //     if (isAsync) {
  //       script.async = true;
  //     }
  //     script.onload = () => {
  //       resolve();
  //     };
  //     script.onerror = () => {
  //       reject(new Error(`Failed to load script: ${url}`));
  //     };
  //     document.head.appendChild(script);
  //   });
  // }

  // addGtagConfig(): void {
  //   const script = document.createElement('script');
  //   script.innerHTML = `
  //     window.dataLayer = window.dataLayer || [];
  //     function gtag(){dataLayer.push(arguments);}
  //     gtag('js', new Date());
  //     gtag('config', 'G-CTWKWSPJQ1');
  //   `;
  //   document.head.appendChild(script);
  // }

  // private checkScriptPresence(src: string): void {
  //   const scripts = Array.from(document.getElementsByTagName('script'));
  //   const scriptExists = scripts.some((script) => script.src.includes(src));
  // }
}
