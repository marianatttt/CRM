import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {AuthLayoutComponent} from "./layouts/auth-layout/auth-layout.component";
import {MainLayoutComponent} from "./layouts/main-layout/main-layout.component";

const routes: Routes = [
  {path:'', redirectTo: 'auth/login', pathMatch:'full'},
  {path: 'auth', component: AuthLayoutComponent, children:[
      {path:'login', loadChildren: () => import('./modules/auth/auth.module').then((m)=> m.AuthModule)}
    ]
  },
  { path: '', component: MainLayoutComponent, children:[
      { path: 'order', loadChildren: () => import('./modules/order/order.module').then((m) => m.OrderModule) },
      { path: 'user', loadChildren: () => import('./modules/users/users.module').then((m)=>m.UsersModule)},

    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
