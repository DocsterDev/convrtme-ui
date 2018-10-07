import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class NotificationCenterService {

  constructor(private http: HttpClient) {
  }

  public pollNotifications() {
    return this.http.get(environment.apiUrl + '/api/subscriptions/poll');
  }

  public fetchNotifications(groupBy: string) {
    return this.http.get(environment.apiUrl + '/api/subscriptions/videos?groupBy=' + groupBy);
  }
}
