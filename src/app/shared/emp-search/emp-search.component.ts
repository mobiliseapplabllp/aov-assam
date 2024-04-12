import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { IndentsService } from 'src/app/provider/indents/indents.service';

@Component({
  selector: 'app-emp-search',
  templateUrl: './emp-search.component.html',
  styleUrls: ['./emp-search.component.scss'],
})
export class EmpSearchComponent  implements OnInit {
  emp_id!: string;
  loading: any;
  empList: any = [];
  constructor(
    private modalCtrl: ModalController,
    private httpIndent: IndentsService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {}

  closeModal(data: any, status: any) {
    this.modalCtrl.dismiss(data, status);
  }

  search() {
    this.presentLoading().then(preLoad => {
      this.httpIndent.getEmpSearch(this.emp_id).subscribe({
        next:(data) => {
          console.log(data);
          if (data.status) {
            this.empList = data.data;
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
