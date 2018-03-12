import {Component, OnInit} from '@angular/core';
import {UploadEvent, UploadFile} from 'ngx-file-drop';
import {FileUploadService} from '../../../service/file-upload.service';
import {ProgressHttp} from 'angular-progress-http';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.sass']
})
export class AudioComponent implements OnInit {

  private map = new Map();

  public data = [
    {
      uuid: 'abc1234',
      title: 'Gagnum Style [Official Video]',
      conversionFrom: 'MP3',
      conversionTo: 'WMA',
      incrementValue: 0
    }/*,
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
    }*/
  ];

  public files: UploadFile[] = [];

  constructor(private http: ProgressHttp) {
  }


  ngOnInit() {

    /**
     * Load map will simulate when audio data is loaded after every server load and update of list
     */
    this.loadMap();

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
  public setValue(uuid, value) {
    const val = this.map.get(uuid);
    val.incrementValue = value;
    if (val.incrementValue === 100) {
      return;
    }
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
  public addFile(event: UploadEvent) {
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
   * Dropped File Event
   */
  public addFileToArray(name, uuid) {
      const obj = {
        uuid: uuid,
        title: name,
        conversionFrom: 'MP3',
        conversionTo: 'FLAC',
        incrementValue: 0
      };
      this.data.push(obj);
      this.loadMap();
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

  /**
   * Upload File
   */
  public uploadFile(file) {
    console.log(file[0].name);

    this.addFileToArray(file[0].name, 'uuid-21');
    const form = new FormData();
    form.append('file', file[0]);
    this.http
      .withUploadProgressListener(progress => {
        this.setValue('uuid-21', progress.percentage);
      })
      .withDownloadProgressListener(progress => { console.log(`Downloading ${progress.percentage}%`); })
      .post('http://localhost:8080/file-upload', form)
      .subscribe((response) => {
        console.log(response);
      });
  }

}
