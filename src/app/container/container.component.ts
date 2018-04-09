import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.sass']
})
export class ContainerComponent implements OnInit {

  @Input()
  public showLoader = true;

  constructor() { }

  ngOnInit() {
  }

}
