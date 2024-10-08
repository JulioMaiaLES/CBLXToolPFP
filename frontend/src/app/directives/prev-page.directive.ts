import { Location } from '@angular/common';
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[prevPage]',
})
export class PrevPageDirective {
  constructor(private location: Location) {}

  @HostListener('click', ['$event']) goBack(evt: Event) {
    evt.stopPropagation();
    this.location.back();
  }
}
