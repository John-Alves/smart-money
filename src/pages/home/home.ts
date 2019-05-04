import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewEntryPage } from '../new-entry/new-entry';

import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  entries = [];

  constructor(public navCtrl: NavController, private database: DatabaseProvider) {}

  addEntry(){
    console.log("Adicionar Lançamento");
    this.navCtrl.push(NewEntryPage);
  }

  ionViewDidEnter(){
    this.loadData();
  }

  loadData(){
    console.log('Tabela criada com sucesso');
    const sql = "SELECT * FROM entries";
    const data = [];
    
    return this.database.db.executeSql(sql, data)
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
  }
}
