import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Md5 } from 'md5-typescript';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public admin = new BehaviorSubject<boolean>(false);
  constructor(private fire:AngularFirestore, private route:Router, private toast:ToastController) { }

  login(username:string,password:string) {
    this.fire.collection('users',ref=>ref.where('username','==',username).where('password','==',Md5.init(password))).snapshotChanges().subscribe((res) => {
      if(res.length>0) {
        res.map((t) => {
          let user = t.payload.doc.data();
          localStorage.setItem('id',user['username']);
          localStorage.setItem('admin',user['admin']);
          this.route.navigate(['/']);
        });  
        this.showToast('Login Success');  
      }
      else {
        this.showToast('Login Failed. Please try again.');
      }
    },(error)=>console.log(error));
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  get isAdmin() {
    let admin = localStorage.getItem('admin');
    this.admin.next((admin!=null && admin) ? true : false);
    return this.admin.asObservable();
  }

  get isLoggedin(): Observable<boolean> {
    this.loggedIn.next((localStorage.getItem('id')!=null) ? true :false);
    return this.loggedIn.asObservable();
  }

  async showToast(msg:string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 2000,
      color:'dark'
    });
    toast.present();
  }

}
