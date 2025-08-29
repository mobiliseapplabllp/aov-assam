import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { IndentsService } from 'src/app/provider/indents/indents.service';
import { IndAckComponent } from '../ind-ack/ind-ack.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-indent-card',
  templateUrl: './indent-card.component.html',
  styleUrls: ['./indent-card.component.scss'],
})
export class IndentCardComponent implements OnInit {
  @Input() data: any;
  @Input() type: any;
  @Output() greetEvent = new EventEmitter();
  loading: any;

  constructor(
    private common: CommonService,
    private httpIndent: IndentsService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    // console.log(this.data);
    // console.log(this.type);
  }

  openDoc(url: string) {
    this.common.openDoc(url);
  }

  cancel(data: any) {
    let arr: any = [];
    arr.push(data);
    console.log(arr);
    this.presentLoading().then(preLoad => {
      this.httpIndent.cancelIndent(arr).subscribe(data => {
        console.log(data);
        this.dismissloading();
        if (data.status) {
          this.common.presentToast(data.msg, 'success');
          this.greetEvent.emit(data);
        } else {
          this.common.presentToast(data.msg, 'warning');
        }
      });
    })
  }

  async openIndAck(data: any) {
    const modal = await this.modalCtrl.create({
      component: IndAckComponent,
      backdropDismiss: false,
      cssClass: 'my-modal',
      componentProps: {
        req_data: data
      }
    });
    modal.onWillDismiss().then(disModal => {
      if (disModal.role === 'true') {
        this.greetEvent.emit(data);
      }
    });
    modal.present();
  }

  async presentAlert(data: any) {
    const confirm = await this.alertCtrl.create({
      subHeader: 'Return?',
      message: 'Are you Sure want to Confirm',
      buttons: [{
        text: 'Disagree',
        handler: () => {
          console.log('Disagree clicked');
        }
      }, {
        text: 'Agree',
        handler: () => {
          this.actionReturn(data)
          console.log('Agree clicked');
        }
      }]
    });
    await confirm.present();
  }

  actionReturn(data: any) {
    this.common.presentLoading().then(preLoad => {
      this.httpIndent.returnToWh(data.rqst_id).subscribe({
        next: (dat: any) => {
          if (dat.status) {
            this.common.presentToast(dat.info, 'success');
            this.greetEvent.emit(data);
          } else {
            this.common.presentToast(dat.info, 'warning');
          }
        },
        error: () => {
          this.common.dismissloading();
          this.common.presentToast(environment.errMsg, 'danger');
        },
        complete: () => {
          this.common.dismissloading();
        }
      });
    })

  }



  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await this.loading.present();
  }

  async dismissloading() {
    this.loading.dismiss();
  }

}
