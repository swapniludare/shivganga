import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm : FormGroup;
  public submitAttempt: boolean = false;
  public validation_message = {
    'username' : [
      {'type':'required','msg':'Please enter username.'},
    ],
    'password' : [
      {'type':'required','msg':'Please enter password.'},
    ],
  }
  constructor(public auth:AuthService, private route:Router) { 
    if(localStorage.getItem('id')!=null) this.route.navigate(['/'],{replaceUrl:true});
    this.loginForm = new FormGroup({
      username:new FormControl('', [Validators.required]),
      password:new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    
  }

  login() {
    this.submitAttempt = true;
    if(this.loginForm.valid) {
      this.auth.login(this.loginForm.controls.username.value, this.loginForm.controls.password.value);
    }
  }

}
