import { Component, OnInit } from '@angular/core';
import { BasicService } from '../../../core/service/basic.service';
import { User } from '../../../core/interface/user';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  userList:User[] = [];
  constructor(public serve:BasicService,private route:Router, private alert:AlertController) { 

  }

  ngOnInit() {
    this.serve.getAll('users').subscribe((res) => {
      this.userList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as User
        };
      });
      console.log(this.userList);
    })
  }

  addUser() {
    this.route.navigate(['/users/add']);
  }

  edit(id) {
    this.route.navigate(['/users/edit/'+id]);
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
            this.serve.delete('users',id);
          }
        }
      ]
    });
    await alert.present();
  }

}
