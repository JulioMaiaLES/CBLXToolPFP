import { Directive, ElementRef } from '@angular/core';
import mediumZoom from 'medium-zoom';

@Directive({
  selector: '[zoomable]',
})
export class ZoomableDirective {
  constructor(private el: ElementRef) {
    mediumZoom(this.el.nativeElement);
  }
}
