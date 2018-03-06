import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.sass']
})
export class AudioComponent implements OnInit {

  private map = new Map();

  public audioData = [
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

  constructor() {
  }

  ngOnInit() {
    /**
     * Load map will simulate when audio data is loaded after every server load and update of list
     */
    this.loadMap();
  }

  public onUpload() {
    console.log('Upload files');
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
    this.audioData.forEach((e) => {
      this.map.set(e.uuid, e);
    });
  }

}
