import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { UOM } from '../../../core/interface/uom';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  uomList:UOM[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('UOM').subscribe((res) => {
      this.uomList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as UOM
        };
      });
      console.log(this.uomList);
    })
  }

  addUom() {
    this.route.navigate(['/uoms/add']);
  }

  edit(id) {
    this.route.navigate(['/uoms/edit/'+id]);
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
            this.serve.delete('UOM',id);
          }
        }
      ]
    });
    await alert.present();
  }
}
