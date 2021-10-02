import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { StockComponent } from './stock/stock.component';
const routes: Routes = [{
  path:'',
  component:ListComponent
},
{
  path:'add',
  component:FormComponent
},
{
  path:'edit/:id',
  component:FormComponent
},
{
  path:'stock/:id',
  component:StockComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
