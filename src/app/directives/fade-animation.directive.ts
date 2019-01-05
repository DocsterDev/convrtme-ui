import {Directive, ElementRef, Input} from '@angular/core';
import {animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style} from '@angular/animations';

@Directive({
  selector: '[appFadeAnimation]'
})
export class FadeAnimationDirective {
  player: AnimationPlayer;

  constructor(private builder: AnimationBuilder, private el: ElementRef) {
  }

  @Input()
  set show(show: boolean) {
    if (this.player) {
      this.player.destroy();
    }

    const metadata = show ? this.fadeIn() : this.fadeOut();

    const factory = this.builder.build(metadata);
    const player = factory.create(this.el.nativeElement);

    player.play();
  }

  private fadeIn(): AnimationMetadata[] {
    return [
      style({opacity: 0}),
      animate('400ms ease', style({opacity: 1})),
    ];
  }

  private fadeOut(): AnimationMetadata[] {
    return [
      style({opacity: '*'}),
      animate('400ms ease', style({opacity: 0})),
    ];
  }

}
