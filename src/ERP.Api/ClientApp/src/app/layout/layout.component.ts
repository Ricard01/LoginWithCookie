import {BreakpointObserver} from '@angular/cdk/layout';
import {DOCUMENT} from '@angular/common';
import {Component, Inject, OnDestroy} from '@angular/core';
import {AppSettingsService} from '../core/services/app-settings.service';
import {Subscription} from "rxjs";


const MOBILE_MEDIA = 'screen and (max-width: 767.98px)';
const TABLET_MEDIA = 'screen and (min-width: 768px) and (max-width: 991.98px)';
const MONITOR_MEDIA = 'screen and (min-width: 992px)';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {

  private isMobileScreen = false;
  private isMonitorScreen = true;
  private isSideNavMini = false;  //Collapsed
  isCollapsed = true;
  appOptions = this.appSettings.appOptions;

  private htmlElement!: HTMLHtmlElement;

  private layoutChangesSubscription = Subscription.EMPTY;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private appSettings: AppSettingsService,
    @Inject(DOCUMENT) private document: Document) {
 
    this.htmlElement = this.document.querySelector('html')!;

    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_MEDIA, TABLET_MEDIA, MONITOR_MEDIA])
      .subscribe(state => {
        // SidenavOpened must be reset true when layout changes
        // this.options.sidenavOpened = true;

        // Si es mobileMedia y tmb sidebarmiini es true entonces quito la clase
        this.isMobileScreen = state.breakpoints[MOBILE_MEDIA]

        if (this.isMobileScreen && this.appOptions.isSideBarMini) {
          this.htmlElement.classList.remove('sidebar-mini');


          // cuando en localStore sidebarmini es true hay que cambiarlo falso?
          // no pk no afecta mi sidebar estilo collapse y quiero que cuando se ajuste la pantalla (!== MobileMedia)
          // siga respetando el sidebarmini
          // this.updateOptions();
          // this.appOptions.isSideBarMini = false;
        } else if (!this.isMobileScreen && this.appOptions.isSideBarMini) {
          // sidebarmini true agrego la clase

          this.htmlElement.classList.add('sidebar-mini');
        }
        console.log('isMobile', this.isMobileScreen);
        console.log('sidebarmini', this.appOptions.isSideBarMini)
        //  sidebarmini default es falso no necesito hacer nada

        // this.appOptions.isSideBarMini = state.breakpoints[TABLET_MEDIA];
        this.isMonitorScreen = state.breakpoints[MONITOR_MEDIA];


        // console.log('isSideBarMini', this.appOptions.isSideBarMini);
        // console.log('isMonitorScreen', this.isMonitorScreen);
      });

    // this.setInitialThemeOptions();
  }

  ngOnDestroy(): void {
    this.layoutChangesSubscription.unsubscribe();
  }

  setInitialThemeOptions() {

    this.updateOptions();

    if (this.isMobileScreen) {


    } else if (this.appOptions.isSideBarMini) {
      // si sidebarmini es true (en locStore) entonces como es diferente a mobile-media puede usar el sidebar-mini
      this.htmlElement.classList.add('sidebar-mini');
    }


  }


  toggleMenu() {



    if (this.isMobileScreen) {

      document.body.classList.add('vertical-sidebar-enable');

      if (!this.appOptions.isSideBarMini) {
        this.htmlElement.classList.remove('sidebar-mini');
      }

    } else {

      this.appOptions.isSideBarMini = !this.appOptions.isSideBarMini;

      document.body.classList.remove('vertical-sidebar-enable');

      if (this.appOptions.isSideBarMini) {
        this.htmlElement.classList.add('sidebar-mini');
      } else {
        this.htmlElement.classList.remove('sidebar-mini');
      }


      this.updateOptions();
    }

    // if (this.appOptions.isSideBarMini && !this.isMobileScreen) {
    //   // sidebarmini true agrego la clase
    //   this.htmlElement.classList.add('sidebar-mini');
    // } else if (this.isMobileScreen) {
    //
    //   document.body.classList.add('vertical-sidebar-enable');
    //
    // } else if (!this.appOptions.isSideBarMini) {
    //   this.htmlElement.classList.remove('sidebar-mini');
    // }
    //
    // if () {
    //   document.body.classList.add('vertical-sidebar-enable');
    // } else {
    //   document.body.classList.remove('vertical-sidebar-enable');
    // }

    // // es mobileMedia
    // if (this.isMobileScreen && !this.appOptions.isSideBarMini) {
    //   document.body.classList.add('vertical-sidebar-enable');
    //   // muestro el sidenav
    //   //quito el sidebarmini porque no me sirve
    //   this.htmlElement.classList.remove('sidebar-mini')
    // }
    // else if (!this.isMobileScreen && this.appOptions.isSideBarMini) {
    //   // quito el sidebar-collapse
    //   document.body.classList.remove('vertical-sidebar-enable');
    //
    //   //agrego la clase del sidebar mini
    //   this.htmlElement.classList.add('sidebar-mini');
    // } else if (!this.appOptions.isSideBarMini) {
    //   this.htmlElement.classList.remove('sidebar-mini');
    // }

    // if (this.appOptions.isSideBarMini) {
    //   this.htmlElement.classList.add('sidebar-mini');
    // } else {
    //   this.htmlElement.classList.remove('sidebar-mini')
    // }


    // if (this.appOptions.isSideBarMini && !this.isMobileScreen) {
    //
    // } else {
    //   this.htmlElement.classList.remove('sidebar-mini')
    // }


    // if (this.isMobile) {
    //   // this.sidenav.toggle();
    //   this.isCollapsed = false;
    // } else {
    //   // this.sidenav.open();
    //   this.isCollapsed = !this.isCollapsed;
    //   // if ( this.isCollapsed) {
    //   //   this.htmlElement.classList.add('expanded');
    //   // } else {
    //   //   this.htmlElement.classList.remove('expanded')
    //
    //   // }
    //
    // }
  }

  updateOptions(timer = 400) {
    setTimeout(() => this.appSettings.setOptions(this.appOptions), timer);
  }

}
