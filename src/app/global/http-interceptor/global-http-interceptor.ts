import 'rxjs/add/operator/do';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NotificationService} from '../notification/notification.service';
import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService, private localStorage: LocalStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    console.log('REQUEST = ' + JSON.stringify(request));

    const token = this.localStorage.retrieve('token');

    console.log('Token value: ' + token);

    // Add custom headers
    let newRequest;

    if (token != null) {
      newRequest = request.clone({
        headers: request.headers.set(
          'token', token
        )
      });
    } else {
      newRequest = request;
    }

    return next.handle(newRequest).do(
      success => {
        // On service response success
      },
      err => {

        switch (err.status) {
          case 0: {
            this.notificationService.showNotification({type: 'error', message: 'Yikes! It looks like youre not connected to the internet or our servers are down.'});
            console.error(err);
            break;
          }
          default: {
            this.notificationService.showNotification({type: 'error', message: err.error.message});
            console.error(err);
            break;
          }
        }

      }
    );
  }


}
