import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class YoutubeSearchService {
  constructor(private http: HttpClient) {
  }

  private resultList = new Subject<any>();

  /**
   * Get search results
   */
  getServiceObservable(query: string) {
    return this.http.get('http://localhost:8080/api/youtube/search', {
      params: {
        q: query
      }
    });
  }

  /**
   * Search via passed in query
   */
  search(query: string) {
    this.getServiceObservable(query).subscribe((response) => {
      this.resultList.next(response);
    }, (error) => {
      console.log(error);
    });
  }

  clearResultList () {
    this.resultList.next();
  }

  getResultList (): Observable<any> {
    return this.resultList.asObservable();
  }

}
