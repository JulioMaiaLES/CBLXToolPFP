import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[scrollTo]',
})
export class ScrollToDirective {
  @Input() scrollTo = '';
  @Input() scrollToRouter: string | undefined;

  constructor(private router: Router) {}

  @HostListener('click') onClick() {
    if (this.scrollToRouter && this.scrollToRouter !== this.router.url) {
      this.router.navigate([this.scrollToRouter]).then(() => {
        const element = document.querySelector('#' + this.scrollTo);
        setTimeout(() => {
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 650);
      });
      return;
    }

    const element = document.querySelector('#' + this.scrollTo);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
