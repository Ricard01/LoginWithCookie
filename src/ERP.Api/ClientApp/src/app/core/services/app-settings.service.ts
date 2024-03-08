import { Inject, Injectable } from '@angular/core';
import { AppSettings, defaults } from '../models/app-settings';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage-service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {
  private key = 'app-settings'; // Nombre de la variable en localStore
  appOptions: AppSettings;


  // private _darkTheme = new Subject<boolean>();
  // private isDarkTheme = this._darkTheme.asObservable();

  // private _sideBarMini = new Subject<boolean>();
  // private isSideBarMini = this._sideBarMini.asObservable();

  private readonly notify$ = new BehaviorSubject<Partial<AppSettings>>({});
  get notify() {
    return this.notify$.asObservable();
  }


  constructor(
    private store: StorageService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    const storedOptions = this.store.getItem(this.key);
    this.appOptions = Object.assign(defaults, storedOptions);

  }

  setOptions(options: AppSettings) {

    this.appOptions = Object.assign(defaults, options);
    this.store.setItem(this.key, this.appOptions);
    this.notify$.next(this.appOptions);

  }

}
