import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NotificationCenterService} from '../../service/notification-center.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.sass']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {

  @Input()
  public open = false;
  private internalOpen: boolean;
  public loaded: boolean;
  public loading: boolean;
  public fadeIn: boolean;
  public notificationKeys = Object.keys;
  public notificationGroups: any = [];
  private notificationCenterSubscription: Subscription;

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

  constructor(private elementRef: ElementRef, private notificationCenterService: NotificationCenterService) {
  }

  ngOnInit() {
    this.notificationCenterSubscription = this.notificationCenterService.fetchNotifications('channel').subscribe((response) => {
      setTimeout(() => {
        this.notificationGroups = response;
        this.loaded = true;
        setTimeout(() => {
          this.fadeIn = true;
        },0);
        this.loading = false;
      },700);
    }, (error) => {
      console.log(JSON.stringify(error));
    });
    this.loading = true;
  }

  public selected() {
    this.open = false;
    this.closed.emit(false);
  }

  ngOnDestroy() {
    this.notificationCenterSubscription.unsubscribe();
  }
}
