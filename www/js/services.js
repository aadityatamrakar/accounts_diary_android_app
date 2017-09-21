angular.module('app.services', ['angular-websql', 'ngCordova.plugins.device'])

  .factory('LocalAPI', ['$rootScope', '$webSql', '$window', function($rootScope, $webSql, $window){
    $rootScope.companies = localStorage.getItem('companies') !==null? JSON.parse(localStorage.getItem('companies')):[]
    $rootScope.company = {};

    var i;
    if ((i = localStorage.getItem('company_index')) !== null) {
      $rootScope.db = $webSql.openDatabase("gstapp_" + i, '1.0', 'GST App DB', 10 * 1024 * 1024);
      $rootScope.company = $rootScope.companies[i - 1];
    }

    return {
      init: {
        items: function (){
          $rootScope.db.createOrAlterTable('items', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP" // default value
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP" // default value
            },
            "name":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "sale_p":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "purchase_p":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "HSN":{
              "type": "TEXT",
              "null": "NULL"
            },
            "code":{
              "type": "TEXT",
              "null": "NULL"
            },
            "tax_percent":{
              "type": "INTEGER",
              "null": "NULL"
            },
            "tax_type":{
              "type": "TEXT",
              "null": "NULL"
            }
          });
        },
        banks: function (){
          $rootScope.db.createOrAlterTable('banks', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "name":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "bank_name":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "acc_no":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "opening_bal":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "opening_date":{
              "type": "TEXT",
              "null": "NULL"
            }
          });
        },
        bank_transactions: function (){
          $rootScope.db.createOrAlterTable('bank_transactions', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "type":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "bank":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "amount":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "date":{
              "type": "TEXT",
              "null": "NULL"
            },
            "desc":{
              "type": "TEXT",
              "null": "NULL"
            }
          });
        },
        party: function (){
          $rootScope.db.createOrAlterTable('party', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "name":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "phone_no":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "gstin":{
              "type": "TEXT",
              "null": "NULL"
            },
            "state":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "address":{
              "type": "TEXT",
              "null": "NULL"
            },
            "email":{
              "type": "TEXT",
              "null": "NULL"
            },
            "op_balance":{
              "type": "NUMERIC",
              "null": "NULL"
            },
            "op_date":{
              "type": "TEXT",
              "null": "NULL"
            },
            "op_type":{
              "type": "TEXT",
              "null": "NULL"
            }
          });
        },
        transactions: function (){
          $rootScope.db.createOrAlterTable('transactions', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "party":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "type":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "inv_no":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "date":{
              "type": "TEXT",
              "null": "NOT NULL"
            },
            "total_amount":{
              "type": "NUMERIC",
              "null": "NOT NULL"
            },
            "paid_amount":{
              "type": "NUMERIC",
              "null": "NULL"
            },
            "ref_no":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "desc":{
              "type": "TEXT",
              "null": "NULL"
            },
            "payment":{
              "type": "NUMBER",
              "null": "NULL"
            },
            "category":{
              "type": "TEXT",
              "null": "NULL"
            }
          });
        },
        invoice_items: function (){
          $rootScope.db.createOrAlterTable('invoice_items', {
            "id":{
              "type": "INTEGER",
              "null": "NOT NULL",
              "primary": true,
              "auto_increment": true
            },
            "created":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "updated":{
              "type": "TIMESTAMP",
              "null": "NOT NULL",
              "default": "CURRENT_TIMESTAMP"
            },
            "transaction":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "item":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "quantity":{
              "type": "NUMBER",
              "null": "NOT NULL"
            },
            "rate":{
              "type": "NUMERIC",
              "null": "NOT NULL"
            },
            "rate_inc_tax":{
              "type": "NUMERIC",
              "null": "NOT NULL"
            },
            "total_amount":{
              "type": "NUMERIC",
              "null": "NOT NULL"
            }
          });
        }
      },
      items: {
        add: function (data){
          return $rootScope.db.insert('items', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('items', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('items', {id: id});
        },
        view: function (id){
          return $rootScope.db.selectLimit('items', {id: id}, 1);
        },
        all: function (){
          return $rootScope.db.selectAll('items');
        },
      },
      party: {
        add: function (data){
          return $rootScope.db.insert('party', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('party', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('party', {id: id});
        },
        view: function (id){
          return $rootScope.db.select('party', {id: id}, 1);
        },
        all: function (){
          return $rootScope.db.selectAll('party');
        },
      },
      banks: {
        add: function (data){
          return $rootScope.db.insert('banks', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('banks', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('banks', {id: id});
        },
        view: function (id, limit){
          if (limit === null) limit = 1;
          return $rootScope.db.selectLimit('banks', {id: id}, limit);
        },
        all: function (){
          return $rootScope.db.selectAll('banks');
        },
      },
      bank_transactions: {
        add: function (data){
          return $rootScope.db.insert('bank_transactions', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('bank_transactions', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('bank_transactions', {id: id});
        },
        view: function (id, limit){
          if (limit === null) limit = 1;
          return $rootScope.db.selectLimit('bank_transactions', {id: id}, limit);
        },
        all: function (){
          return $rootScope.db.selectAll('bank_transactions');
        },
      },
      transactions: {
        add: function (data){
          return $rootScope.db.insert('transactions', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('transactions', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('transactions', {id: id});
        },
        view: function (id, limit){
          if (limit === null) limit = 1;
          return $rootScope.db.selectLimit('transactions', {id: id}, limit);
        },
        all: function (){
          return $rootScope.db.selectAll('transactions');
        },
        where: function (w){
          return $rootScope.db.selectAll('transactions', w);
        }
      },
      invoice_items: {
        add: function (data){
          return $rootScope.db.insert('invoice_items', data);
        },
        edit: function (id, data){
          return $rootScope.db.update('invoice_items', data, {id: id});
        },
        del: function (id){
          return $rootScope.db.del('invoice_items', {id: id});
        },
        view: function (id){
          return $rootScope.db.selectLimit('invoice_items', {id: id}, 1);
        },
        all: function (){
          return $rootScope.db.selectAll('invoice_items');
        },
      },
      db: function (){
        return $rootScope.db;
      },
      company: {
        create: function (data){
          data.id = $rootScope.companies.length+1;
          $rootScope.companies.push(data);
          localStorage.setItem('companies', JSON.stringify($rootScope.companies));
          $rootScope.db = $webSql.openDatabase('gstapp_'+data.id, '1.0', 'GST App DB', 10*1024*1024);
          this.init.bank_transactions();
          this.init.banks();
          this.init.invoice_items();
          this.init.items();
          this.init.party();
          this.init.transactions();
          $rootScope.company = $rootScope.companies[i-1];
        },
        load: function (i){
          $rootScope.db = $webSql.openDatabase("gstapp_"+i, '1.0', 'GST App DB', 10*1024*1024);
          $rootScope.company = $rootScope.companies[i-1];
          localStorage.setItem('company_index', i);
        }
      }
    }
  }]);
