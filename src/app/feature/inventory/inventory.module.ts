import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { StockComponent } from './stock/stock.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';

@NgModule({
  declarations: [ListComponent, FormComponent, StockComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule { }
