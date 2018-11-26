import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {EventBusService} from "./service/event-bus.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

  private isMobile: boolean;
  private scrollTimeout: any;
  private isScrolling: boolean;

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    const isMobile = window.innerWidth < 768;
    if (isMobile !== this.isMobile) {
      this.isMobile = isMobile;
      this.eventBusService.triggerDeviceListener(this.isMobile);
    }
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      if (this.isScrolling) {
        this.isScrolling = false;
        this.eventBusService.triggerScrollEvent(this.isScrolling);
      }
    }, 350);
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.eventBusService.triggerScrollEvent(this.isScrolling);
    }
  }

  constructor(private eventBusService: EventBusService) {
  }

  ngOnInit() {

  }



  ngOnDestroy() {

  }

}
