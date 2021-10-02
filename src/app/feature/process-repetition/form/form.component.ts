import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicService } from '../../../core/service/basic.service';
import { Process } from 'src/app/core/interface/process';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public processForm: FormGroup;
  public submitAttempt = false;
  public processList : Process[];
  public itemList = [];
  public inventoryList = [];
  public showSaveButton = false;
  public validation_message = {};
  public itemStock = {};
  constructor(private route:Router, private serve:BasicService) {
    this.serve.getAll('processes').subscribe((res) => {
      this.processList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Process
        };
      });
    });
   }

  ngOnInit() {
    this.processForm = new FormGroup({
      process: new FormControl('',[Validators.required]),
      name:  new FormControl('',[Validators.required]),
      remark:  new FormControl('',[Validators.required]),
      time:  new FormControl('',[Validators.required]),
    });
  }

  back() {
    this.route.navigate(['/process-repetition']);
  }

  selectValue(v) {
    this.processForm.controls['process'].setValue(v.value);
    this.processList.forEach(p=>{
      if(p.id==v.value) {
        this.processForm.controls['name'].setValue(p.name);
        this.processForm.controls['remark'].setValue(p.remark);
        this.processForm.controls['time'].setValue(p.time);
      }
    })
    this.serve.getProcessValues(v.value).subscribe(data=>{
      this.showSaveButton = true;
      data.map(t=>{
        let item = t.payload.doc.data();
        let sku = item['sku'];
        this.serve.get('inventory',sku).subscribe(inventory=>{
          if(this.inventoryList[sku]!='') {
            this.inventoryList[sku] = inventory['sku'];
            let stock = inventory['stock'];
            this.processForm.addControl(sku, new FormControl('',[Validators.required, Validators.min(1), Validators.max(stock)])); 
            this.validation_message[sku]=[
              { type : 'required' , msg : 'Please fill quantity for '+inventory['sku'] },
              { type : 'min' , msg : 'Minimum quantity shold not be less than 1' },
              { type : 'max' , msg : 'You have only '+stock+' '+inventory['sku']+' in stock' }
            ];
            if(!this.itemList.includes(sku)) this.itemList.push(sku);
            this.itemStock[sku] = stock;
          }
        });
      });
    });
  }

  save() {
    this.submitAttempt = true;
    if(this.processForm.valid) {
      let obj = this.processForm.value;
      let processId = obj.process;
      delete obj.process;
      let name = obj.name;
      delete obj.name;
      let remark = obj.remark;
      delete obj.remark;
      let time = obj.time;
      delete obj.time;
      this.serve.createProcessRepetition(processId, name, remark, time, obj, this.itemStock);
      this.processForm.reset;
    }
  }

}
