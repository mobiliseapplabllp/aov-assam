import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetSqliteService {
  db = environment.db;
  dbLocation = environment.db_location;
  insDataTemp: any = [];
  tempVar: any = [];
  data: any;
  constructor(
    private sqlite: SQLite
  ) { }

  insertIntoSiteDetail(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into site_detail(barcode_prefix,label,pc_desc, pc_ext_id,pc_id, value) values(?,?,?,?,?,?)',
              [d[i].barcode_prefix,d[i].label,d[i].pc_desc, d[i].pc_ext_id,d[i].pc_id, d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Site Group');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoBlock(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into blocks(label,value) values(?,?)',
              [d[i].label,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Site Group');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoBuilding(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into building(label,value) values(?,?)',
              [d[i].label,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Site Group');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoFloor(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into floor(floor_img,label,value) values(?,?,?)',
              [d[i].floor_img,d[i].label,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoLocation(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into location(label,value) values(?,?)',
              [d[i].label,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoDepartment(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into department(dept_desc,dept_ext_id,dept_id) values(?,?,?)',
              [d[i].dept_desc,d[i].dept_ext_id,d[i].dept_id]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoSubDepartment(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into sub_department(dept_desc,dept_ext_id,dept_id,sub_dept_desc,sub_dept_id) values(?,?,?,?,?)',
              [d[i].dept_desc,d[i].dept_ext_id,d[i].dept_id,d[i].sub_dept_desc,d[i].sub_dept_id]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoDeviceGroup(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into device_group(label,rate_of_dprctn,value) values(?,?,?)',
              [d[i].label,d[i].rate_of_dprctn,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoDeviceName(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into device_name(label,subgrp_class,value) values(?,?,?)',
              [d[i].label,d[i].subgrp_class,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- device_name');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }


  insertIntoDeviceSubGroup(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into device_sub_group(label,subgrp_class,value) values(?,?,?)',
              [d[i].label,d[i].subgrp_class,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoManufacturer(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into manufacturer(mnfctrer_desc,mnfctrer_ext_id,mnfctrer_id) values(?,?,?)',
              [d[i].mnfctrer_desc,d[i].mnfctrer_ext_id,d[i].mnfctrer_id]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoOwnership(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into ownership(id,label,ownership,value) values(?,?,?,?)',
              [d[i].id,d[i].label,d[i].ownership,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Ownership');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }
  insertIntoEquipStatus(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into equip_status(id,label,status_name,value) values(?,?,?,?)',
              [d[i].id,d[i].label,d[i].status_name,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoTechnologyStatus(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into technology_status(label,value) values(?,?)',
              [d[i].label,d[i].value]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  insertIntoWarranty(d: any) {
    return new Promise(resolve => {
      if (d.length === 0) {
        resolve(true);
      } else {
        this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
          this.insDataTemp = [];
          for (let i = 0 ; i < d.length ; i++) {
            this.insDataTemp.push([
              'insert into warranty(id,status,warranty) values(?,?,?)',
              [d[i].id,d[i].status,d[i].warranty]
            ]);
          }
          db.sqlBatch(this.insDataTemp).then(res => {
            resolve(true);
          } , err => {
            alert(JSON.stringify(err) + 'Err:- Floor');
          });
        } , err => {
          alert(JSON.stringify(err));
        });
      }
    });
  }

  getSiteDetailFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from site_detail', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err Site');
        });
      });
    });
  }

  getBlockFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from blocks', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err Block');
        });
      });
    });
  }

  getBuildingFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from building', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err Building');
        });
      });
    });
  }

  getFloorFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from floor', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err floor');
        });
      });
    });
  }

  getLocationFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from location', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err location');
        });
      });
    });
  }

  getDepartmentFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from department', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err department');
        });
      });
    });
  }

  getSubDepartmentFromSqlite(dept_id: any) {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from sub_department where dept_id = ?', [dept_id]).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err department');
        });
      });
    });
  }

  getDeviceGroupFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from device_group', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err device_group');
        });
      });
    });
  }

  getDeviceNameFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from device_name', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err device_group');
        });
      });
    });
  }

  getManufacturerFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from manufacturer', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err manufacturer');
        });
      });
    });
  }

  getOwnerShipFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from ownership', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err ownership');
        });
      });
    });
  }

  getEquipStatusFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from equip_status', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err equip_status');
        });
      });
    });
  }

  getTechnologyFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from technology_status', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err technology_status');
        });
      });
    });
  }

  getWarrantyFromSqlite() {
    return new Promise(resolve => {
      this.sqlite.create({name: this.db, location: this.dbLocation}).then((db: SQLiteObject) => {
        db.executeSql('select * from warranty', []).then(res => {
          this.tempVar = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.data = res.rows;
            this.tempVar.push(this.data.item(i));
          }
          resolve(this.tempVar);
        } , err => {
          alert(JSON.stringify(err) + 'Err warranty');
        });
      });
    });
  }
}
