import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './core/service/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public isLoggedIn = new BehaviorSubject<boolean>(false);
  public isAdmin = new BehaviorSubject<boolean>(false);
  constructor(private menu: MenuController, private auth:AuthService, private platform:Platform) {
    auth.isLoggedin.subscribe(data=>{
      this.isLoggedIn.next(data);
    })
    auth.isAdmin.subscribe(data=>{
      this.isAdmin.next(data);
    })
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('hello');
        }, false);
      });
    });
  }
  logout(){
    this.auth.logout();
  }
}
