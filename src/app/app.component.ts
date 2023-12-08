import { Component } from '@angular/core';
import { LoginService } from './provider/login/login.service';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ListMasterService } from './provider/list-master/list-master.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { UserIdleService } from 'angular-user-idle';
import { CommonService } from './provider/common/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userInfo: any = [];
  myMenu: any = [];
  loading: any;
  constructor(
    private loginPro: LoginService,
    private router: Router,
    private listMaster: ListMasterService,
    private platform: Platform,
    private userIdle: UserIdleService,
    private alertController: AlertController,
    private httpLogin: LoginService,
    private loadingController: LoadingController,
    private common: CommonService) {
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
    this.initIdle();
    const isLogin = localStorage.getItem('isAlreadyLogin');
    if (!isLogin) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } else {
      this.refreshToken();
    }
  }

  refreshTokenOnly() {
    this.presentLoading().then(preLoad => {
      this.httpLogin.refreshToken().subscribe({
        next:(data) => {
          localStorage.setItem('token1', data.refresh);
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    });
  }

  refreshToken() {
    this.presentLoading().then(res => {
      this.httpLogin.refreshToken().subscribe({
        next:(data) => {
          if (data.status) {
            localStorage.setItem('token1', data.refresh);
            const userTemp = localStorage.getItem('user');
            if (userTemp) {
              this.httpLogin.username.next(JSON.parse(userTemp));
            }
            this.router.navigateByUrl('/list-master', { replaceUrl: true });
          } else {
            this.common.presentToast(data.info, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
          this.presentAlertConfirmCache();
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  initIdle() {
    this.userIdle.startWatching();
    this.userIdle.onTimerStart().subscribe();
    this.userIdle.onTimeout().subscribe(() => {
      console.log('time up');
      this.stop();
      this.stopWatching();
      this.presentAlertConfirm();
    });
  }

  async presentAlertConfirmCache() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error!!!',
      message: environment.errMsg,
      mode: 'ios',
      buttons: [{
        text: 'RESET',
          handler: (data) => {
            console.log("Cancel");
            this.cleanDb();
          }
        },{
          text: 'RETRY',
          handler: (data) => {
            this.refreshToken();
          }
        }]
    });
    await alert.present();
  }

  cleanDb() {
    localStorage.clear();
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Session Timeout',
      message: 'Your session will expire soon, do you want to refresh?',
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
          handler: (data) => {
            console.log("Cancel");
          }
        },{
          text: 'YES',
          handler: (data) => {
            this.startWatching()
            this.restart();
            this.refreshTokenOnly();
          }
        }]
    });
    await alert.present();
  }

  stop() {
    console.log('stop !!');
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    console.log('restart !!');
    this.userIdle.resetTimer();
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
