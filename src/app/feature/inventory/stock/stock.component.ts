import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Inventory } from '../../../core/interface/inventory';
import { BasicService } from '../../../core/service/basic.service';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  public itemId: any;
  item: Inventory = { id:'',
                      sku: '', 
                      description:'',
                      category:'',
                      UOM:'',
                      rate:0,
                      stock:0
                    };
  stockForm : FormGroup;
  public validation_message = {
    'volume' : [
      {'type':'required','msg':'Volume is required'},
      {'type':'minlength','msg':'Volume must be at least 1 characters long'},
      {'type':'maxlength','msg':'Volume cannot be more than 6 characters long.'}
    ]
  }
  submitAttempt = false;
  public stock : any[];
  constructor(
    private serve:BasicService, 
    private activatedRoute:ActivatedRoute, 
    private router:Router) { 
    this.itemId = this.activatedRoute.snapshot.paramMap.get('id');
    this.serve.get('inventory',this.itemId).subscribe((i:Inventory)=>{
      this.item = i;
      this.stockForm = new FormGroup({
        volume: new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(6)])
      })
    });
    this.serve.getLastStocks(this.itemId, 10).subscribe((res) => {
      this.stock = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Inventory
        };
      });
    })
  }

  updateStock() {
    this.submitAttempt = true;
    if(this.stockForm.valid) {
      this.serve.updateStock(this.itemId,this.item.stock,this.stockForm.controls.volume.value);
      this.submitAttempt = false;
      this.stockForm.reset();
    }
  }

  ngOnInit() {
    this.stockForm = new FormGroup({
      volume: new FormControl()
    })
  }

}
