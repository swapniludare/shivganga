import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BasicService {
  private moduleSettings = {
    customer:{
      route:'customers',
      col:'address_line',
      val:'100',
      name:'customer'
    },
    categories:{
        route: 'categories',
        col:'category',
        val:'40',
        name:'category'
    },
    UOM:{
        route:'uoms',
        col:'short',
        val:'3',
        name:'Unit of measure'
    },
    users:{
        route:'users',
        col:'first_name',
        val:'20',
        name:'User'
    },
    inventory:{
      route:'inventory',
      col:'sku',
      val:'15',
      name:'Item'
    },
    stock:{
      route:'inventory',
      col:'user',
      val:'30',
      name:'Stock'
    },
    processes: {
      route:'process-definition',
      col:'name',
      val:'30',
      name:'Process Definition'
    },
    processRepetition: {
      route:'process-repetition',
      col:'process',
      val:'processes/processes',
      name:'Process Repetition'
    }
  }
  constructor(private store:AngularFirestore, private route:Router, private toast:ToastController) { }

  create(m:string,uom:any) {
    return this.store.collection(m).add(uom).then(()=>{ this.showToast(this.moduleSettings[m].name+' added successfully.'); });
  }

  getAll(m:string) {
    return this.store.collection(m,ref=>ref.where(this.moduleSettings[m].col,'!=',this.moduleSettings[m].val)).snapshotChanges();
  }

  getAllActiveProcessRepetitions() {
    return this.store.collection('process-repetition', ref=>ref.orderBy('start', "desc")).snapshotChanges();
  }

  updateStock(id,currentStock,newStock) {
    let totalStock = parseFloat(currentStock) + parseFloat(newStock);
    this.store.collection('inventory').doc(id).update({stock:totalStock}).then(()=>{
      this.store.collection('stock').add({volume:newStock,sku:id,user:localStorage.getItem('id'),date: new Date()}).then(()=>{this.showToast('Stock added successfully.');});
    })
  }

  getLastStocks(sku:string,n:number) {
    return this.store.collection('stock',ref=>ref.where('sku','==',sku).orderBy('date', "desc").limit(n)).snapshotChanges()
  }

  delete(m:string,id:string) {
    this.store.doc(m+'/'+id).delete().then(()=>{ this.showToast(this.moduleSettings[m].name+' deleted successfully.'); });
  }

  get(m:string, id: string) {
    return this.store.collection(m).doc(id).valueChanges()
  }

  getProcessRepetition(id: string) {
    return this.store.collection('process-repetition').doc(id).valueChanges()
  }

  update(m:string, id, uom:any) {
    this.store.collection(m).doc(id).update(uom).then(()=>{
      this.showToast(this.moduleSettings[m].name+' updated successfully.');
      this.route.navigate(['/'+this.moduleSettings[m].route]);
    }).catch(err=>console.log(err))
  }

  createProcessDefinition(name:string,remark:string,time:number,collectionItems:Array<any>,resultItems:Array<any>) {
    this.store.collection('processes').add({name:name, remark:remark, time:(time*3600000)}).then(docRef=>{
      let id= (docRef) ? (<DocumentReference>docRef).id : 'void';
      for(let col of collectionItems) {
        this.store.collection('process-collection').add({flag:'i', process: id, sku:col});
      }
      for(let res of resultItems) {
        this.store.collection('process-collection').add({flag:'o', process: id, sku:res});
      }
      this.showToast('Process added successfully.');
      this.route.navigate(['/process-definition']);
    });
  }

  processDelete(id:string) {
    this.store.collection('process-collection',ref=>ref.where('process','==',id)).snapshotChanges().forEach((doc)=>{
      doc.map((t)=>{
        this.store.doc('process-collection/'+t.payload.doc.id).delete();
      });
    });
    this.delete('processes',id);
  }

  getProcessValues (processId: string) {
    return this.store.collection('process-collection',ref=>ref.where('process','==',processId).where('flag','==','i')).snapshotChanges();
  }

  getOutputValue(processId: string) {
    return this.store.collection('process-collection',ref=>ref.where('process','==',processId).where('flag','==','o')).snapshotChanges();
  }

  getProcessRepetitionInputValuesAll (processId: string) {
    return this.store.collection('stock',ref=>ref.where('processRepId','==',processId)).snapshotChanges();
  }

  createProcessRepetition(processId:string, name:string, remark:string, time:number, items:any, stock:{}) {
    this.store.collection('process-repetition').add({process: processId, start: new Date()}).then((docRef)=>{
      let id= (docRef) ? (<DocumentReference>docRef).id : 'void';
      Object.keys(items).forEach(e => {
        let currentStock = parseFloat(stock[e]);
        let newStock = parseFloat(items[e]) * -1;
        let totalStock = currentStock + newStock;
        this.store.collection('inventory').doc(e).update({stock:totalStock}).then(()=>{
          this.store.collection('stock').add({volume:newStock,sku:e,user:localStorage.getItem('id'),date: new Date(), processRepId: id});
        })
      });
    }).then(()=>{
      this.showToast('Process "'+name+'" added successfully.');
      this.route.navigate(['/process-repetition']);
    });
  }

  completeProcessRepetition(processRepetitionId:string, items:any, stock:any) {
    console.log(processRepetitionId);
    console.log(items);
    console.log(stock);
    this.store.collection('process-repetition').doc(processRepetitionId).update({end:new Date()}).then(ref=>{
      Object.keys(items).forEach(e => {
        let currentStock = parseFloat(stock[e]);
        let newStock = parseFloat(items[e]);
        let totalStock = currentStock + newStock;
        this.store.collection('inventory').doc(e).update({stock:totalStock}).then(()=>{
          this.store.collection('stock').add({volume:newStock,sku:e,user:localStorage.getItem('id'),date: new Date(), processRepId: processRepetitionId});
        })
      });
    });
  }

  async showToast(msg:string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1500,
      color:'dark'
    });
    toast.present();
  }

}
