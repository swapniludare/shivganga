import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ProcessRepetitionRoutingModule } from './process-repetition-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TimerComponent } from '../../shared/components/timer/timer.component';
import { CompleteComponent } from './complete/complete.component';
import { StockListComponent } from './stock-list/stock-list.component';
@NgModule({
  declarations: [ListComponent, FormComponent, TimerComponent, CompleteComponent, StockListComponent],
  imports: [
    CommonModule,
    ProcessRepetitionRoutingModule,
    ReactiveFormsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProcessRepetitionModule { }
