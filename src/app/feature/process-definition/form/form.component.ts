import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventory } from 'src/app/core/interface/inventory';
import { BasicService } from 'src/app/core/service/basic.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  public processForm: FormGroup;
  public ingredientsForm: FormGroup;
  public resultItemForm: FormGroup;
  public ItemList: Inventory[];
  public ingredientCnt = 0;
  public resultItemCnt = 0;
  public ingrediantsFormError = false;
  public resultItemFormError = false;
  submitAttempt = false;
  validation_message = {
    name : [
      { type : 'required' , msg : 'Name is required' },
    ],
    remark : [
      { type : 'required' , msg : 'Remark is required'}
    ],
    time: [
      { type: 'required', msg: 'Time is required'},
      { type:'maxlength', msg: 'Please enter valid time'}
    ],
    item: [
      { type: 'required', msg: 'Item is required'},
    ]
  }
  constructor(private serve:BasicService,private router: Router) { 
    this.serve.getAll('inventory').subscribe((res) => {
      this.ItemList = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as Inventory
        };
      });
    });
  }

  ngOnInit() {
    this.processForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      remark: new FormControl('',[Validators.required]),
      time: new FormControl('',[Validators.required,Validators.maxLength(3)]),
    });
    this.ingredientsForm = new FormGroup({
      ingredient0: new FormControl('',[Validators.required])
    })
    this.resultItemForm = new FormGroup({
      reultItem0: new FormControl('',[Validators.required])
    })    
  }

  addIngredient() {
    this.ingredientCnt++;
    this.ingredientsForm.addControl('ingredient'+this.ingredientCnt,new FormControl('',[Validators.required]));
  }

  removeIngredient(ctrl){
    if(ctrl.key!='ingredient0') {
      this.ingredientsForm.removeControl(ctrl.key);
    }
  }

  selectIngredientValue(v,target) {
    this.ingredientsForm.controls[target].setValue(v.value);
  }

  addResultItem() {
    this.resultItemCnt++;
    this.resultItemForm.addControl('reultItem'+this.resultItemCnt,new FormControl('',[Validators.required]));
  }

  removeResultItem(ctrl){
    if(ctrl.key!='reultItem0') {
      this.resultItemForm.removeControl(ctrl.key);
    }
  }

  selectResultItemValue(v,target) {
    this.resultItemForm.controls[target].setValue(v.value);
  }

  back() {
    this.router.navigate(['/process-definition'])
  }

  save() {
    this.submitAttempt = true;
    this.ingrediantsFormError = false;
    this.resultItemFormError = false;
    if(this.processForm.valid && this.ingredientsForm.valid && this.resultItemForm.valid) {
      let ingrediantsArray = [];
      let resultInput = [];
      Object.keys(this.ingredientsForm.controls).forEach(key => {
        ingrediantsArray.push(this.ingredientsForm.get(key).value);
      });
      Object.keys(this.resultItemForm.controls).forEach(key => {
        resultInput.push(this.resultItemForm.get(key).value);
      });
      this.serve.createProcessDefinition(this.processForm.get('name').value, this.processForm.get('remark').value, this.processForm.get('time').value, ingrediantsArray, resultInput);
    }
    else {
      Object.keys(this.ingredientsForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.ingredientsForm.get(key).errors;
        if (controlErrors != null) { this.ingrediantsFormError = true; }
      });
      Object.keys(this.resultItemForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.resultItemForm.get(key).errors;
        if (controlErrors != null) { this.ingrediantsFormError = true; }
      });
    }
  }

}
