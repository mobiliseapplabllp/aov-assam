import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ListMasterService } from 'src/app/provider/list-master/list-master.service';
import { LoginService } from 'src/app/provider/login/login.service';
import { db } from '../../provider/local-db/local-db.service';
import { liveQuery } from 'dexie';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-list-master',
  templateUrl: './list-master.page.html',
  styleUrls: ['./list-master.page.scss'],
})
export class ListMasterPage implements OnInit {
  myMenu: any = [];
  loading: any;
  subscription: any;
  counter = 0;
  mySlide: any = [
    {id: 'a' , img : '/assets/home_banner1/p1.jpg'},
    {id: 'a' , img : '/assets/home_banner1/p2.jpg'},
    {id: 'a' , img : '/assets/home_banner1/p3.jpg'},
  ];
  userData: any = [];
  result: any = [];
  userName!: string;
  breakdown: any = {};
  pr: any = {};
  indent: any = {};
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
  };
  isInternet!: boolean;
  isMenuLoading!: boolean;
  constructor(
    private listMaster: ListMasterService,
    private toastController: ToastController,
    private loginPro: LoginService,
    private loadingController: LoadingController,
    private common: CommonService,
    private router: Router,
    private alertController: AlertController,
    private httpAsset: MyAssetGetService,
    private assetSqlite: AssetSqliteService,
    private platform: Platform) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      this.userName = this.userData.user_name
    }
  }

  ngOnInit() {
    this.common.checkInternet().then(res => {
      if (res) {
        this.isInternet = true;
        this.common.setBarcode('');
        this.userData = this.loginPro.getLoginUserValue();
        this.getMenuDetail();
        this.getDashboard();
        this.getOffLineAssetList();
        if (this.platform.is('android')) {
          this.checkAndUpdateMaster();
        }
      } else {
        let menu, MENU_TEMP = localStorage.getItem('home_menu');
        if (MENU_TEMP) {
          this.myMenu = JSON.parse(MENU_TEMP);
          this.isInternet = false;
          console.log(menu);
        } else {
          this.common.presentToastWithOk('Menu Icon Not Saved in your Local DB, please connect with internet to save menu in Local DB', 'warning');
        }
      }
    });
  }

  syncMaster() {
    if (!this.platform.is('cordova')) {
      return;
    }
    this.presentLoading().then(preLoad => {
      localStorage.setItem('lastAssetTime', '');
      this.assetSqlite.deleteSqlite().then(res => {
        if (res) {
          this.common.getTableStructureFromJson().then(tableStructure => {
            this.common.createAllTable(tableStructure).then(resPonse => {
              if (resPonse === true) {
                this.dismissloading();
                this.checkAndUpdateMaster();
              }
            });
          });
        }
      });
    })

  }

  checkAndUpdateMaster() {
    let lastAssetTime = localStorage.getItem('lastAssetTime');
    if (!lastAssetTime) {
      this.presentLoading().then(preLoad => {
        this.httpAsset.getAssetMasterData('0000-00-00 00:00:00').subscribe({
          next:(data) => {
            this.httpAsset.insertAssetAction(data.data).then(insRes => {
              if (insRes) {
                this.common.presentToast('All Master Saved Successfully', 'success');
                localStorage.setItem('lastAssetTime', moment().format('YYYY-MM-DD H:mm:ss'));
                this.dismissloading();
              }
            });
          },
          error:() => {
            this.dismissloading();
          }
        })
      });
    }
  }

  getDashboard() {
    this.listMaster.getDashboard().subscribe(data => {
      if (data.status) {
        this.breakdown = data.data.breakdown;
        this.pr = data.data.pms;
        this.indent = data.data.indent
      }
    });
  }

  async getOffLineAssetList() {
    const friendsObservable = liveQuery (() => db.asset.toArray());
    const sub = friendsObservable.subscribe({
      next:(data) => {
        console.log(data);
        if (data.length > 0) {
          this.presentAlertConfirm();
        }
        setTimeout(() => {
          sub.unsubscribe();
        }, 1000);
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Offline Data',
      message: 'You have some offline Data Save, do you want to push to server',
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
          handler: (data) => {
            console.log("Cancel");
          }
        },{
          text: 'YES',
          handler: (data) => {
            this.router.navigateByUrl('/list-master/offline-data');
          }
        }]
    });
    await alert.present();
  }




  ionViewWillLeave() {
    this.dismissloading();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Press again to exit',
      duration: 3000
    });
    toast.present();
  }

  getMenuDetail() {
    this.isMenuLoading = true;
    this.listMaster.getMenuDetail().then(data => {
      this.result = data;
      this.isMenuLoading = false;
      if (this.result.status == true) {
        this.myMenu = this.result.data[0].submenu;
        localStorage.setItem('home_menu', JSON.stringify(this.myMenu));
      }
    }, err => {
      this.isMenuLoading = false
      this.common.presentToast(environment.errMsg + 'Err: Menu Details', 'danger');
    });
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  openPage(data: any) {
    this.common.checkInternet().then(res => {
      if (res) {
        if (data.link == 'not') {
          this.common.presentToast('Not activated yet', 'warning' );
          return;
        }
        if (data.smnu_id === 316 || data.smnu_id === 317) {
          this.router.navigateByUrl(data.link + '/' + data.smnu_id);
        } else {
          this.router.navigateByUrl(data.link);
        }
        return;
      } else {
        console.log(data);
        if (data.smnu_id !== 314) {
          this.common.presentToast(data.smnu_desc + ' Not Working on Offline Mode.', 'warning')
          return;
        }
        this.router.navigateByUrl(data.link);
      }
    });
  }

  routePage(url: string) {
    this.router.navigateByUrl(url);
  }
}
