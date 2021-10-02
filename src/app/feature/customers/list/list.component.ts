import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { Customer } from '../../../core/interface/customer';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  customerList:Customer[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('customer').subscribe((res) => {
      this.customerList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Customer
        };
      });
      console.log(this.customerList);
    })
  }

  add() {
    this.route.navigate(['/customers/add']);
  }

  edit(id) {
    this.route.navigate(['/customers/edit/'+id]);
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
            this.serve.delete('customer',id);
          }
        }
      ]
    });
    await alert.present();
  }
}
