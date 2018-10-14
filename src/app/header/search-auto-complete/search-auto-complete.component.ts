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

  @Output()
  public onHighlighted: EventEmitter<string> = new EventEmitter();

  @Input()
  public open: boolean;

  private internalOpen: boolean;

  @Output()
  public closed: EventEmitter<boolean> = new EventEmitter();

  public highlightedIndex: number = null;
  public showHighlight: boolean;

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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowUp') {
      event.preventDefault();
      if (this.highlightedIndex === null) {
        return;
      }
      if (this.highlightedIndex === 0) {
        return;
      }
      this.highlightedIndex--;
      this.onHighlighted.emit(this.predictions[this.highlightedIndex]);
    }
    if (event.key == 'ArrowDown') {
      event.preventDefault();
      if (this.highlightedIndex === null) {
        this.showHighlight = true;
        this.highlightedIndex = 0;
        return;
      }
      if (this.highlightedIndex > this.predictions.length - 2) {
        return;
      }
      this.highlightedIndex++;
      this.onHighlighted.emit(this.predictions[this.highlightedIndex]);
    }
    if (event.key == 'Enter') {
      if (this.highlightedIndex !== null) {
        event.preventDefault();
        this.selected.emit(this.predictions[this.highlightedIndex]);
        return;
      }
    }
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
