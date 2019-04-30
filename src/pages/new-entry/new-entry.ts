import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-new-entry',
  templateUrl: 'new-entry.html',
})
export class NewEntryPage {
  entryForm: FormGroup;

  entry = {}

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sqlite: SQLite, 
              private builder: FormBuilder) {
    this.entryForm = builder.group({
      amount: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewEntryPage');
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
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log('Banco criado com sucesso');

      db.sqlBatch(["CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL, description TEXT)"])
      .then(() => {
        console.log('Tabela criada com sucesso');
        const sql = "INSERT INTO entries (amount) VALUES (?)";
        const data = [this.entry['amount']];
        
        db.executeSql(sql, data)
        .then(() => console.log('Inserido com sucesso'))
        .catch((e) => console.error("Erro ao inserir valores", JSON.stringify(e)));
      })
      .catch((e) => console.error("Erro ao criar tabelas", JSON.stringify(e)));
    })
    .catch(() => console.error("Erro ao criar BD"));
  }
}
