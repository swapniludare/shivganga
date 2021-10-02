import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { Process } from '../../../core/interface/process';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  processList:Process[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('processes').subscribe((res) => {
      this.processList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Process
        };
      });
    })
  }

  addprocess() {
    this.route.navigate(['/process-definition/add']);
  }

  edit(id) {
    this.route.navigate(['/process-definition/edit/'+id]);
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
            this.serve.processDelete(id);
          }
        }
      ]
    });
    await alert.present();
  }
}
