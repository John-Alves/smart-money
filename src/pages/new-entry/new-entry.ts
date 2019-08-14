import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { CategoryDaoProvider } from '../../providers/category-dao/category-dao';
import { AccountProvider } from '../../providers/account/account';

@IonicPage()
@Component({
  selector: 'page-new-entry',
  templateUrl: 'new-entry.html',
})
export class NewEntryPage {
  categories = [];
  entryForm: FormGroup;

  entry = {}

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public account: AccountProvider,
              public categoryDao: CategoryDaoProvider,
              private builder: FormBuilder) {
    this.entryForm = builder.group({
      amount: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewEntryPage');
    this.loadData();
  }

  submitForm(){
    console.log("submit form");
    console.log(JSON.stringify(this.entry));
    this.insertDB();
    this.goBack();
  }

  goBack(){
    console.log("go back");
    this.navCtrl.pop();
  }

  insertDB(){
    this.account
      .addEntry(this.entry['amount'], this.entry['category_id'])
        .then(() => console.log('registro inserido'));
  }

  loadData(){
    this.categoryDao
      .getAll()
        .then((data: any[]) => this.categories = data);
  }
}
