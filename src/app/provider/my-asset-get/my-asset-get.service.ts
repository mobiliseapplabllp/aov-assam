import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetSqliteService } from '../asset-sqlite/asset-sqlite.service';
@Injectable({
  providedIn: 'root'
})
export class MyAssetGetService {

  constructor(
    private https: HttpClient,
    private assetSqlite: AssetSqliteService
  ) { }

  // getAssetMasterData(lastdatetime: any) {
  //   return new Promise(resolve => {
  //     this.https.get(environment.url + 'assets/reporting/assetMasterData?systemDateTime=' + lastdatetime).subscribe({
  //       next:(data) => {
  //         resolve(data);
  //       },
  //       error:() => {
  //         resolve(false);
  //       }
  //     });
  //   });
  // }

  getAssetMasterData(lastdatetime: any): Observable<any> {    
    return this.https.get(environment.url + 'shared/get-user-pc-offline')
  }

  insertAssetAction(data: any) {    
    return new Promise(resolve => {
      let siteDetail: any = [], blocks: any = [], building: any = [], floor: any = [], location: any = [], department: any = [], sub_department: any = [],device_group: any = [],
      device_name: any = [], device_sub_group: any = [], manufacturer: any = [],ownership: any = [],equip_status: any = [],technology_status: any = [],warranty: any = [],
      sub_centre_data: any = [];

      if (data.site_detail) {
        siteDetail = data.site_detail;
      }
      if (data.blocks) {
        blocks = data.blocks;
      }
      if (data.building) {
        building = data.building;
      }
      if (data.floor) {
        floor = data.floor;
      }
      if (data.location) {
        location = data.location;
      }
      if (data.department) {
        department = data.department;
      }
      if (data.sub_department) {
        sub_department = data.sub_department;
      }
      if (data.device_group) {
        device_group = data.device_group;
      }
      if (data.device_name) {
        device_name = data.device_name;
      }
      if (data.device_sub_group) {
        device_sub_group = data.device_sub_group;
      }
      if (data.manufacturer) {
        manufacturer = data.manufacturer;
      }
      if (data.ownership) {
        ownership = data.ownership;
      }
      if (data.equip_status) {
        equip_status = data.equip_status;
      }
      if (data.technology_status) {
        technology_status = data.technology_status;
      }
      if (data.warranty) {
        warranty = data.warranty;
      }

      if (data.sub_centre_data) {
        sub_centre_data = data.sub_centre_data;
      }

      this.assetSqlite.insertIntoSiteDetail(siteDetail).then(res => {
        this.assetSqlite.insertIntoBlock(blocks).then(res => {
          this.assetSqlite.insertIntoBuilding(building).then(res => {
            this.assetSqlite.insertIntoFloor(floor).then(res => {
              this.assetSqlite.insertIntoLocation(location).then(res => {
                this.assetSqlite.insertIntoDepartment(department).then(res => {
                  this.assetSqlite.insertIntoSubDepartment(sub_department).then(res => {
                    this.assetSqlite.insertIntoDeviceGroup(device_group).then(res => {
                      this.assetSqlite.insertIntoDeviceName(device_name).then(res => {
                        this.assetSqlite.insertIntoDeviceSubGroup(device_sub_group).then(res => {
                          this.assetSqlite.insertIntoManufacturer(manufacturer).then  (res => {
                            this.assetSqlite.insertIntoOwnership(ownership).then(res => {
                              this.assetSqlite.insertIntoEquipStatus(equip_status).then(res => {
                                this.assetSqlite.insertIntoTechnologyStatus(technology_status).then(res => {
                                  this.assetSqlite.insertIntoWarranty(warranty).then(res => {
                                    this.assetSqlite.insertIntoSubCentre(sub_centre_data).then(res => {
                                      resolve(true);
                                    });                                    
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  getDecBarcode(enc_barcode: string): Observable<any> {
    const obj = {
      text: enc_barcode
    }
    return this.https.post(environment.url + 'shared/get-dectext', obj);
  }

  getFacilityType(): Observable<any> {
    return this.https.get(environment.url + 'get_pc_cate');
  }

  getPlantByCategory(id: any): Observable<any> {
    return this.https.get(environment.url + 'get_plants_by_cat/' + id);
  }

  getBlock(id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_blocks_list/' + id);
  }

  getPrefixBarcode(id: any): Observable<any> {
    return this.https.get(environment.url + 'shared/get-pc-code-prefix/' + id);
  }

  getBuildingList(id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_buildings_list/' + id);
  }

  getBuilding(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_building?status=1');
  }

  getFloorList(id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_floors_list/' + id);
  }

  getFloor(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_floor?status=1');
  }

  getLocation(floor_id: any): Observable<any> {
    return this.https.get(environment.url + 'setups/organisation/get_locations_list/' +  floor_id)
  }

  getDepartment(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_department?status=1');
  }

  getSubDepartment(id: any): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_sub_department?status=1&department=' + id);
  }

  getDeviceGroup(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_asset_group');
  }

  getDeviceName(id: any): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_asset_subgroup/' + id);
  }

  getManufacturer(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_manufacturer?status=1');
  }

  getOwnership(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_ownership');
  }

  getEquipmentStatus(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/dropdown_for_asset_status');
  }

  getTechnology(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/sel_technology');
  }

  getWarranty(): Observable<any> {
    return this.https.get(environment.url + 'assets/settings/get_warranty?status=1');
  }

  submitAsset(formData: any): Observable<any> {
    return this.https.post(environment.url + 'assets/reporting/add_assets_action', formData);
    // return this.https.post('https://aovsshdashboard.com/Webservices/test_image.php', formData);
  }

  getDataTest(): Observable<any> {
    return this.https.get('https://www.mocky.io/v2/5c245ec630000072007a5f77?mocky-delay=10000ms');
  }

  getAssetParentId(id: any, site_id: any) : Observable<any>{
    const obj = {
      ext_asset_id: id,
      site_id: site_id
    }
    return this.https.post(environment.url + 'assets/reporting/get_asset_parent_id_details', obj);
  }
}
