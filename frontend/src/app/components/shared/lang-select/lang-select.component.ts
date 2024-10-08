import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';

@Component({
  selector: 'lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.scss'],
})
export class LangSelectComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private language: LanguageService
  ) {}

  langs = ['pt-br', 'en'];
  selected = this.langs[0];

  ngOnInit(): void {
    this.selected = this.language.current;
  }

  selectLang(lang: string) {
    this.translate.use(lang);
    this.language.current = lang;
    this.selected = lang;
  }
}
