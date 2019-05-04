import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {
  private dbConnection: SQLiteObject;

  constructor(private sqlite: SQLite) {
    this.initDB();
  }

  get db(): SQLiteObject {
    return this.dbConnection;
  }

  private initDB(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.dbConnection = db;
      // this.dropTables();
      this.createTables();
      this.loadRecords();
    })
    .catch(e => console.error("Error on load db: ", JSON.stringify(e)));
  }

  private createTables(){
    console.log('creating table.');

    this.dbConnection.sqlBatch([
      ["CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL, color CHARACTER(9) default '#ffffff', is_default BOOLEAN);"],
      ["CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL NOT NULL, description TEXT, entry_at DATETIME NOT NULL, is_init BOOLEAN, category_id INTEGER);"],
    ])
    .then(() => console.log('tables created successfully'))
    .catch(e => console.error('error on create tables', JSON.stringify(e)));
  }

  private loadRecords() {
    console.log('loading default data...');
    this.dbConnection.executeSql('SELECT COUNT(id) AS qtd FROM categories', [])
    .then((data: any) => {
      console.log('categories in db', data.rows.item(0).qtd);

      if (data.rows.item(0).qtd == 0) {
        this.dbConnection.sqlBatch([
          ['INSERT INTO categories (name) values (?)', ['Categoria 1']],
          ['INSERT INTO categories (name) values (?)', ['Categoria 2']],
          ['INSERT INTO categories (name) values (?)', ['Categoria 3']]
        ])
        .then(() => console.log('default categories added'))
        .catch(e => console.error('error on create default categories', JSON.stringify(e)));
      }
    })
    .catch(e => console.error('error on get categories quantity', JSON.stringify(e)));
  }

  private dropTables() {
    console.log('dropping tables...');

    this.dbConnection.sqlBatch([
      ["DROP TABLE entries;"],
      ["DROP TABLE categories;"],
    ])
    .then(() => console.log('tables dropped successfully'))
    .catch(e => console.error('error on drop tables', JSON.stringify(e)));
  }

}
