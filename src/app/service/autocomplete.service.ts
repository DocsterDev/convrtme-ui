import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class AutoCompleteService {
  constructor(private http: Http) {
  }

  getAutoComplete(input: string) {
    return this.http.get('http://localhost:8080/api/autocomplete', {
      params: {
        input: input
      }
    });
  }

}
