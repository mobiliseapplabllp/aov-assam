import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ListMasterService } from 'src/app/provider/list-master/list-master.service';
import { LoginService } from 'src/app/provider/login/login.service';
// import { CameraComponent } from 'src/app/shared/camera/camera.component';

@Component({
  selector: 'app-list-master',
  templateUrl: './list-master.page.html',
  styleUrls: ['./list-master.page.scss'],
})
export class ListMasterPage implements OnInit {
  myMenu: any = [];
  loading: any;
  subscription: any;
  counter = 0;
  mySlide: any = [
    {id: 'a' , img : '/assets/home_banner1/p1.jpg'},
    {id: 'a' , img : '/assets/home_banner1/p2.jpg'},
    {id: 'a' , img : '/assets/home_banner1/p3.jpg'},
  ];
  userData: any = [];
  result: any = [];
  // categorySummary: any = [];
  // responslibity: any = [];
  // compalintSummay: any = [];
  userName!: string;
  breakdown: any = {};
  pr: any = {};
  indent: any = {};
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
   };
  constructor(
    private listMaster: ListMasterService,
    private toastController: ToastController,
    private loginPro: LoginService,
    private loadingController: LoadingController,
    private common: CommonService,
    public router: Router,
    private modalCtrl: ModalController) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      this.userName = this.userData.user_name
    }

    this.getMenuDetail();
    this.getDashboard();
  }

  getDashboard() {
    this.listMaster.getDashboard().subscribe(data => {
      console.log(data);
      if (data.status) {
        this.breakdown = data.data.breakdown;
        this.pr = data.data.pms;
        this.indent = data.data.indent
      }
    });
  }

  // async openCamera() {
  //   console.log('my site');
  //   const modal = await this.modalCtrl.create({
  //     component: CameraComponent,
  //     componentProps: {  }
  //   });
  //   modal.onWillDismiss().then((disModal: any) => {
  //     console.log(disModal);
  //     if (disModal.role) {
  //       const binaryString = atob(disModal.data.split(',')[1]);
  //       const blob = new Blob([binaryString], { type: 'image/png' });
  //       console.log(blob);
  //     }
  //   });
  //   modal.present();
  // }

  ionViewDidEnter() { }

  ionViewWillLeave() {
    this.dismissloading();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Press again to exit',
      duration: 3000
    });
    toast.present();
  }


  ngOnInit() {
    this.userData = this.loginPro.getLoginUserValue();
    console.log(this.userData);
  }

  getPmsCount() {
    this.listMaster.getPmsCount().subscribe(data => {
      console.log(data);
      if (data.status) {
        // this.categorySummary = data.data
      }
    });
  }

  getPmsActionableCount() {
    this.listMaster.getPmsAcionableCount().subscribe(data => {
      console.log(data);
    });
  }

  getPmsResponsibleCount() {
    this.listMaster.getPmsResponsibleCount().subscribe(data => {
      console.log(data);
      if (data.status) {
        // this.responslibity = data.data;
      }
    });
  }

  getCompalitSummary() {
    this.listMaster.getComplaintSummary().subscribe(data => {
      console.log(data);
      if (data.status) {
        // this.compalintSummay = data.data;
      }
    });
  }

  getMenuDetail() {
    this.presentLoading().then(preLoad => {
      this.listMaster.getMenuDetail().then(data => {
        this.dismissloading();
        this.result = data;
        if (this.result.status == true) {
          this.myMenu = this.result.data[0].submenu;
        }
      }, err => {
        this.dismissloading();
      });
    });
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

  openPage(data: any) {
    if (data.link == 'not') {
      this.common.presentToast('Not activated yet', 'warning' );
      return;
    }
    this.router.navigateByUrl(data.link);
    return;
  }

  openPageTest(url: any) {
    this.router.navigateByUrl(url);
  }

}
