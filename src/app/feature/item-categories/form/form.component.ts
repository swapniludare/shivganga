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
  public itemCategoryForm: FormGroup;
  public submitAttempt = false;
  public validation_message = {
    'category' : [
      {'type':'required','msg':'category Name is required'},
      {'type':'minlength','msg':'category Name must be at least 3 characters long'},
      {'type':'maxlength','msg':'category Name cannot be more than 40 characters long.'}
    ]
  }
  constructor(private route:Router, private serve:BasicService,private activatedRoute:ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id!=null) {
      this.serve.get('categories',this.id).subscribe(itemCategory=>{
        this.itemCategoryForm = new FormGroup({
          category: new FormControl(itemCategory['category'],[Validators.required,Validators.minLength(3),Validators.maxLength(40)])
        });
    });
    }
   }

   save() { 
    this.submitAttempt = true;
    if(this.itemCategoryForm.valid) {
      if(this.id!=null) {
        this.serve.update('categories',this.id,this.itemCategoryForm.value);
      } else {
        this.serve.create('categories',this.itemCategoryForm.value).then(() => {
          this.itemCategoryForm.reset();
          this.route.navigate(['/categories']);
        }).catch((err) => {
          console.log(err)
        });
      }
      
    }
   }

  ngOnInit() {
    this.itemCategoryForm = new FormGroup({
      category: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(40)]),
    });
  }

  back() {
    this.route.navigate(['/categories']);
  }
}
