import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {HeaderService} from './header.service';
import {environment} from '../../environments/environment';

@Injectable()
export class VideoSearchService implements OnDestroy {

  private videoSearchSubscription: Subscription;

  constructor(private http: HttpClient, private headerService: HeaderService) {
  }

  private resultList = new Subject<any>();

  getServiceObservable(query: string) {
    return this.http.get(environment.apiUrl + '/api/videos/search?q=' + query, this.headerService.getTokenHeader());
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
