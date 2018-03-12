import {Component} from '@angular/core';
import {UploadItem} from 'angular2-http-file-upload';

@Component({
  selector: 'app-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.sass']
})
export class FileUploadItemComponent extends UploadItem {

  constructor(file: any) {
    super();
    this.url = 'http://localhost:8080/file-upload';
    // this.headers = { HeaderName: 'Header Value', AnotherHeaderName: 'Another Header Value' };
    this.file = file;
  }

}
