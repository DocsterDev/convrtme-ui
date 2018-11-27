import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NotificationCenterService} from '../../service/notification-center.service';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';
import {AudioPlayerService} from '../../global/components/audio-player/audio-player.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.sass']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {

  @Input()
  public open: boolean;
  private internalOpen: boolean;
  public loaded: boolean;
  public loading: boolean;
  public fadeIn: boolean;
  public notificationKeys = Object.keys;
  public notificationGroups: any = {};
  public subscriptions: any = [];
  private notificationCenterSubscription: Subscription;

  @Output()
  public closed: EventEmitter<boolean> = new EventEmitter();

  public showManageSubs: boolean;
  public sortType: string;

  @HostListener('document:click', ['$event'])
  handleClick(event) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        if(this.internalOpen === true) {
          this.open = false;
          this.closed.emit(false);
        }
      }
      this.internalOpen = this.open;
  }

  constructor(private elementRef: ElementRef, private notificationCenterService: NotificationCenterService, private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.showSubscriptions('channel');
  }

  public showSubscriptions(groupBy) {
    this.loaded = false;
    setTimeout(()=>{
      this.showManageSubs = false;
    });
    this.notificationCenterSubscription = this.notificationCenterService.fetchNotifications(groupBy).subscribe((response) => {
      setTimeout(() => {
        this.notificationGroups = response;
        this.loaded = true;
        this.sortType = groupBy;
        setTimeout(() => {
          this.fadeIn = true;
        }, 0);
        this.loading = false;
      }, 300);
    }, (error) => {
      console.error(error);
    });
    this.loading = true;
    this.loaded = false;
    this.fadeIn = false;
  }

  public selected(video) {
    // this.open = false;
    // this.closed.emit(false);
    console.log('LENGTH::: ' + JSON.stringify(video));

    //this.audioPlayerService.triggerVideoEvent(video);
  }

  public showSubscriptionManager() {
    setTimeout(()=>{
      this.showManageSubs = true;
    });
    this.notificationCenterSubscription = this.notificationCenterService.getSubscriptions().subscribe((resp) => {
      this.subscriptions = resp;
      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
        setTimeout(() => {
          this.fadeIn = true;
        }, 0);
      }, 300);
    }, (error) => {
      console.error(error);
    });
    this.loading = true;
    this.loaded = false;
    this.fadeIn = false;
  }

  public removeSubscription(subscription) {
    const originalSubscriptions = JSON.parse(JSON.stringify(this.subscriptions));
    this.subscriptions.filter(sub => sub.uuid !== subscription.uuid);
    this.notificationCenterSubscription = this.notificationCenterService.removeSubscription(subscription.uuid).subscribe((resp) => {
      this.showSubscriptionManager();
    }, (error) => {
      this.subscriptions = originalSubscriptions;
      console.error(error);
    });
  }

  // public formatDate(date) {
  //   if (date) {
  //     return moment(date).local().format('MM/DD/YYYY');
  //   }
  //   return '';
  // }

  ngOnDestroy() {
    this.notificationCenterSubscription.unsubscribe();
  }
}
