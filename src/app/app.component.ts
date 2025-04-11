import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { SseService } from './core/services/sse.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
declare const webengage: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'apex_frontend';
  connectionData: any;
  eventSource: any;
  isLoading: boolean = false;

  constructor(
    private sseService: SseService,
    private loaderService: LoaderService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (environment?.dev) {
      // webengage.init('in~~10a5cbbcb');
      // if (
      //   webengage.util.getWebengageCookie().cuid == undefined &&
      //   sessionStorage.getItem('partner_code')
      // ) {
      //   webengage.user.login(sessionStorage.getItem('partner_code'));
      // }
    } else {
      // webengage.init('');
    }

    this.loaderService.isLoading().subscribe((isLoading: any) => {
      this.isLoading = isLoading;
      if (!isLoading) {
        return;
      }
    });
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    let hostParts = url.pathname.split('/');
    if (hostParts[5] != 'review') {
      if (sessionStorage.getItem('proposal_punched')) {
        this.router.navigate(['']);
      }
    }
    if (environment.production) {
      this.addGtmToHead();
      this.addGtmNoScriptToBody();
      // this.loadScript(
      //   'https://www.googletagmanager.com/gtag/js?id=G-CTWKWSPJQ1',
      //   true
      // )
      //   .then(() => {
      //     this.addGtagConfig();
      //     this.checkScriptPresence(
      //       'https://www.googletagmanager.com/gtag/js?id=G-CTWKWSPJQ1'
      //     );
      //   })
      //   .catch((error) => {
      //     console.error('Error loading the script:', error);
      //   });
    }
  }
  ngAfterViewInit() {
    // this.loadWebEngage();
  }

  // loadWebEngage() {
  //   if (document.getElementById('_webengage_script_tag')) {
  //     console.log('⚠️ WebEngage script already exists, skipping...');
  //     return;
  //   }

  //   console.log('🚀 Injecting WebEngage script...');
  //   const script = document.createElement('script');
  //   script.id = '_webengage_script_tag';
  //   script.type = 'text/javascript';
  //   script.async = true;
  //   script.src = 'https://widgets.in.webengage.com/js/webengage-min-v-6.0.js';

  //   script.onload = () => {
  //     // console.log('✅ WebEngage script loaded successfully.');

  //     setTimeout(() => {
  //       const checkWebEngageReady = setInterval(() => {
  //         if (
  //           typeof window['webengage'] !== 'undefined' &&
  //           window['webengage'].onReady
  //         ) {
  //           clearInterval(checkWebEngageReady); // Stop checking once ready
  //           window['webengage'].onReady(() => {
  //             window['webengage'].init('in~~10a5cbbcb');
  //             console.log('🎉 WebEngage initialized successfully!');
  //           });
  //         } else {
  //           console.log('🔄 Waiting for WebEngage to load...');
  //         }
  //       }, 500);
  //     }, 2000); // Initial delay of 2s before polling
  //   };

  //   script.onerror = () => {
  //     console.error('❌ Failed to load WebEngage script.');
  //   };

  //   document.head.appendChild(script);
  // }

  loadScript(url: string, isAsync: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      if (isAsync) {
        script.async = true;
      }
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`));
      };
      document.head.appendChild(script);
    });
  }

  addGtagConfig(): void {
    const script = document.createElement('script');
    script.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-CTWKWSPJQ1');
    `;
    document.head.appendChild(script);
  }

  private checkScriptPresence(src: string): void {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const scriptExists = scripts.some((script) => script.src.includes(src));
  }

  addGtmToHead() {
    const gtmScript = this.renderer.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MGJ88B');
    `;
    this.renderer.appendChild(document.head, gtmScript);
  }
  // Add the Google Tag Manager noscript part to <body>
  addGtmNoScriptToBody() {
    const noscript = this.renderer.createElement('noscript');
    const iframe = this.renderer.createElement('iframe');
    this.renderer.setAttribute(
      iframe,
      'src',
      'https://www.googletagmanager.com/ns.html?id=GTM-MGJ88B'
    );
    this.renderer.setAttribute(iframe, 'height', '0');
    this.renderer.setAttribute(iframe, 'width', '0');
    this.renderer.setStyle(iframe, 'display', 'none');
    this.renderer.setStyle(iframe, 'visibility', 'hidden');
    this.renderer.appendChild(noscript, iframe);
    this.renderer.appendChild(document.body, noscript);
  }
}
