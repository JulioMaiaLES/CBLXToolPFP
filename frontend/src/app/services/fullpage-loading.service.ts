import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FullpageLoadingService {
  constructor() {}
  loading = signal(false);
}
