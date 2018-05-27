import 'rxjs/add/operator/do';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NotificationService} from '../notification/notification.service';
import {Injectable} from '@angular/core';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    // Add custom headers
    const newRequest = request.clone({
      headers: request.headers.set(
        'Authorization', 'BlahBlah'
      )
    });

    return next.handle(newRequest).do(
      success => {
        // On service response success
      },
      err => {

        switch (err.status) {
          case 0: {
            this.notificationService.showNotification('Yikes! It looks like youre not connected to the internet or our servers are down.');
            break;
          }
          default: {
            this.notificationService.showNotification(err.error.message);
            break;
          }
        }

      }
    );
  }


}
