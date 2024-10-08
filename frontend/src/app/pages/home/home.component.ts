import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GeolocationService } from '@services/geolocation.service';
import { NotifierService } from 'angular-notifier';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private notifier: NotifierService,
    private geolocation: GeolocationService
  ) {}


  // search = new FormControl('');

  // namesObj = [
  //   { name: 'João da Silva' },
  //   { name: 'Maria de Fátima' },
  //   { name: 'Carol do Santos' },
  //   { name: 'Lucas dos Santos' },
  //   { name: 'Ana e Luiz' },
  // ];

  // names = [
  //   'João da Silva',
  //   'Maria de Fátima',
  //   'Carol do Santos',
  //   'Lucas dos Santos',
  //   'Ana e Luiz',
  // ];

  // now$ = interval(1000).pipe(
  //   map(() => {
  //     return new Date();
  //   })
  // );

  // showNotification() {
  //   this.notifier.notify('success', 'Hello world!');
  // }

  // getLocation() {
  //   this.geolocation.getCurrentPosition().subscribe((data) => {
  //     console.log(data);
  //   });
  // }
}
