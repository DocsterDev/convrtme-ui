import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convert-modal',
  templateUrl: './convert-modal.component.html',
  styleUrls: ['./convert-modal.component.sass']
})
export class ConvertModalComponent implements OnInit {

  public options = [
    'bro', 'dude', 'nope'
  ]

  constructor() { }

  ngOnInit() {
  }

}
