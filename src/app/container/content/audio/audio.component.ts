import {Component, OnInit, TemplateRef} from '@angular/core';
import {UploadEvent, UploadFile} from 'ngx-file-drop';
import {FileUploadService} from '../../../service/file-upload.service';
import {ProgressHttp} from 'angular-progress-http';
import {MetadataService} from '../../../service/metadata.service';
import {UserService} from '../../../service/user.service';
import {FormsModule} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.sass']
})
export class AudioComponent implements OnInit {

  private metadataMap = new Map();

  public metadataList: any = [];

  public files: UploadFile[] = [];

  modalRef: BsModalRef;

  public options = [null, 'MP3', 'FLAC', 'WAV'];

  public fileTypeConvertFrom;

  public file;

  public fileTypeConvertTo;

  constructor(private http: ProgressHttp, private metadataService: MetadataService, private userService: UserService, private modalService: BsModalService) {
  }

  ngOnInit() {
    // Load existing metadata
    this.metadataService.getMetadata(this.userService.getCurrentUser()).subscribe((response) => {
      this.metadataList = response;
      // Load map on startup
      this.loadMetadataMap();
      console.log(JSON.stringify(this.metadataList));
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  /**
   * Load the map with key of uuid
   */
  public loadMetadataMap() {
    this.metadataList.forEach((e) => {
      this.metadataMap.set(e.uuid, e);
    });
  }

  /**
   * Dropped File Event
   */
  public addDroppedFile(event: UploadEvent) {
    this.files = event.files;
  }

  /**
   * Upload File Event
   */
  public addPickedFile(file, template) {
    // Generate UUID

    this.fileTypeConvertFrom = this.getFileExtension(file[0].name);
    this.modalRef = this.modalService.show(template);

    this.file = file;
  }

  /**
   * Continue with file conversion
   */
  public continueConversion() {

    if (!this.fileTypeConvertTo) {
      console.error('File to conversion is null');
      return;
    }

    this.modalRef.hide();
    const uuid = this.generateUUID();
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
      incrementValue: 0
    };

    // Add to dashboard
    this.addToDashboard(metadata);

    // Add to metadata table in db
    this.persistMetadata(metadata);

    // Check if file already exists first
    // Start the file upload
    this.uploadFile(this.file[0], uuid);
  }

  /**
   * Persist metadata
   */
  public persistMetadata(metadata: any) {
    this.metadataService.addMetadata(this.userService.getCurrentUser(), metadata).subscribe((response) => {
      console.log(JSON.stringify(response));
    }, (error) => {
      console.error(JSON.stringify(error));
    });
  }

  /**
   * Add new file metadata to dashboard
   */
  public addToDashboard(metadata: any) {
    this.metadataList.push(metadata);
    this.loadMetadataMap();
  }

  /**
   * Upload File
   */
  public uploadFile(file, uuid) {
    const form = new FormData();
    form.append('file', file);
    this.http
      .withUploadProgressListener(progress => {
        this.setValue(uuid, progress.percentage);
        if (progress.percentage === 100) {
          this.setComplete(uuid);
        }
      })
      .withDownloadProgressListener(progress => {
      })
      .post('http://localhost:8080/file-upload/' + uuid, form)
      .subscribe((response) => {
      });
  }

  /**
   * Set meta data to complete
   */
  public setComplete(uuid) {
    console.log('Setting complete');
    const metadata = this.metadataMap.get(uuid);
    metadata.uploadComplete = true;
    this.metadataService.updateMetadata(uuid, metadata).subscribe((response) => {
      console.log(JSON.stringify(response));
    });
  }

  /**
   * Add 1 to the progress bar
   */
  public setValue(uuid, value) {
    const val = this.metadataMap.get(uuid);
    val.incrementValue = value;
    if (val.incrementValue === 100) {
      return;
    }
  }

  /**
   * Selected
   */
  public changeValue($event) {
    console.log(this.options[$event]);
    this.fileTypeConvertTo = this.options[$event];
  }

  /**
   * Generate UUID
   */
  public generateUUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * Get file extension
   */
  public getFileExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
  }

}
