import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { CommonService } from 'src/app/provider/common/common.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-group',
  templateUrl: './device-group.component.html',
  styleUrls: ['./device-group.component.scss'],
})
export class DeviceGroupComponent  implements OnInit {
  myDeviceGroup: any = [];
  // myDeviceGroupCopy: any = [];
  loading: any;
  constructor(
    private httpAsset: MyAssetGetService,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private common: CommonService,
    private assetSqlite: AssetSqliteService,
    private platform: Platform
  ) { }

  ngOnInit() {
    // this.getDeviceGroup();
    if (this.platform.is('capacitor')) {
      this.getDeviceGroupFromSqlite();
    } else {
      this.myDeviceGroup = [{
        label :  "Analyzer",
        rate_of_dprctn : 0,
        value : 1
      },{
        label :  "Ventilator",
        rate_of_dprctn : 0,
        value : 2
      },{
        label :  "Aspirators",
        rate_of_dprctn : 0,
        value : 3
      }]
    }

  }

  getDeviceGroupFromSqlite() {
    this.assetSqlite.getDeviceGroupFromSqlite().then(res => {
      this.myDeviceGroup = res;
      // this.myDeviceGroupCopy = res;
    }, err => {
      alert(alert(JSON.stringify(err)));
    })
  }

  getDeviceGroup() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getDeviceGroup().subscribe({
        next:(data) => {
          if (data.status) {
            this.myDeviceGroup = data.data;
            // this.myDeviceGroupCopy = data.data;
          } else {
            this.common.presentToast(data.msg, 'warning');
          }
        },
        error:() => {
          this.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete:() => {
          this.dismissloading();
        }
      });
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
    // this.myDeviceGroup = this.myDeviceGroupCopy;
    // if (ev.target.value && ev.target.value.trim() !== '') {
    //   this.myDeviceGroup = this.myDeviceGroup.filter((dat: any) => {
    //     if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
    //       return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
    //     }
    //     return
    //   });
    // }
    let label = ev.target.value;
    if (label) {
      this.getDeviceGroupBySqlite(label);
    } else {
      this.getDeviceGroupFromSqlite();
    }
  }

  getDeviceGroupBySqlite(label: string) {
    this.assetSqlite.getDeviceGroupBySearch(label).then(res => {
      console.log(res);
      this.myDeviceGroup = res;
      // this.allCostCenterCopy = res
    })
  }

}
