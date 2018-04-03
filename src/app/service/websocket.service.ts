import {Injectable, OnDestroy} from '@angular/core';

import {StompService} from 'ng2-stomp-service';

@Injectable()
export class WebsocketService implements OnDestroy {

  private subscription: any;

  constructor(private stomp: StompService) {

    // configuration
    stomp.configure({
      host: 'http://localhost:8080/websocket-example',
      debug: false,
      queue: {'init': false}
    });

    // start connection
    stomp.startConnect().then(() => {
      stomp.done('init');
      console.log('connected');

      // subscribe
      this.subscription = stomp.subscribe('/topic/user', this.response);

      // send data
      stomp.send('/app/user', {'name': 'Brosef'});

    });

  }


  ngOnDestroy(): void {

    // unsubscribe
    this.subscription.unsubscribe();

    // disconnect
    this.stomp.disconnect().then(() => {
      console.log('Connection closed');
    });

  }

// response
  public response = (data) => {
    console.log(data);
  };

}
