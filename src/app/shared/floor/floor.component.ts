import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { MyAssetGetService } from 'src/app/provider/my-asset-get/my-asset-get.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss'],
})
export class FloorComponent  implements OnInit {
  bldg_id: any;
  loading: any;
  myFloor: any = [];
  myFloorCopy: any = [];
  constructor(
    private httpCommon: CommonService,
    private loadingController: LoadingController,
    private httpAsset: MyAssetGetService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log(this.bldg_id);
    this.getFloor();
  }

  getFloor() {
    this.presentLoading().then(preLoad => {
      this.httpAsset.getFloorList(this.bldg_id).subscribe({
        next:(data: any) => {
          if (data.status) {
            this.myFloor = data.data;
            this.myFloorCopy = data.data;
            // this.addAsset.get('floor_id')?.setValue('');
            // this.addAsset.get('loc_id')?.setValue('');
          }
        },
        error:() => {
          this.dismissloading();
          this.httpCommon.presentToast(environment.errMsg, 'danger');
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
    this.myFloor = this.myFloorCopy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.myFloor = this.myFloor.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }

}
