import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class YouTubeQueryService {

  constructor(private http: Http) { }

  /**
   * Get search results
   */
  getSearchResults(query: string) {
    return this.http.get('http://localhost:8081/api/youtube/query', {
      params: {
        q: query
      }
    });
  }

}
