import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() back = false;
  @Input() next = false;
  @Input() current = 1;
  @Input() total = 1;
  @Output() page_change = new EventEmitter<number>();

  currentControl = new FormControl(1);

  ngOnInit(): void {
    this.currentControl.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        if (!value) return;
        if (value > this.total) {
          this.currentControl.setValue(this.total);
          return;
        }
        this.page_change.emit(value);
      });
  }

  ngOnChanges() {
    this.currentControl.setValue(this.current, { emitEvent: false });
  }

  handlePageChange(page: number) {
    this.page_change.emit(page);
  }
}
