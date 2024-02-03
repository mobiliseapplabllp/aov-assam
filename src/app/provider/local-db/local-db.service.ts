import Dexie, { Table } from 'dexie';

export interface asset {
  unique_id?: number,
  faciity_type: string,
  site_id_description: string,
  site_id: string,
  block_id: string,
  bldg_id: string,
  floor_id: string,
  floor_id_desc: string,
  loc_id: string,
  loc_id_desc: string,
  dept_id: string,
  dept_id_desc: string,
  sub_dept_id: string,
  ext_asset_id_pre: string,
  input_asset_id: number,
  ext_asset_id: string,
  client_asset_id: string,
  is_child_asset: number,
  parent_asset_id: number,
  grp_id: number,
  grp_id_desc: string,
  subgrp_id: string,
  subgrp_id_desc: string,
  subgrp_class: string,
  device_sub_cate_remark: string,
  make: string,
  model: string,
  serial_no: string,
  manufacturer_id: string,
  manufacturer_id_desc: string,
  accessories: string,
  ownership_id: string,
  ledger_ref: string,
  pur_order_no: string,
  pur_date: string,
  pur_value: string,
  install_date: string,
  is_asset: string,
  technology_id: string,
  install_by: string,
  warranty_id: number,
  warranty_start_date: string,
  warranty_end_date: string,
  vend_code: string,
  is_insured: string,
  remark: string,
  source: string,
  x_cor: string,
  y_cor: string,
  pur_invoice: any,
  asset_img: any,
  asset_img2: any,
  asset_img3: any
}

export class AppDB extends Dexie {
  asset!: Table<asset, number>;
  constructor() {
    super('ngdexieliveQuery');
    this.version(4).stores({
      asset: '++unique_id, faciity_type, site_id_description , site_id , block_id , bldg_id , floor_id , floor_id_desc ,loc_id , loc_id_desc , dept_id , dept_id_desc , sub_dept_id ,ext_asset_id_pre ,input_asset_id ,ext_asset_id,client_asset_id ,is_child_asset, parent_asset_id ,grp_id, grp_id_desc ,subgrp_id , subgrp_id_desc , subgrp_class , device_sub_cate_remark , make ,model, serial_no , manufacturer_id,manufacturer_id_desc,accessories,ownership_id,ledger_ref,pur_order_no,pur_date,pur_value,install_date,is_asset,technology_id,install_by,warranty_id,warranty_start_date,warranty_end_date,vend_code,is_insured,remark,source,x_cor,y_cor,pur_invoice,asset_img,asset_img2,asset_img3'
    });
  }

  clearChecklists() {
    return db.asset.clear();
  }
}

export const db = new AppDB();
