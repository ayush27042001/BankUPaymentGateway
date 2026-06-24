import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[horizontalTableScroll]',
  standalone: true
})
export class HorizontalTableScrollDirective implements OnInit, OnDestroy {
  private handler: (event: WheelEvent) => void;

  constructor(private el: ElementRef<HTMLElement>) {
    this.handler = (event: WheelEvent) => {
      const element = this.el.nativeElement;
      if (element.scrollWidth > element.clientWidth) {
        element.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };
  }

  ngOnInit() {
    this.el.nativeElement.addEventListener('wheel', this.handler, { passive: false });
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('wheel', this.handler);
  }
}
