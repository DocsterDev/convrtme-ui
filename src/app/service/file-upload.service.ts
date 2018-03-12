import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProgressHttp} from 'angular-progress-http';

@Injectable()
export class FileUploadService {

  constructor( private http: ProgressHttp) {
  }

  public uploadFile(file) {
    const form = new FormData();
    form.append('file', file);
    // return this.http.post('http://localhost:8080/file-upload', form);
    this.http
      .withUploadProgressListener(progress => {
        console.log(`Uploading ${progress.percentage}%`);

      })
      .withDownloadProgressListener(progress => { console.log(`Downloading ${progress.percentage}%`); })
      .post('http://localhost:8081/file-upload', form)
      .subscribe((response) => {
        console.log(response);
      });
  }

}
