import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
