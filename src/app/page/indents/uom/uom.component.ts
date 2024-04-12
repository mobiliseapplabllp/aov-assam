import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss'],
})
export class UomComponent  implements OnInit {
  myUom: any = [];
  myUomCopy: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpIndent: IndentsService,
    private loadingController: LoadingController,
    private common: CommonService
  ) { }

  ngOnInit() {
    this.getUom();
  }

  ionViewDidLeave() {
    this.myUom = [];
    this.myUomCopy = [];
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getUom() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getUom().subscribe({
        next:(data) => {
          if (data.status) {
            this.myUom = data.data;
            this.myUomCopy = data.data;
          }
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

  search(ev: any) {
    console.log(ev.target.value);
    this.myUom = this.myUomCopy;
    if (ev.target.value != '') {
      this.myUom = this.myUom.filter((data: any) => {
        if ((data.label.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (data.label.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
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


}
