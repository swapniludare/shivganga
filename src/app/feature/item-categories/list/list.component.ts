import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { ItemCategories } from '../../../core/interface/item-categories';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  itemCategoriesList:ItemCategories[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('categories').subscribe((res) => {
      this.itemCategoriesList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as ItemCategories
        };
      });
      console.log(this.itemCategoriesList);
    })
  }

  addItemCategories() {
    this.route.navigate(['/categories/add']);
  }

  edit(id) {
    this.route.navigate(['/categories/edit/'+id]);
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
            this.serve.delete('categories',id);
          }
        }
      ]
    });
    await alert.present();
  }
}
