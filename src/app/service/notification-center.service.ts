import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {HeaderService} from './header.service';

@Injectable()
export class NotificationCenterService {

  constructor(private http: HttpClient,  private headerService: HeaderService) {
  }

  public pollNotifications() {
    if (this.headerService.getToken()) {
      return this.http.get(environment.apiUrl + '/api/subscriptions/poll', this.headerService.getTokenHeader());
    }
    return;
  }

  public fetchNotifications(groupBy: string) {
    return this.http.get(environment.apiUrl + '/api/subscriptions/videos?groupBy=' + groupBy, this.headerService.getTokenHeader());
  }

  public addSubscription(channel: string, avatarUrl: string, channelId: string) {
    return this.http.post(environment.apiUrl + '/api/subscriptions', {name: channel, avatarUrl: avatarUrl, channelId: channelId}, this.headerService.getTokenHeader());
  }

  public removeSubscription(uuid: string) {
    return this.http.delete(environment.apiUrl + '/api/subscriptions/' + uuid, this.headerService.getTokenHeader());
  }

  public getSubscriptions() {
    return this.http.get(environment.apiUrl + '/api/subscriptions', this.headerService.getTokenHeader());
  }
}
