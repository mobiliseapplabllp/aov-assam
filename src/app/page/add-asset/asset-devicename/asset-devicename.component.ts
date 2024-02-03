import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AssetSqliteService } from 'src/app/provider/asset-sqlite/asset-sqlite.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';

@Component({
  selector: 'app-asset-devicename',
  templateUrl: './asset-devicename.component.html',
  styleUrls: ['./asset-devicename.component.scss'],
})
export class AssetDevicenameComponent  implements OnInit {
  myDeviceName: any = [];
  myDeviceNameCopy: any = [];
  loading:any;
  grp_id: any;
  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private httpAsset: MyAssetGetService,
    private assetSqlite: AssetSqliteService,
    private platform: Platform
  ) { }

  ngOnInit() {
    console.log(this.grp_id);
    // this.getDeviceName();
    if (this.platform.is('capacitor')) {
      this.getDeviceNameFromSqlite();
    } else {
      this.myDeviceName = [{
        label : "ANALYZERS, LABORATORY, BLOOD GAS",
        subgrp_class : "Non-Critical" ,
        value : 1
      },{
        label : "ANALYZERS, LABORATORY, BLOOD GAS/PH",
        subgrp_class : "Non-Critical",
        value :2
      }]
    }
  }

  getDeviceNameFromSqlite() {
    this.assetSqlite.getDeviceNameFromSqlite().then(res => {
      this.myDeviceName = res;
      this.myDeviceNameCopy = res;
    })
  }

  getDeviceName() {
    this.presentLoading().then(preLaod => {
      this.httpAsset.getDeviceName(this.grp_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.myDeviceName = data.data;
            this.myDeviceNameCopy = data.data
          }
        },
        error:() => {
          this.dismissloading();
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
    let val: any;
    console.log(ev.target.value);
    val = ev.target.value;
    this.myDeviceName = this.myDeviceNameCopy;
    if (val && val.trim() !== '') {
      this.myDeviceName = this.myDeviceName.filter((dat: any) => {
        if ((dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1)) {
          return (dat.label.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return
      });
    }
  }


}
