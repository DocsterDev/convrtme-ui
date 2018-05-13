import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class QueryService {
  constructor(private http: Http) {
  }

  /**
   * Get search query results
   */
  getQuery(query: string) {
    return this.http.get('http://localhost:8080/api/predict', {
      params: {
        q: query
      }
    });
  }

}
