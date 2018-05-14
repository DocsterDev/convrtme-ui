import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

@Injectable()
export class YoutubeAutoCompleteService {

  constructor(private http: Http) { }

  /**
   * Get search results
   */
  getSearchResults(query: string) {
    return this.http.get('http://localhost:8080/api/youtube/search', {
      params: {
        q: query
      }
    });
  }

}
