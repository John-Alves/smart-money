import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewEntryPage } from '../new-entry/new-entry';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  entries = []

  constructor(public navCtrl: NavController, private sqlite: SQLite) {}

  addEntry(){
    console.log("Adicionar Lançamento");
    this.navCtrl.push(NewEntryPage);
  }

  ionViewDidEnter(){
    this.loadData();
  }

  loadData(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log('Banco criado com sucesso');

      db.sqlBatch(["CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL, description TEXT)"])
      .then(() => {
        console.log('Tabela criada com sucesso');
        const sql = "SELECT * FROM entries";
        const data = [];
        
        db.executeSql(sql, data)
        .then((values: any) => {
          let data;
          this.entries = [];
          
          for(let i = 0; i < values.rows.length; i++){
            data = values.rows.item(i);
            console.log(JSON.stringify(data));
            this.entries.push(data);
          }
        })
        .catch((e) => console.error("Erro ao buscar valores", JSON.stringify(e)));
      })
      .catch((e) => console.error("Erro ao criar tabelas", JSON.stringify(e)));
    })
    .catch(() => console.error("Erro ao criar BD"));
  }

  balance(db: SQLiteObject){
    const sql = "SELECT SUM(amount) AS balance FROM entries";
    const data = [];

    return db.executeSql(sql, data)
    .catch((e) => {
      console.error("Erro ao buscar valores", JSON.stringify(e));
    })
  }

  update(amount, description, id, db: SQLiteObject){
    const sql = "UPDATE entries SET amount = ?, description = ? WHERE id = ?";
    const data = [amount, description, id];

    return db.executeSql(sql, data)
    .catch((e) => {
      console.error("Erro ao atualizar valores", JSON.stringify(e));
    })
  }

  delete(id, db: SQLiteObject){
    const sql = "DELETE FROM entries WHERE id = ?";
    const data = [id];

    return db.executeSql(sql, data)
    .catch((e) => {
      console.error("Erro ao deletar registro", JSON.stringify(e));
    })

  }

  select(db: SQLiteObject){

    const sql = "SELECT * FROM entries";
    const data = [];

    return db.executeSql(sql, data)
    .catch((e) => {
      console.error("Erro ao buscar valores", JSON.stringify(e));
    })

  }
}
