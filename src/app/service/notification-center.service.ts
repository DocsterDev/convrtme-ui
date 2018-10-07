import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HeaderService} from './header.service';

@Injectable()
export class NotificationCenterService {

  constructor(private http: HttpClient,  private headerService: HeaderService) {
  }

  public pollNotifications() {
    return this.http.get(environment.apiUrl + '/api/subscriptions/poll', this.headerService.getTokenHeader());
  }

  public fetchNotifications(groupBy: string) {
    return this.http.get(environment.apiUrl + '/api/subscriptions/videos?groupBy=' + groupBy, this.headerService.getTokenHeader());
  }
}
