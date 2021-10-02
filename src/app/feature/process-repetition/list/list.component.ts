import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inventory } from 'src/app/core/interface/inventory';
import { Process } from 'src/app/core/interface/process';
import { Stock } from 'src/app/core/interface/stock';
import { BasicService } from 'src/app/core/service/basic.service';
import { ProcessRepetition } from '../../../core/interface/process-repetition';
import { CompleteComponent } from '../complete/complete.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  public processRepetitionList : any[];
  public processes : Process[];
  public ItemList : Inventory[];
  public itemStockDetails : Stock[];
  public itemStock = {};
  constructor(private router:Router, private serve:BasicService, private modal:ModalController) {
    this.serve.getAll('inventory').subscribe((res) => {
      this.ItemList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Inventory
        };
      });
    });
    this.serve.getAll('processes').subscribe(res=>{
      this.processes = res.map(t=>{
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Process
        };
      });
    });
    this.serve.getAllActiveProcessRepetitions().subscribe((res) => {
      this.processRepetitionList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as ProcessRepetition
        };
      });
      for(var i in this.processRepetitionList){
        if(this.processRepetitionList[i]['id']=='process-repetition'){
          delete this.processRepetitionList[i];
        }
      }
    })
   }

   async openCompletionForm(processRepetitionId:string,process:string) {
    const modal = await this.modal.create({
      component: CompleteComponent,
      componentProps:{
        processRepetitionId:processRepetitionId,
        process:process,
        ItemList:this.ItemList
      }
    });
    return await modal.present();
  }

  ngOnInit() {}

  addProcessRep() {
    this.router.navigate(['/process-repetition/add'])
  }

  getProcessElements(id:string,type:string) {
    return this.processes.find(x=> x.id==id)[type];
  }

  getItemDetails(id:string,type:string) {
    return this.ItemList.find(x=>x.id==id)[type];
  }

}
