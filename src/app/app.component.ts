import { Component } from '@angular/core';
import { LoginService } from './provider/login/login.service';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ListMasterService } from './provider/list-master/list-master.service';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userInfo: any = [];
  myMenu: any = [];
  constructor(
    private loginPro: LoginService,
    private router: Router,
    private listMaster: ListMasterService,
    private platform: Platform) {
      this.platform.ready().then(res => {
        this.initApp();
        this.getUserData();
      })
  }

  initApp() {
    if (this.platform.is('capacitor')) {
      StatusBar.setOverlaysWebView({overlay: false});
      StatusBar.setStyle({ style: Style.Dark })
      StatusBar.setBackgroundColor({'color': '#222428'})
    }
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  getUserData() {
    this.loginPro.getUserDataObs().subscribe((dat: any) => {
      this.userInfo = dat;
      console.log(this.userInfo);
    });

    this.listMaster.getData().subscribe((val: any) => {
      this.myMenu = val;
    });
  }

  reset() {
    localStorage.clear();
    App.exitApp();
  }

  openPage(data: any) {
    this.router.navigateByUrl(data.link);
  }
}
