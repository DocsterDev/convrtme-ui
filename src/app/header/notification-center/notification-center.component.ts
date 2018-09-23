import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.sass']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {

  @Input()
  public open = false;

  @Output()
  public closed: EventEmitter<any> = new EventEmitter();

  @Output()
  public opened: EventEmitter<any> = new EventEmitter();

  @HostListener('document:click', ['$event'])
  handleClick(event) {
      if (this.elementRef.nativeElement.contains(event.target)) {
        console.log('Clicked Inside');
      } else {
        
        console.log('Clicked Outside');
        this.open = false;
        this.closed.emit(null);
      }
  }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }



  ngOnDestroy() {

  }

}
