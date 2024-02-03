import { Component, OnInit } from '@angular/core';
import { db } from '../../../provider/local-db/local-db.service';
import { liveQuery } from 'dexie';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { LoadingController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offline-data',
  templateUrl: './offline-data.component.html',
  styleUrls: ['./offline-data.component.scss'],
})
export class OfflineDataComponent  implements OnInit {
  offlineAssetList: any = [];
  loading: any;
  constructor(
    private httpAsset: MyAssetGetService,
    private loadingController: LoadingController,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.getOffLineAssetList();
  }

  async getOffLineAssetList() {
    const friendsObservable = liveQuery (() => db.asset.toArray());
    const sub = friendsObservable.subscribe({
      next:(data) => {
        console.log(data);
        this.offlineAssetList = data;
        setTimeout(() => {
          sub.unsubscribe();
        }, 1000);
      }
    });
  }

  saveToServer(dat: any) {
    console.log(dat);
    let formData = new FormData();
    for (let key in dat) {
      formData.append(key, dat[key])
    }
    this.submitAsset(formData, dat);
  }

  submitAsset(formData: any, dat: any) {
    this.presentLoading().then(preLoad => {
      this.httpAsset.submitAsset(formData).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.common.presentToast(data.msg, 'success');
            this.deleteAssetCondition(dat.ext_asset_id);
          } else {
            this.common.presentToast(data.msg, 'warning');
          }

        },
        error:() => {
          this.common.presentToast(environment.errMsg, 'danger');
          this.dismissloading();
        },
        complete:() => {
          this.dismissloading();
        }
      });
    })

  }

  deleteAssetCondition(ext_asset_id: string) {
    console.log('delte condition');
    console.log(ext_asset_id);
    this.offlineAssetList = this.offlineAssetList.filter((val: any) => val.ext_asset_id != ext_asset_id)
    this.deleteAssetOffline(ext_asset_id);
  }

  async deleteAssetOffline(ext_asset_id: any) {
    await db.asset.where({ext_asset_id: ext_asset_id}).delete();
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
}
