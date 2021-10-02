import { Component, Input, OnInit } from '@angular/core';
import { Stock } from 'src/app/core/interface/stock';
import { BasicService } from 'src/app/core/service/basic.service';
@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
})
export class StockListComponent implements OnInit {
  @Input() processRepetitionId: string;
  @Input() ItemList: any;
  public itemStockDetails: any;
  constructor(private serve:BasicService) { 
    
  }

  ngOnInit() {
    this.serve.getProcessRepetitionInputValuesAll(this.processRepetitionId).subscribe(d=>{
      this.itemStockDetails = d.map(t=>{
        return {
          id:t.payload.doc.id,
          ...t.payload.doc.data() as Stock
        }
      }) 
    })
  }

  getItemDetails(id:string,type:string) {
    return this.ItemList.find(x=>x.id==id)[type];
  }
}
