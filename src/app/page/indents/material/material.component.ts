import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.scss'],
})
export class MaterialComponent  implements OnInit {
  myMaterial: any = [];
  loading: any;
  page=1;
  searchValue!: string;
  constructor(
    private httpIndent: IndentsService,
    private modalCtrl: ModalController,
    private common: CommonService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    const obj = {
      page: this.page,
      limit: 40,
      source: environment.source
    }
    this.getMaterial(obj);
  }

  close(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  loadData(event: any) {
    event.target.complete();
    const obj = {
      page: this.page,
      limit: 40,
      source: environment.source
    }
    this.getMaterial(obj);
  }

  getMaterial(obj: any) {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getMaterial(obj).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.myMaterial = [...this.myMaterial, ...data.data.data]
            this.page = this.page + 1;
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
      })
    })
  }

  search() {
    this.myMaterial = [];
    this.page = 1;
    const obj = {
      page: this.page,
      limit: 40,
      source: environment.source,
      key: this.searchValue
    }
    this.getMaterial(obj);
    // this.myMaterial = this.myMaterialCopy;
    // if (ev.target.value != '') {
    //   this.myMaterial = this.myMaterial.filter((data: any) => {
    //     if ((data.label.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
    //       return (data.label.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
    //     }
    //     return
    //   });
    // }
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
