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
  public id : any;
  public uomForm: FormGroup;
  public submitAttempt = false;
  public validation_message = {
    'short' : [
      {'type':'required','msg':'Short Name is required'},
      {'type':'minlength','msg':'Short Name must be at least 2 characters long'},
      {'type':'maxlength','msg':'Short Name cannot be more than 3 characters long.'}
    ],
    'description' : [
      {'type':'required','msg':'Description is required'},
      {'type':'minlength','msg':'Description must be at least 3 characters long'},
      {'type':'maxlength','msg':'Description cannot be more than 15 characters long.'}
    ],
  }
  constructor(private route:Router, private serve:BasicService,private activatedRoute:ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id!=null) {
      this.serve.get('UOM',this.id).subscribe(uom=>{
        this.uomForm = new FormGroup({
          short: new FormControl(uom['short'],[Validators.required,Validators.minLength(2),Validators.maxLength(3)]),
          description: new FormControl(uom['description'],[Validators.required,,Validators.minLength(3),Validators.maxLength(15)]),
        });
    });
    }
   }

   save() { 
    this.submitAttempt = true;
    if(this.uomForm.valid) {
      if(this.id!=null) {
        this.serve.update('UOM',this.id,this.uomForm.value);
      } else {
        this.serve.create('UOM',this.uomForm.value).then(() => {
          this.uomForm.reset();
          this.route.navigate(['/uoms']);
        }).catch((err) => {
          console.log(err)
        });
      }
      
    }
   }

  ngOnInit() {
    this.uomForm = new FormGroup({
      short: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(3)]),
      description: new FormControl('',[Validators.required,,Validators.minLength(3),Validators.maxLength(15)]),
    });
  }

  back() {
    this.route.navigate(['/uoms']);
  }
}
