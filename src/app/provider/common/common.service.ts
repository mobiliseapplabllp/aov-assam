import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})

export class CommonService {
  public barcode!: string;
  db = environment.db;
  dbLocation = environment.db_location;
  constructor(
    private toastController: ToastController,
    public http: HttpClient,
    private sqlite: SQLite
  ) { }

  setBarcode(barcode: string) {
    this.barcode = barcode
  }

  getBarcode() {
    return this.barcode;
  }

  async presentToast(msg: any, clr: any) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: clr
    });
    toast.present();
  }

  async presentToastWithOk(data: any, clr: any) {
    const toast = await this.toastController.create({
      message: data,
      position: 'bottom',
      color: clr,
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
  }

  openDoc(url: any) {
    if (!url) {
      alert('Attachment Not Available');
      return;
    }
    console.log(url);
    let brecked;
    brecked = url.split('.');
    let ext;
    ext = brecked[brecked.length - 1];
    if (ext === 'pdf') {
      window.open(url, '_system', 'location=no,zoom=yes');
    } else {
      window.open(url, '_blank', 'location=no,zoom=yes');
    }
  }

  async checkInternet() {
    return new Promise(async resolve => {
      const status = await Network.getStatus();
      resolve(status.connected);
    });
  }

  getTableStructureFromJson() {
    return new Promise(resolve => {
      this.http.get('assets/data/createTable.json').subscribe({
        next:(data) => {
          resolve(data);
        },
        error:() => {
          alert('Err Table Structure');
          resolve(false);
        }
      })
    });
  }

  createAllTable(tablestructure: any) {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0 ; i < tablestructure.length; i ++) {
          db.executeSql(tablestructure[i].table, []).then(userdata => {
            if (i === (tablestructure.length - 1)) {
              resolve(true);
            }
          }, err => {
            alert(JSON.stringify(err));
          });
        }
      }, err => {
        alert('Sqlite:-' + JSON.stringify(err));
      });
    });
  }
}
