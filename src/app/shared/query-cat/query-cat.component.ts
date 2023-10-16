import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ComplaintService } from 'src/app/provider/complaint/complaint.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-query-cat',
  templateUrl: './query-cat.component.html',
  styleUrls: ['./query-cat.component.scss'],
})
export class QueryCatComponent  implements OnInit {
  issue_id: any;
  pc_id: any;
  allQueryCat: any = [];
  allQueryCatCopy: any = [];
  loading: any;
  constructor(
    private modalCtrl: ModalController,
    private httpComp: ComplaintService,
    private httpCommon: CommonService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getQueryCagegory();
  }

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  getQueryCagegory() {
    this.presentLoading().then(preLoad => {
      this.httpComp.getQueryCategoryTicket(this.issue_id, this.pc_id).subscribe({
        next:(data) => {
          if (data.status) {
            this.allQueryCat = data.data;
            this.allQueryCatCopy = data.data
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

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });
    await this.loading.present();
  }

  async dismissloading() {
    this.loading.dismiss();
  }

  search(ev: any) {
    this.allQueryCat = this.allQueryCatCopy;
    if (ev.target.value && ev.target.value.trim() !== '') {
      this.allQueryCat = this.allQueryCat.filter((dat: any) => {
        if ((dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1)) {
          return (dat.label.toString().toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        }
        return
      });
    }
  }
}
