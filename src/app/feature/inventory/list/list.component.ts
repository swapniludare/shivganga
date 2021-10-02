import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { Inventory } from '../../../core/interface/inventory';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  inventoryList:Inventory[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('inventory').subscribe((res) => {
      this.inventoryList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Inventory
        };
      });
    })
  }

  addInventory() {
    this.route.navigate(['/inventory/add']);
  }

  edit(id) {
    this.route.navigate(['/inventory/edit/'+id]);
  }

  stock(id) {
    this.route.navigate(['/inventory/stock/'+id])
  }

  async delete(id) {
    const alert = await this.alert.create({
      header: 'Confirm delete!',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            this.serve.delete('inventory',id);
          }
        }
      ]
    });
    await alert.present();
  }
}
