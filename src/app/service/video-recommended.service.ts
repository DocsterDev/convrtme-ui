import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../environments/environment';
import 'rxjs/Rx';

@Injectable()
export class VideoRecommendedService implements OnDestroy {

  private videoRecommendationSubscription: Subscription;

  constructor(private http: HttpClient) {
  }

  private resultList = new Subject<any>();

  public getServiceObservable(videoId: string) {
    return this.http.get(environment.apiUrl + '/api/videos/recommended', {
      params: {
        v: videoId
      }
    });
  }

  recommended(videoId: string) {
    this.videoRecommendationSubscription = this.getServiceObservable(videoId).subscribe((response) => {
      this.triggerVideoLoad(response);
    }, (error) => {
      console.log(error);
    });
  }

  public triggerVideoLoad(videoList:any) {
    this.resultList.next(videoList);
  }

  getResultList(): Observable<any> {
    return this.resultList.asObservable();
  }

  ngOnDestroy() {
    this.videoRecommendationSubscription.unsubscribe();
  }
}
