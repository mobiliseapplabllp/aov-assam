import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplaintPage } from './complaint.page';
import { CostCenterComponent } from '../../shared/cost-center/cost-center.component';
import { ComplaintCardsComponent } from './complaint-cards/complaint-cards.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ResponseModalComponent } from './response-modal/response-modal.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { TicketHistoryComponent } from './ticket-history/ticket-history.component';
import { TicketTypeComponent } from './ticket-type/ticket-type.component';
import { TicketWorkComponent } from './ticket-work/ticket-work.component';
import { AssignTicketComponent } from './assign-ticket/assign-ticket.component';

const routes: Routes = [
  {
    path: '',
    component: ComplaintPage
  },
  {
    path: 'cost-center',
    component: CostCenterComponent
  },
  {
    path: 'complaint-card',
    component: ComplaintCardsComponent
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent
  },
  {
    path: 'response-modal',
    component: ResponseModalComponent
  },
  {
    path: 'site-detail',
    component: SiteDetailComponent
  },
  {
    path: 'ticket-history',
    component: TicketHistoryComponent
  },
  {
    path: 'ticket-type',
    component: TicketTypeComponent
  },
  {
    path: 'ticket-work',
    component: TicketWorkComponent
  },
  {
    path: 'assign-ticket',
    component: AssignTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintPageRoutingModule {}
