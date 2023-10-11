import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BarcodeComponent } from './shared/barcode/barcode.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'list-master',
    loadChildren: () => import('./page/list-master/list-master.module').then( m => m.ListMasterPageModule)
  },
  {
    path: 'add-asset',
    loadChildren: () => import('./page/add-asset/add-asset.module').then( m => m.AddAssetPageModule)
  },
  {
    path: 'complaint',
    loadChildren: () => import('./page/complaint/complaint.module').then( m => m.ComplaintPageModule)
  },
  {
    path: 'digital-checklist',
    loadChildren: () => import('./page/digital-checklist/digital-checklist.module').then( m => m.DigitalChecklistPageModule)
  },
  {
    path: 'app/attendance',
    loadChildren:() => import('./page/attendnce/attendnce.module').then(m => m.AttendncePageModule)
  },
  {
    path: 'manuals',
    loadChildren: () => import('./page/manuals/manuals.module').then( m => m.ManualsPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./page/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./page/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'menu-roaster',
    loadChildren: () => import('./page/menu-roaster/menu-roaster.module').then( m => m.MenuRoasterPageModule)
  },
  {
    path: 'pm-calibration',
    loadChildren: () => import('./page/pm-cal/pm-cal.module').then( m => m.PmCalPageModule)
  },
  {
    path: 'barcode',
    component: BarcodeComponent
  },
  {
    path: 'meal-checking',
    loadChildren: () => import('./page/meal-checkin/meal-checkin.module').then( m => m.MealCheckinPageModule)
  },
  {
    path: 'indents',
    loadChildren: () => import('./page/indents/indents.module').then( m => m.IndentsPageModule)
  },
  {
    path: 'meter',
    loadChildren: () => import('./page/meter/meter.module').then( m => m.MeterPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
