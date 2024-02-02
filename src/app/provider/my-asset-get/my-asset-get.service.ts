import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MyAssetGetService {

  constructor(
    public https: HttpClient,
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
    return this.https.get('assets/data/asset_master.json')
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
