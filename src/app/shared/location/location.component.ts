import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent  implements OnInit {
  floor_id: any;
  myLocation: any = [];
  myLocationCopy: any = [];
  loading: any;
  constructor(
    private httpCommon: CommonService,
    private loadingController: LoadingController,
    private httpAsset: MyAssetGetService,
    private modalCtrl: ModalController,
    private assetSqlite: AssetSqliteService,
    private platform: Platform
  ) { }

  ngOnInit() {
    // this.getLocation();
    if (this.platform.is('capacitor')) {
      this.getLocaionFromSqlite();
    } else {
      this.myLocation = [{
        label: "Testing Location",
        value:15
      }]
    }

  }

  getLocaionFromSqlite() {
    this.assetSqlite.getLocationFromSqlite(this.floor_id).then(res => {
      this.myLocation = res;
      this.myLocationCopy = res;
    });
  }

  getLocation() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getLocation(this.floor_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.myLocation = data.data;
            this.myLocationCopy = data.data
          } else {
            this.httpCommon.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      })
    })
  }

  closeModal(val: any, status: any) {
    this.modalCtrl.dismiss(val, status);
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

  search(ev: any) {
    this.myLocation = this.myLocationCopy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.myLocation = this.myLocation.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

}
