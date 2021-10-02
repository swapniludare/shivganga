import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicService } from '../../../core/service/basic.service';
import { ItemCategories } from '../../../core/interface/item-categories';
import { UOM } from '../../../core/interface/uom';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public id : any;
  public inventoryForm: FormGroup;
  public submitAttempt = false;
  private validSkuPattern = '^[a-zA-Z0-9]*$';
  public categoryList: ItemCategories[];
  public UOMList: UOM[];
  public validation_message = {
    'sku' : [
      {'type':'required','msg':'sku is required'},
      {'type':'minlength','msg':'sku must be at least 3 characters long'},
      {'type':'maxlength','msg':'sku cannot be more than 15 characters long.'},
      {'type':'pattern','msg':'please remove special characters or spaces.'},
    ],
    'description' : [
      {'type':'required','msg':'Description is required'},
      {'type':'minlength','msg':'Description must be at least 5 characters long'},
      {'type':'maxlength','msg':'Description cannot be more than 100 characters long.'}
    ],
    'rate' : [
      {'type':'required','msg':'Rate is required'},
      {'type':'minlength','msg':'Rate must be at least 1 characters long'},
      {'type':'maxlength','msg':'Rate cannot be more than 11 characters long.'}
    ],
    'category' : [
      {'type':'required','msg':'Category is required'},
    ],
    'UOM': [
      {'type':'required','msg':'UOM is required'},
    ]
  }
  constructor(private route:Router, private serve:BasicService,private activatedRoute:ActivatedRoute) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.id!=null) {
      this.serve.get('inventory',this.id).subscribe(inventory=>{
        this.inventoryForm = new FormGroup({
          sku: new FormControl(inventory['sku'], [Validators.required,Validators.minLength(3),Validators.maxLength(15),Validators.pattern(this.validSkuPattern)]),
          description:new FormControl(inventory['description'], [Validators.required,Validators.minLength(5),Validators.maxLength(100)]),
          rate: new FormControl(inventory['rate'],[Validators.required,,Validators.minLength(1),Validators.maxLength(11)]),
          category: new FormControl(inventory['category'], [Validators.required]),
          UOM: new FormControl(inventory['UOM'], [Validators.required])
        });
      });
    }
    this.serve.getAll('categories').subscribe((res) => {
      this.categoryList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as ItemCategories
        };
      });
    });
    this.serve.getAll('UOM').subscribe(uom=>{
      this.UOMList = uom.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as UOM
        };
      });
    });
   }

   save() { 
    this.submitAttempt = true;
    if(this.inventoryForm.valid) {
      if(this.id!=null) {
        this.serve.update('inventory',this.id,this.inventoryForm.value);
      } else {
        this.serve.create('inventory',this.inventoryForm.value).then(() => {
          this.inventoryForm.reset();
          this.route.navigate(['/inventory']);
        }).catch((err) => {
          console.log(err)
        });
      }
    }
    else {
      console.log(this.inventoryForm.value)
    }
   }

  ngOnInit() {
    this.inventoryForm = new FormGroup({
      sku: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(15),Validators.pattern(this.validSkuPattern)]),
      description:new FormControl('', [Validators.required,Validators.minLength(5),Validators.maxLength(100)]),
      rate: new FormControl('',[Validators.required,,Validators.minLength(1),Validators.maxLength(11)]),
      category: new FormControl('', [Validators.required]),
      UOM: new FormControl('', [Validators.required]),
      stock: new FormControl(0)
    });
  }

  back() {
    this.route.navigate(['/inventory']);
  }

  selectValue(v,target) {
    this.inventoryForm.controls[target].setValue(v.value);
  }

  toUpper(v,target) {
    this.inventoryForm.controls[target].setValue(v.value.toUpperCase());
  }
}
