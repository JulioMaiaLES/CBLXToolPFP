import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Score, zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnBrPackage from '@zxcvbn-ts/language-pt-br';

@Component({
  selector: 'app-password-stregth',
  templateUrl: './password-stregth.component.html',
  styleUrls: ['./password-stregth.component.scss'],
})
export class PasswordStregthComponent implements OnChanges {
  @Input() password = '';
  @Output() score = new EventEmitter<Score>();

  constructor() {}

  password_warning = '';
  password_suggestions: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['password']) {
      this.strengthPassword(changes['password'].currentValue);
    }
  }

  strengthPassword(password: string) {
    const options = {
      translations: zxcvbnBrPackage.translations,
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnBrPackage.dictionary,
      },
    };
    zxcvbnOptions.setOptions(options);
    const passwordStatus = zxcvbn(password);
    this.password_warning = passwordStatus.feedback.warning || '';
    this.password_suggestions = passwordStatus.feedback.suggestions;
    this.score.emit(passwordStatus.score);
  }
}
