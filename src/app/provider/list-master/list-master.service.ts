import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListMasterService {
  data: any
  private myMenuTemp = new BehaviorSubject([]);
  constructor(
    public https: HttpClient
  ) { }

  getMenuDetail() {
    return new Promise(resolve => {
      this.https.get(environment.url + 'setups/app-menu/get_mobile_app_mnu').subscribe({
        next:(data) => {
          this.data = data;
          this.myMenuTemp.next(this.data.data[0].submenu);
          resolve(data);
        },
        error:() => {
          resolve(false);
        }
      });
    });
  }

  getData() {
    return this.myMenuTemp;
  }

  // getMenuFromSqlite() {
  //   return new Promise(resolve => {
  //     this.sqlite.create({name: this.db, location: this.db_location}).then((db: SQLiteObject) => {
  //       db.executeSql('select * from mymenu', []).then( res => {
  //         this.myMenuSqlite = [];
  //         if (res.rows.length > 0) {
  //           for (let i = 0; i < res.rows.length; i++) {
  //             this.data = res.rows;
  //             this.myMenuSqlite.push(this.data.item(i));
  //           }
  //           this.myMenuTemp.next(this.myMenuSqlite);
  //           resolve(this.myMenuSqlite);
  //         } else {
  //           resolve(null);
  //         }
  //       }, err => {
  //         alert(JSON.stringify(err));
  //       });
  //     }, err => {
  //       alert(JSON.stringify(err));
  //     });
  //   });
  // }

  // insertIntoMyMenu(data) {
  //   this.sqlite.create({name: this.db, location: this.db_location}).then((db: SQLiteObject) => {
  //     this.insertMenuDetail = [];
  //     for (let i = 0; i < data.length; i++) {
  //       this.insertMenuDetail.push([
  //         'insert into mymenu(menu_name, menu_link, status, link_order, IconId ,IconURL, Time_Stamp) values (?,?,?,?,?,?,?)',
  //         [data[i].menu_name, data[i].menu_link, data[i].status, data[i].link_order, data[i].IconId, data[i].IconURL, data[i].Time_Stamp]
  //       ]);
  //     }
  //     setTimeout(() => {
  //       db.sqlBatch(this.insertMenuDetail).then(res => {
  //         return true;
  //       }, err => {
  //         alert(JSON.stringify(err));
  //       });
  //     }, 800);
  //   }, err => {
  //     alert(JSON.stringify(err));
  //   });
  // }

  getDashboard(): Observable<any> {
    return this.https.get(environment.url + 'complaints/dash/mobile_app_engineer_dashboard');
  }

  getPmsCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsCategoryCount');
  }

  getPmsAcionableCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsActionableCount');
  }

  getPmsResponsibleCount(): Observable<any> {
    return this.https.get(environment.url + 'pmscal/getPmsResponsibleCount');
  }

  getComplaintSummary(): Observable<any> {
    return this.https.get(environment.url + 'complaints/dash/statusCount');
  }
}
