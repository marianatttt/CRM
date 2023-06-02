import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {OrderPageComponent} from "./pages/order-page/order-page.component";

const routes: Routes = [
  {path:'', component: OrderPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
