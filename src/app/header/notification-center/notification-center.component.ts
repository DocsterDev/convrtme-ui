import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.sass']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {

  @Input()
  public open = false;

  private internalOpen: boolean;

  @Output()
  public closed: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:click', ['$event'])
  handleClick(event) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        if(this.internalOpen === true){
          this.open = false;
          this.closed.emit(false);
        }
      }
      this.internalOpen = this.open;
  }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
