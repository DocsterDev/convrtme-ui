import {Component, OnInit} from '@angular/core';
import {UploadEvent, UploadFile} from 'ngx-file-drop';
import {FileUploadService} from '../../../service/file-upload.service';
import {Uploader} from 'angular2-http-file-upload';
import {FileUploadItemComponent} from '../../../common/file-upload-item/file-upload-item.component';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.sass']
})
export class AudioComponent implements OnInit {

  private map = new Map();

  private url = 'www.html.org';

  public uploader: FileUploader = new FileUploader({url: this.url});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public data = [
    {
      uuid: 'abc1234',
      title: 'Gagnum Style [Official Video]',
      conversionFrom: 'MP3',
      conversionTo: 'WMA',
      incrementValue: 34
    },
    {
      uuid: 'abc1675',
      title: 'Green Day - Basket Case',
      conversionFrom: 'WAV',
      conversionTo: 'OGG',
      incrementValue: 88
    },
    {
      uuid: 'abc6743',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 100
    },
    {
      uuid: 'abc9877',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 74
    },
    {
      uuid: 'abc4845',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 23
    },
    {
      uuid: 'abc4568',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 100

    },
    {
      uuid: 'abc7547',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 95
    },
    {
      uuid: 'abc3467',
      title: 'Good Charlotte - The Anthem',
      conversionFrom: 'MP3',
      conversionTo: 'FLAC',
      incrementValue: 100
    }
  ];

  public files: UploadFile[] = [];

  constructor(private fileUploadService: FileUploadService, public uploaderService: Uploader) {
  }


  ngOnInit() {

    /**
     * Load map will simulate when audio data is loaded after every server load and update of list
     */
    this.loadMap();

  }

  /**
   * Clicked Upload files
   */
  public onUpload() {
    console.log('Upload files');
    this.fileUploadService.uploadFile().subscribe((response) => {
      console.log(JSON.stringify(response));
    });


  }

  /**
   * Clicked download
   */
  public onDownload() {
    console.log('Download files');
  }

  /**
   * Add 1 to the progress bar
   */
  public increment(uuid) {
    const val = this.map.get(uuid);
    if (val.incrementValue === 100) {
      return;
    }
    val.incrementValue++;
  }

  /**
   * Load the map with key of uuid
   */
  public loadMap() {
    this.data.forEach((e) => {
      this.map.set(e.uuid, e);
    });
  }


  /**
   * Dropped File Event
   */
  public dropped(event: UploadEvent) {
    this.files = event.files;
    this.files.forEach((e) => {
      const obj = {
        uuid: 'abc1234',
        title: e.relativePath,
        conversionFrom: 'MP3',
        conversionTo: 'FLAC',
        incrementValue: 100
      };
      this.data.push(obj);
      this.loadMap();
    });
  }

  /**
   * File hover over
   */
  public fileOver(event) {
    // console.log(event);
  }

  /**
   * File leave
   */
  public fileLeave(event) {
    // console.log(event);
  }



  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


  /**
   * onFileUpload
   */
  submit() {
    const uploadFile = (<HTMLInputElement>window.document.getElementById('fileUpload')).files[0];

    const myUploadItem = new FileUploadItemComponent(uploadFile);
    myUploadItem.formData = { FormDataKey: 'Form Data Value' };  // (optional) form data can be sent with file

    this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
      // success callback
    };
    this.uploaderService.onErrorUpload = (item, response, status, headers) => {
      // error callback
    };
    this.uploaderService.onCompleteUpload = (item, response, status, headers) => {
      // complete callback, called regardless of success or failure
    };
    this.uploaderService.onProgressUpload = (item, percentComplete) => {
      // progress callback
      console.log(percentComplete);
    };
    this.uploaderService.upload(myUploadItem);
  }

}
