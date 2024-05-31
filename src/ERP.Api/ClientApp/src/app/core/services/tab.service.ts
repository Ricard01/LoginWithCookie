import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from "../../state/auth/auth.actions";

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private storageKey = 'app-tab-count';
  private sessionKey = 'app-tab-session';
  private isRegistered: boolean = false;

  constructor(private store: Store) { }

   // Inicializa el servicio de registro de pestañas y añade los listeners necesarios.
  initialize() {
    this.registerTab();
    this.addEventListeners();
  }

  // Destruye el servicio de registro de pestañas y remueve los listeners.
  destroy() {
    this.unregisterTab();
    this.removeEventListeners();
  }
  // Registra la pestaña actual incrementando el contador de pestañas abiertas y marcándola en sessionStorage.
  private registerTab() {
    if (!sessionStorage.getItem(this.sessionKey)) {
      this.incrementTabCount();
      sessionStorage.setItem(this.sessionKey, 'true');
      this.isRegistered = true;
    }
  }
  // Desregistra la pestaña actual decrementando el contador de pestañas abiertas y eliminando su marca en sessionStorage.
  private unregisterTab() {
    if (this.isRegistered) {
      this.decrementTabCount();
      sessionStorage.removeItem(this.sessionKey);
      this.isRegistered = false;
    }
  }

  private addEventListeners() {
    window.addEventListener('storage', this.handleStorageEvent.bind(this));
    window.addEventListener('beforeunload', this.unregisterTab.bind(this));
  }

  private removeEventListeners() {
    window.removeEventListener('storage', this.handleStorageEvent.bind(this));
    window.removeEventListener('beforeunload', this.unregisterTab.bind(this));
  }

  private incrementTabCount() {
    let count = parseInt(localStorage.getItem(this.storageKey) || '0', 10);
    localStorage.setItem(this.storageKey, (count + 1).toString());
  }

  private decrementTabCount() {
    let count = parseInt(localStorage.getItem(this.storageKey) || '0', 10);
    if (count > 0) {
      localStorage.setItem(this.storageKey, (count - 1).toString());
    }
  }

  // Maneja los eventos de almacenamiento. Si se recibe un evento de logout, cierra sesión en la pestaña.
  private handleStorageEvent(event: StorageEvent) {
    if (event.key === 'logout-event') {
      this.handleLogout();
    }
  }
  // Despacha una acción de logout en la pestaña correspondiente.
  private handleLogout() {
    this.store.dispatch(AuthActions.logOutInTab());
  }

  /**
   * Notifica a otras pestañas sobre el evento de logout creando un evento en localStorage.
   * Solo se crea el evento si hay más de una pestaña abierta.
   */
  public notifyOtherTabsOfLogout() {
    const tabCount = parseInt(localStorage.getItem(this.storageKey) || '0', 10);

    if (tabCount > 1) {
      // Notificar a otras pestañas
      localStorage.setItem('logout-event', Date.now().toString());
    }
  }
}
