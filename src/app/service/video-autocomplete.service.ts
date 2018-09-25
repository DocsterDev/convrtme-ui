import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class VideoAutoCompleteService {
  constructor(private http: HttpClient) {
  }

  getAutoComplete(input: string) {
    return this.http.get(environment.apiUrl + '/api/autocomplete', {
      params: {
        input: input
      }
    });
  }

  // return this.http.get('http://suggestqueries.google.com/complete/search?client=firefox&ds=yt', {
  //   params: {
  //     q: q
  //   }
  // });

}

