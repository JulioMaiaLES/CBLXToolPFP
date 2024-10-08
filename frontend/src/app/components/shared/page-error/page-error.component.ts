import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-error',
  templateUrl: './page-error.component.html',
  styleUrls: ['./page-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageErrorComponent implements OnInit, OnChanges {
  constructor(private route: ActivatedRoute) {}

  @Input() code = 0;

  translated = 'default';

  ngOnInit() {
    this.code ||= this.route.snapshot.data['code'];
    this.translated = [500, 404, 403, 401, 400].includes(this.code)
      ? this.code.toString()
      : 'default';
  }

  ngOnChanges() {
    this.ngOnInit();
  }
}
