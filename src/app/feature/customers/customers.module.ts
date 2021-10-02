import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListComponent, FormComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomersModule { }
