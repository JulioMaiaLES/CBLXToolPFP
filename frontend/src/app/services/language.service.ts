import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translate: TranslateService) {}

  get current() {
    const allLangs = this.translate.getLangs();
    const browserLang = allLangs.includes(this.translate.getBrowserLang() || '')
      ? this.translate.getBrowserLang()
      : '';

    return (
      this.translate.currentLang ||
      localStorage.getItem('language') ||
      browserLang ||
      'pt-br'
    );
  }

  set current(value: string) {
    localStorage.setItem('language', value);
  }
}
