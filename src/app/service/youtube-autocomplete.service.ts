import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from "./config.service";

@Injectable()
export class YoutubeAutoCompleteService {
  constructor(private http: HttpClient, private config: ConfigService) {
  }

  getAutoComplete(input: string) {
    return this.http.get(this.config.getAddress() + '/api/autocomplete', {
      params: {
        input: input
      }
    });
  }

}

