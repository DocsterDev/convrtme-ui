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

}

