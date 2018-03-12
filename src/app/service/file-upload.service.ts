import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FileUploadService {

  constructor(private httpClient: HttpClient) {
  }

  public uploadFile() {
    return this.httpClient.get('http://localhost:8080/files');
  }

}
