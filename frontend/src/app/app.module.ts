import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { SharedModule } from '@components/shared/shared.module';
import { CONFIG_NOTIFIER } from '@constants/notifier';
import { environment } from '@env';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NotifierModule } from 'angular-notifier';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpandedimageComponent } from './components/jornada/expandedimage/expandedimage.component';
import { TogglemenuComponent } from './components/jornada/togglemenu/togglemenu.component';
import { MenuComponent } from './components/jornada/menu/menu.component';
import { TabelaComponent } from './components/tabela/tabela.component';
import { ProgressService } from './services/progress.service';
import { TabelaModule } from './components/tabela/tabela.module';
import { TabelaVariavelModule } from './components/tabelavariavel/tabelavariavel.module';
import { NbLayoutModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { ResizableModule } from 'angular-resizable-element';
import { JornadaComponent } from './pages/jornada/jornada.component';
import { ModalComponent } from './components/modal/modal.component';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CblCanvasModule } from './components/cbl-canvas/cbl-canvas.module';
import { ModalInvestigateComponent } from './components/modals/modal-investigate/modal-investigate.component';
import { TabComponent } from './components/tab/tab.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { TabModule } from './components/tab/tab.module';

  export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
  }
  registerLocaleData(localePt);

  const MY_DATE_FORMAT = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

  @NgModule({
    declarations: [AppComponent, NavbarComponent, ExpandedimageComponent, ModalComponent, AutocompleteComponent,
      ],
    imports: [
      MatAutocompleteModule,
      MatFormFieldModule,
      MatInputModule,
      MatOptionModule,
      ReactiveFormsModule,
      BrowserModule,
      FormsModule,
      MatButtonModule,
      TabelaModule,
      TabelaVariavelModule,
      CblCanvasModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      MatDialogModule,
      SharedModule,
      NbLayoutModule,
      MenuComponent,
      TabModule,
      NbSidebarModule.forRoot(), 
      ResizableModule, 
      NbThemeModule.forRoot({ name: 'default' }),
      MatNativeDateModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // ? Registra o ServiceWorker após build em produção
        // ? ou após 30 segundos (o que ocorrer primeiro).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      NotifierModule.withConfig(CONFIG_NOTIFIER),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'pt-br',
      }),
      TabModule,
    ],
    providers: [
      ProgressService,
      DatePipe,
      { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
      { provide: LOCALE_ID, useValue: 'pt' },
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
      },
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
      {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'BRL',
      },
      {
        provide: MatDialogRef,
        useValue: {},
      },
      provideEnvironmentNgxMask(),
    ],
    bootstrap: [AppComponent],
  })
  export class AppModule {}
