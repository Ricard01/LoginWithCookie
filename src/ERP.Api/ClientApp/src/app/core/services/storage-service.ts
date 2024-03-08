import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}') || {};
  }

  setItem(key: string, value: any): boolean {
    localStorage.setItem(key, JSON.stringify(value));

    return true;
  }

  hasItem(key: string): boolean {
    return !!localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clearLocStorage() {
    localStorage.clear();
  }
}
