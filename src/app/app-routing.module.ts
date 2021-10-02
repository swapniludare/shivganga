import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './core/auth/login/login.component';
import { SettingsComponent } from './shared/components/settings/settings.component';
const routes: Routes = [
  {
    path:'inventory',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/inventory/inventory.module').then(m=>m.InventoryModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {
    path: 'order',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/order/order.module').then(m=>m.OrderModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/users/users.module').then(m=>m.UsersModule)
  },
  {
    path: 'customers',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/customers/customers.module').then(m=>m.CustomersModule)
  },
  {
    path: 'uoms',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/unit-of-measure/unit-of-measure.module').then(m=>m.UnitOfMeasureModule)
  },
  {
    path: 'categories',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/item-categories/item-categories.module').then(m=>m.ItemCategoriesModule)
  },
  {
    path: 'process-repetition',
    canActivate: [AuthGuard],
    loadChildren: () => import('./feature/process-repetition/process-repetition.module').then(m=>m.ProcessRepetitionModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  },
  {
    path:'process-definition',
    loadChildren: () =>import('./feature/process-definition/process-definition.module').then(m=>m.ProcessDefinitionModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
