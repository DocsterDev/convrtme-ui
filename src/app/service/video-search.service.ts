import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from "./config.service";
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class VideoSearchService implements OnDestroy {

  private videoSearchSubscription:Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  private resultList = new Subject<any>();

  getServiceObservable(query: string) {
    return this.http.get(this.config.getAddress() + '/api/videos/search', {
      params: {
        q: query
      }
    });
  }

  search(query: string) {
    this.videoSearchSubscription = this.getServiceObservable(query).subscribe((response) => {
      this.resultList.next(response);
    }, (error) => {
      console.log(error);
    });
  }

  getResultList(): Observable<any> {
    return this.resultList.asObservable();
  }

  ngOnDestroy() {
    this.videoSearchSubscription.unsubscribe();
  }

}
