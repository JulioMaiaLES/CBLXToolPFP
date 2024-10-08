import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[stopPropag]',
})
export class StopPropagDirective {
  @HostListener('click', ['$event'])
  onClick(e: Event): void {
    e.stopPropagation();
  }
}
