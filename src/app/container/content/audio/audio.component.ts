import {Component, OnDestroy, OnInit} from '@angular/core';
import {UploadEvent, UploadFile} from 'ngx-file-drop';
import {ProgressHttp} from 'angular-progress-http';
import {MetadataService} from '../../../service/metadata.service';
import {UserService} from '../../../service/user.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Http} from '@angular/http';
import {StompService} from 'ng2-stomp-service/index';
import {UtilsService} from '../../../service/utils.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.sass']
})
export class AudioComponent implements OnInit, OnDestroy {

  private metadataMap = new Map();
  public files: UploadFile[] = [];
  modalRef: BsModalRef;
  public fileTypeOptions = ['Select', 'MP3', 'FLAC', 'WAV'];
  public fileQualityOptions = ['Select', 'Good', 'Better', 'Best'];
  public fileTypeConvertFrom;
  public file;
  public fileTypeConvertTo;
  private subscription: any;
  public showLoader;

  constructor(private httpClient: Http,
              private http: ProgressHttp,
              private metadataSvc: MetadataService,
              private userSvc: UserService,
              private modalSvc: BsModalService,
              private stompSvc: StompService,
              private utilsSvc: UtilsService) {
  }

  ngOnInit() {
    this.connectWebSocket();
    this.loadDashboard();
  }

  /**
   * Connect to Web Socket
   */
  connectWebSocket() {
    this.stompSvc.configure({
      host: 'http://localhost:8080/websocket-example',
      debug: false,
      queue: {'init': false}
    });
    this.stompSvc.startConnect().then(() => {
      this.stompSvc.done('init');
      this.subscription = this.stompSvc.subscribe('/topic/user', this.conversionUpload);
    });
  }

  /**
   * Load the map with key of uuid
   */
  public loadDashboard() {
    this.showLoader = true;
    this.metadataSvc.getMetadata(this.userSvc.getCurrentUser()).subscribe((response) => {
      let list: any;
      list = response;
      list.forEach((e) => {
        this.metadataMap.set(e.uuid, e);
      });
      this.showLoader = false;
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  /**
   * Dropped File Event
   */
  public addDroppedFile(event: UploadEvent) {
    this.files = event.files;
  }

  /**
   * Picked File Event
   */
  public addPickedFile(file, template) {
    this.fileTypeConvertFrom = this.getFileExtension(file[0].name);
    this.modalRef = this.modalSvc.show(template);
    this.file = file;
  }

  /**
   * Start File Conversion
   */
  public startConversion() {
    if (!this.fileTypeConvertTo) {
      console.error('File to conversion is null');
      return;
    }
    this.modalRef.hide();
    this.uploadFile(this.file[0], this.createMetadata());
  }

  /**
   * createMetadata
   */
  public createMetadata() {
    const uuid = this.utilsSvc.generateUUID();
    const name = this.file[0].name;
    const convertFrom = this.getFileExtension(this.file[0].name).toUpperCase();
    const convertTo = this.fileTypeConvertTo;
    // Build metadata object
    const metadata = {
      uuid: uuid,
      title: name,
      conversionFrom: convertFrom,
      conversionTo: convertTo,
      uploadComplete: false,
      conversionComplete: false,
      uploadProgress: 0,
      convertProgress: 0
    };
    this.metadataMap.set(metadata.uuid, metadata);
    return metadata;
  }

  /**
   * Upload File
   */
  public uploadFile(file, metadata) {
    const form = new FormData();
    form.append('file', file);
    this.http
      .withUploadProgressListener(progress => {
        this.updateUploadProgress(metadata.uuid, progress.percentage);
      })
      .post('http://localhost:8080/users/' + this.userSvc.getCurrentUser() + '/metadata/' + metadata.uuid + '/upload', form, {params: {title: metadata.title, convertTo: metadata.conversionTo, convertFrom: metadata.conversionFrom}})
      .subscribe((response) => {
          this.httpClient.post('http://localhost:8080/users/' + this.userSvc.getCurrentUser() + '/metadata/' + metadata.uuid + '/convert', null)
            .subscribe((resp) => {
              let meta: any;
              meta = resp.json();
              this.metadataMap.set(meta.uuid, meta);
            }, (error) => JSON.stringify(error));
      });
  }

  /**
   * Update Upload Progress
   */
  public updateUploadProgress(uuid, progress) {
    const val = this.metadataMap.get(uuid);
    val.uploadProgress = progress;
    val.status = 'uploading';
  }

  /**
   * Update Convert Progress
   */
  public updateConvertProgress(uuid, progress) {
    const val = this.metadataMap.get(uuid);
    val.convertProgress = progress;
    val.status = 'converting';
    if (progress === 100) {
      val.status = 'complete';
    }
  }

  // Update Conversion
  public conversionUpload = (data) => {
    this.updateConvertProgress(data.uuid, data.progress);
  }

  /**
   * Get file extension
   */
  public getFileExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

  /**
   * Convert Map to Array
   */
  public getValues() {
    return Array.from(this.metadataMap.values());
  }

  /**
   * File Type Selected
   */
  public changeFileType($event) {
    this.fileTypeConvertTo = this.fileTypeOptions[$event];
  }

  /**
   * File Quality Selected
   */
  public changeFileQuality($event) {
    console.log(this.fileQualityOptions[$event]);
  }

  /**
   * On Destroy Unsubscribe from Web Socket
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.stompSvc.disconnect().then(() => {
    });
  }

}
