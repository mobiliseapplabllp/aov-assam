import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { CommonService } from 'src/app/provider/common/common.service';
import { ListMasterService } from 'src/app/provider/list-master/list-master.service';
import { LoginService } from 'src/app/provider/login/login.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { db } from '../../provider/local-db/local-db.service';
import { liveQuery } from 'dexie';
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
  userName!: string;
  breakdown: any = {};
  pr: any = {};
  indent: any = {};
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
  };
  isInternet!: boolean;
  // htmlVar!: string;
  // cssVar!: string;
  constructor(
    private listMaster: ListMasterService,
    private toastController: ToastController,
    private loginPro: LoginService,
    private loadingController: LoadingController,
    private common: CommonService,
    private router: Router,
    private alertController: AlertController,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userData = JSON.parse(user);
      this.userName = this.userData.user_name
    }
  }

  ngOnInit() {
    // this.htmlVar = `<body id="i2dj"><div _ngcontent-ng-c1262125435="" id="drag-here"><div _ngcontent-ng-c1262125435="" id="drag-here-2"><textarea _ngcontent-ng-c1262125435="" rows="3" placeholder="Add Heading" class="textarea1 px-3 py-2"></textarea><textarea _ngcontent-ng-c1262125435="" rows="3" placeholder="Add Heading" class="textarea1 px-3 py-2"></textarea></div></div><div _ngcontent-ng-c1262125435="" id="i9sjy"><img _ngcontent-ng-c1262125435="" src="https://placeimg.com/300/200/nature"alt="Image" id="ifnh"/><img _ngcontent-ng-c1262125435="" src="https://placeimg.com/300/200/nature"alt="Image" id="iztw4"/><div _ngcontent-ng-c1262125435="" id="ifoy"><textarea _ngcontent-ng-c1262125435="" rows="3" placeholder="Add Heading" class="textarea1 px-3 py-2"></textarea><textarea _ngcontent-ng-c1262125435="" rows="3" placeholder="Add Heading" class="textarea1 px-3 py-2"></textarea></div><div _ngcontent-ng-c1262125435="" id="isupx"><textarea _ngcontent-ng-c1262125435="" rows="3" placeholder="Add Heading" class="textarea1 px-3 py-2"></textarea></div></div></body>`;
    // this.cssVar = "* { box-sizing: border-box; } body {margin: 0;}#ifnh{float:right;height:101px;width:527px;}#iztw4{float:right;height:101px;width:613px;}";

    // // Dynamically create a style element and set its innerHTML to the CSS
    // const style = this.renderer.createElement('style');
    // this.renderer.appendChild(this.el.nativeElement, style);
    // this.renderer.setProperty(style, 'innerHTML', this.cssVar);

    // // Dynamically create a div element and set its innerHTML to the HTML
    // const div = this.renderer.createElement('div');
    // this.renderer.appendChild(this.el.nativeElement, div);
    // this.renderer.setProperty(div, 'innerHTML', this.htmlVar);

    this.common.checkInternet().then(res => {
      if (res) {
        this.isInternet = true;
        this.common.setBarcode('');
        this.userData = this.loginPro.getLoginUserValue();
        this.getMenuDetail();
        this.getDashboard();
        this.getOffLineAssetList()
      } else {
        let menu, MENU_TEMP = localStorage.getItem('home_menu');
        if (MENU_TEMP) {
          this.myMenu = JSON.parse(MENU_TEMP);
          this.isInternet = false;
          console.log(menu);
        } else {
          this.common.presentToastWithOk('Menu Icon Not Saved in your Local DB, please connect with internet to save menu in Local DB', 'warning');
        }
      }
    });
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

  async getOffLineAssetList() {
    const friendsObservable = liveQuery (() => db.asset.toArray());
    const sub = friendsObservable.subscribe({
      next:(data) => {
        console.log(data);
        if (data.length > 0) {
          this.presentAlertConfirm();
        }
        setTimeout(() => {
          sub.unsubscribe();
        }, 1000);
      }
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Offline Data',
      message: 'You have some offline Data Save, do you want to push to server',
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
          handler: (data) => {
            console.log("Cancel");
          }
        },{
          text: 'YES',
          handler: (data) => {
            this.router.navigateByUrl('/list-master/offline-data');
          }
        }]
    });
    await alert.present();
  }


  speak() {
    const speak = async () => {
      await TextToSpeech.speak({
        text: 'This is a sample text.',
        lang: 'en',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
    };
    speak();
  }

  stopSpeak() {
    TextToSpeech.stop();
  }

  permission() {
    SpeechRecognition.requestPermissions().then(res => {
      console.log(res);
    })
  }

  listen() {
    SpeechRecognition.start({
      language: "en-US",
      maxResults: 2,
      prompt: "Say something",
      partialResults: true,
      popup: true,
    }).then(res => {
      console.log(res);
    })
  }

  removeListen() {
    SpeechRecognition.removeAllListeners();
  }


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

  getMenuDetail() {
    this.presentLoading().then(preLoad => {
      this.listMaster.getMenuDetail().then(data => {
        this.dismissloading();
        this.result = data;
        if (this.result.status == true) {
          this.myMenu = this.result.data[0].submenu;
          localStorage.setItem('home_menu', JSON.stringify(this.myMenu));
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
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  openPage(data: any) {
    this.common.checkInternet().then(res => {
      if (res) {
        if (data.link == 'not') {
          this.common.presentToast('Not activated yet', 'warning' );
          return;
        }
        if (data.smnu_id === 316 || data.smnu_id === 317) {
          this.router.navigateByUrl(data.link + '/' + data.smnu_id);
        } else {
          this.router.navigateByUrl(data.link);
        }
        return;
      } else {
        console.log(data);
        if (data.smnu_id !== 314) {
          this.common.presentToast(data.smnu_desc + ' Not Working on Offline Mode.', 'warning')
          return;
        }
        this.router.navigateByUrl(data.link);
      }
    });
  }

  routePage(url: string) {
    this.router.navigateByUrl(url);
  }
}
