import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-search-auto-complete',
  templateUrl: './search-auto-complete.component.html',
  styleUrls: ['./search-auto-complete.component.sass']
})
export class SearchAutoCompleteComponent implements OnInit, OnDestroy {

  @Input()
  public predictions: Array<string>;

  @Output()
  public selected: EventEmitter<string> = new EventEmitter();

  @Input()
  public open: boolean;

  private internalOpen: boolean;

  @Output()
  public closed: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:click', ['$event'])
  handleClick(event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if(this.internalOpen === true){
        this.open = false;
        this.closed.emit(false);
      }
    }
    this.internalOpen = this.open;
  }

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  public handleSuggestionSelect(query) {
    this.open = false;
    this.closed.emit(false);
    this.internalOpen = this.open;
    this.selected.emit(query);
  }

  ngOnDestroy() {

  }

}
