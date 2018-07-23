import 'rxjs/add/operator/do';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {NotificationService} from '../../components/notification/notification.service';
import {Injectable} from '@angular/core';
import {LocalStorageService} from "ngx-webstorage";

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  private retryCount = 0;

  constructor(private notificationService: NotificationService, private localStorage: LocalStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const token = this.localStorage.retrieve('token');

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

    return this.executeServiceCall(newRequest, next);

  }

  private executeServiceCall(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).do(
      success => {
        if (this.retryCount > 0) {
          console.log('Service call success after ' + this.retryCount + ' retries');
          this.retryCount = 0;
        }
        // On service response success
      },
      err => {

        switch (err.status) {
          case 0: {
            if (this.retryCount < 3) {
              this.retryCount = this.retryCount = 1;
              console.error('Service call failed. Retry ' + this.retryCount + '...');
              setTimeout(() => {
                this.executeServiceCall(request, next);
              },50);
              break;
            }
            this.notificationService.showNotification({type: 'error', message: 'Yikes! It looks like you&apos;re not connected to the internet or our servers are down.'})
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
