import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { DatabaseProvider } from '../../providers/database/database';

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
              private database: DatabaseProvider, 
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
    const sql = "INSERT INTO entries (amount, entry_at) VALUES (?, ?)";
    const data = [this.entry['amount'], 1];
    
    return this.database.db.executeSql(sql, data)
    .then(() => console.log('Inserido com sucesso'))
    .catch((e) => console.error("Erro ao inserir valores", JSON.stringify(e)));
  }

  loadData(){
    console.log('Tabela criada com sucesso');
    const sql = "SELECT * FROM categories";
    const data = [];
    
    return this.database.db.executeSql(sql, data)
    .then((values: any) => {
      let result;
      this.categories = [];
      
      for(let i = 0; i < values.rows.length; i++){
        result = values.rows.item(i);
        console.log(JSON.stringify(result));
        this.categories.push(result);
      }
    })
    .catch((e) => console.error("Erro ao buscar valores", JSON.stringify(e)));
  }
}
