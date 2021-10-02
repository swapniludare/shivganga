import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Md5 } from 'md5-typescript';
import { BasicService } from '../../../core/service/basic.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public id : any;
  public adminToggle:boolean = false;
  public userForm: FormGroup;
  public submitAttempt = false;
  private validUsernamePattern = '^[a-zA-Z0-9]*$';
  public validation_message = {
    'first_name' : [
      {'type':'required','msg':'First Name is required'},
      {'type':'minlength','msg':'First Name must be at least 5 characters long'},
      {'type':'maxlength','msg':'First Name cannot be more than 20 characters long.'}
    ],
    'last_name' : [
      {'type':'required','msg':'Last Name is required'},
      {'type':'minlength','msg':'Last Name must be at least 5 characters long'},
      {'type':'maxlength','msg':'Last Name cannot be more than 20 characters long.'}
    ],
    'username' : [
      {'type':'required','msg':'username is required'},
      {'type':'minlength','msg':'username must be at least 5 characters long'},
      {'type':'maxlength','msg':'username cannot be more than 20 characters long.'},
      {'type':'pattern','msg':'please remove special characters or spaces.'}
    ],
    'password' : [
      {'type':'required','msg':'Password is required'},
      {'type':'minlength','msg':'Password must be at least 5 characters long'},
      {'type':'maxlength','msg':'Password cannot be more than 12 characters long.'}
    ]
  }
  constructor(private route:Router, private serve:BasicService,private activatedRoute:ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id!=null) {
      this.serve.get('users',this.id).subscribe(user=>{
        this.userForm = new FormGroup({
          first_name: new FormControl(user['first_name'],[Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
          last_name: new FormControl(user['last_name'],[Validators.required,,Validators.minLength(5),Validators.maxLength(20)]),
          username: new FormControl(user['username'], [Validators.required,Validators.minLength(5),Validators.maxLength(30), Validators.pattern(this.validUsernamePattern)]),
          password: new FormControl('',[Validators.minLength(5),Validators.maxLength(12)]),
          admin:new FormControl(user['admin'])
        });
        this.adminToggle = user['admin'];
      });
    }
   }

   save() { 
    this.submitAttempt = true;
    if(this.userForm.valid) {
      this.userForm.controls.password.setValue(Md5.init(this.userForm.controls.password.value));
      if(this.id!=null) {
        this.serve.update('users',this.id,this.userForm.value);
      } else {
        this.serve.create('users',this.userForm.value).then(() => {
          this.userForm.reset();
          this.route.navigate(['/users']);
        }).catch((err) => {
          console.log(err)
        });
      }
      
    }
   }

  ngOnInit() {
    this.userForm = new FormGroup({
      first_name: new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      last_name: new FormControl('',[Validators.required,,Validators.minLength(5),Validators.maxLength(20)]),
      username: new FormControl('', [Validators.required,Validators.minLength(5),Validators.maxLength(30), Validators.pattern(this.validUsernamePattern)]),
      password: new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(12)]),
      admin:new FormControl(false)
    });
  }

  back() {
    this.route.navigate(['/users']);
  }

}
