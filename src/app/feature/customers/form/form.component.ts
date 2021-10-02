import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicService } from '../../../core/service/basic.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public id:any;
  public customerForm: FormGroup;
  public submitAttempt = false;
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
    'phone' : [
      {'type':'required','msg':'Phone is required'},
      {'type':'minlength','msg':'Phone must be at least 10 number long'},
      {'type':'maxlength','msg':'Phone cannot be more than 13 characters long.'}
    ],
    'delivery' : [
      {'type':'required','msg':'Delivery Charge is required'},
      {'type':'minlength','msg':'Delivery Charge must be at least 1 number long'},
      {'type':'maxlength','msg':'Delivery Charge cannot be more than 11 characters long.'}
    ],
    'address_line' : [
      {'type':'required','msg':'Address is required'},
      {'type':'minlength','msg':'Address must be at least 5 characters long'},
      {'type':'maxlength','msg':'Address cannot be more than 100 characters long.'}
    ],
    'area' : [
      {'type':'required','msg':'Area is required'},
      {'type':'minlength','msg':'Area must be at least 6 characters long'},
      {'type':'maxlength','msg':'Area cannot be more than 50 characters long.'}
    ],
    'city' : [
      {'type':'required','msg':'City is required'},
      {'type':'minlength','msg':'City must be at least 4 characters long'},
      {'type':'maxlength','msg':'City cannot be more than 15 characters long.'}
    ],
    'state' : [
      {'type':'required','msg':'State is required'},
      {'type':'minlength','msg':'State must be at least 4 characters long'},
      {'type':'maxlength','msg':'State cannot be more than 20 characters long.'}
    ],
    'zip' : [
      {'type':'required','msg':'Zip is required'},
      {'type':'minlength','msg':'Zip must be at least 6 characters long'},
      {'type':'maxlength','msg':'Zip cannot be more than 6 characters long.'}
    ],
  }
  constructor(private route:Router, private serve:BasicService, private activatedRoute:ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id!=null) {
      this.serve.get('customer',this.id).subscribe(customer=>{
        this.customerForm = new FormGroup({
          first_name: new FormControl(customer['first_name'],[Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
          last_name: new FormControl(customer['last_name'],[Validators.required,,Validators.minLength(5),Validators.maxLength(20)]),
          phone: new FormControl(customer['phone'],[Validators.required,,Validators.minLength(10),Validators.maxLength(13)]),
          delivery: new FormControl(customer['delivery'],[Validators.required,,Validators.minLength(1),Validators.maxLength(11)]),
          address_line:new FormControl(customer['address_line'],[Validators.required,,Validators.minLength(5),Validators.maxLength(100)]),
          area:new FormControl(customer['area'],[Validators.required,,Validators.minLength(6),Validators.maxLength(50)]),
          city:new FormControl(customer['city'],[Validators.required,,Validators.minLength(4),Validators.maxLength(15)]),
          state:new FormControl(customer['state'],[Validators.required,,Validators.minLength(4),Validators.maxLength(20)]),
          zip:new FormControl(customer['zip'],[Validators.required,,Validators.minLength(6),Validators.maxLength(6)]),
        });
      })
    }
   }

   save() { 
    this.submitAttempt = true;
    if(this.customerForm.valid) {
      if(this.id!=null) {
        this.serve.update('customer',this.id,this.customerForm.value);
      } else {
        this.serve.create('customer',this.customerForm.value).then(() => {
          this.customerForm.reset();
          this.route.navigate(['/customers']);
        }).catch((err) => {
          console.log(err)
        });
      }
      
    }
   }

  ngOnInit() {
    this.customerForm = new FormGroup({
      first_name: new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      last_name: new FormControl('',[Validators.required,,Validators.minLength(5),Validators.maxLength(20)]),
      phone: new FormControl('',[Validators.required,,Validators.minLength(10),Validators.maxLength(13)]),
      delivery: new FormControl('',[Validators.required,,Validators.minLength(1),Validators.maxLength(11)]),
      address_line:new FormControl('',[Validators.required,,Validators.minLength(5),Validators.maxLength(100)]),
      area:new FormControl('',[Validators.required,,Validators.minLength(6),Validators.maxLength(50)]),
      city:new FormControl('',[Validators.required,,Validators.minLength(4),Validators.maxLength(15)]),
      state:new FormControl('',[Validators.required,,Validators.minLength(4),Validators.maxLength(20)]),
      zip:new FormControl('',[Validators.required,,Validators.minLength(6),Validators.maxLength(6)]),
    });
  }

  back() {
    this.route.navigate(['/customers']);
  }
}
