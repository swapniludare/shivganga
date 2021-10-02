import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { OrderRoutingModule } from './order-routing.module';


@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    OrderRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule { }
