// import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
//
// @Directive({
//   selector: '[appLoader]'
// })
// export class LoaderDirective implements OnInit {
//
//   @Input('appLoader')
//   public showLoader = false;
//
//   constructor (private elRef: ElementRef, private renderer: Renderer2) {
//
//   }
//
//   ngOnInit() {
//     //this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue');
//
//     this.renderer.setStyle(this.elRef.nativeElement.firstChildElement, 'visibility', 'visible');
//
//   }
//
// }
