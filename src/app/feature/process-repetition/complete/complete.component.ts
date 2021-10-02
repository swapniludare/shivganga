import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BasicService } from 'src/app/core/service/basic.service';
import { ProcessDefinition } from '../../../core/interface/process';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent implements OnInit {
  @Input() processRepetitionId: string;
  @Input() process: string;
  @Input() ItemList :any;
  public processRepetition : {};
  public completeForm:FormGroup;
  public outputValues :any;
  public submitAttempt = false;
  public itemStock = {};
  constructor(private modal:ModalController, private serve:BasicService) { 
  }

  ngOnInit() {
    this.completeForm = new FormGroup({});
    /* this.serve.getProcessRepetition(this.processRepetitionId).subscribe(d=>{
      this.processRepetition = d;
    }); */
    this.serve.getOutputValue(this.process).subscribe(d=>{
      this.outputValues = d.map(t=>{
        return {
          id:t.payload.doc.id,
          ...t.payload.doc.data() as ProcessDefinition
        }
      });
      for(let i in this.outputValues) {
        let sku = this.outputValues[i]['sku'];
        this.completeForm.addControl(sku,new FormControl('',[Validators.required]));
        this.itemStock[sku] = this.getItemDetails(sku,'stock');
      }
    });
  }

  dismiss() {
    this.modal.dismiss({
      'dismissed': true
    });
  }

  getItemDetails(id:string,type:string) {
    return this.ItemList.find(x=>x.id==id)[type];
  }

  complete() {
    this.submitAttempt = true
    if(this.completeForm.valid) {
      this.serve.completeProcessRepetition(this.processRepetitionId,this.completeForm.value,this.itemStock);
      this.dismiss();
    }
  }

}
