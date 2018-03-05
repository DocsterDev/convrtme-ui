import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.sass']
})
export class TileComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public conversionFrom: string;

  @Input()
  public conversionTo: string;

  constructor() {
  }

  ngOnInit() {
  }

}
