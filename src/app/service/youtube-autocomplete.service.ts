import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class YoutubeAutoCompleteService {
  constructor(private http: HttpClient) {
  }

  getAutoComplete(input: string) {
    return this.http.get('http://localhost:8080/api/autocomplete', {
      params: {
        input: input
      }
    });
  }

}

