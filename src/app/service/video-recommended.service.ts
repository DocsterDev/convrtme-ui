import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class VideoRecommendedService implements OnDestroy{

  private videoRecommendationSubscription:Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  private resultList = new Subject<any>();

  getServiceObservable(videoId: string) {
    return this.http.get(this.config.getAddress() + '/api/videos/recommended', {
      params: {
        v: videoId
      }
    });
  }

  recommended(videoId: string) {
    this.videoRecommendationSubscription = this.getServiceObservable(videoId).subscribe((response) => {
      this.resultList.next(response);
    }, (error) => {
      console.log(error);
    });
  }

  getResultList(): Observable<any> {
    return this.resultList.asObservable();
  }

  ngOnDestroy() {
    this.videoRecommendationSubscription.unsubscribe();
  }

}
