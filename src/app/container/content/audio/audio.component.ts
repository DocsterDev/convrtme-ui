import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
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

  @Output()
  showLoader: EventEmitter<boolean> = new EventEmitter();

  private metadataMap = new Map();
  public files: UploadFile[] = [];
  modalRef: BsModalRef;
  public fileTypeOptions = ['Select', 'MP3', 'FLAC', 'WAV'];
  public fileQualityOptions = ['Select', 'Good', 'Better', 'Best'];
  public fileTypeConvertFrom;
  public file;
  public fileTypeConvertTo;
  private subscription: any;

  constructor(private httpClient: Http,
              private http: ProgressHttp,
              private metadataSvc: MetadataService,
              private userSvc: UserService,
              private modalSvc: BsModalService,
              private stompSvc: StompService,
              private utilsSvc: UtilsService) {
  }

  ngOnInit() {
    // Connect To Web Socket on Startup
    this.connectWebSocket();
    // Load Dashboard for User
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
    this.showLoader.emit(true);
    this.metadataSvc.getMetadata(this.userSvc.getCurrentUser()).subscribe((response) => {
      this.showLoader.emit(false);
      let list: any;
      list = response;
      list.forEach((e) => {
        // e.status = 'uploading'; /* TEST */
        this.metadataMap.set(e.uuid, e);
      });
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
    this.metadataSvc.addMetadata(this.userSvc.getCurrentUser(), metadata).subscribe((response) => {

    }, (error) => {
      console.error(JSON.stringify(error));
    });
    this.uploadFile(this.file[0], uuid);
  }

  /**
   * Upload File
   */
  public uploadFile(file, uuid) {
    const form = new FormData();
    form.append('file', file);
    this.http
      .withUploadProgressListener(progress => {
        this.updateUploadProgress(uuid, progress.percentage);
      })
      .post('http://localhost:8080/file-upload/' + uuid, form)
      .subscribe((response) => { /* Response */
      });
  }

  /**
   * Update Upload Progress
   */
  public updateUploadProgress(uuid, progress) {
    const val = this.metadataMap.get(uuid);
    val.uploadProgress = progress;
    val.status = 'uploading';
    if (progress === 100) {
      val.uploadComplete = true;
      this.metadataSvc.updateMetadata(uuid, val).subscribe((response) => {
        /* Response */
      }, (e) => console.log(JSON.stringify(e)));
    }
  }

  /**
   * Update Convert Progress
   */
  public updateConvertProgress(uuid, progress) {
    const val = this.metadataMap.get(uuid);
    val.convertProgress = progress;
    val.status = 'converting';
    if (progress === 100) {
      val.conversionComplete = true;
      val.status = 'complete';
      this.metadataSvc.updateMetadata(uuid, val).subscribe((response) => {
        /* Response */
      }, (e) => console.log(JSON.stringify(e)));
    }
  }

  // Update Conversion
  public conversionUpload = (data) => {
    this.updateConvertProgress(data.uuid, data.progress);
  };

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
