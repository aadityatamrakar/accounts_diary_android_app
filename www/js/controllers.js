angular.module('app.controllers', ['ngCordova.plugins.device'])

  .controller('partyCtrl', ['$scope', '$stateParams', 'LocalAPI', '$ionicLoading', '$ionicPopup', '$filter',
    function ($scope, $stateParams, LocalAPI, $ionicLoading, $ionicPopup, $filter) {
      $scope.data = {};
      $scope.focuson = null;
      $scope.row = {};

      if($stateParams.edit == 'yes'){
        console.log("Party Edit : Yes, ID : ", $stateParams.id);
        LocalAPI.party.view($stateParams.id).then(function (party){
          $scope.data = party.rows.item(0);
          if( $scope.data.op_date !== null && $scope.data.op_date != '')
          {
            $scope.data.op_date = new Date(parseInt(party.rows.item(0).op_date));
          }
          $scope.data.state = String(party.rows.item(0).state);
          console.log("Loaded Party Data: ", $scope.data);
        });
      }

      $scope.save_party = function (){

        if($scope.data.name !== undefined && $scope.data.name !== null && $scope.data.name.trim() !== ''){
          $scope.row = $scope.data;
          if($scope.row.op_date !== undefined || $scope.row.op_date !== null){
            $scope.row.op_date = (new Date($scope.data.op_date)).getTime();
          }
          $ionicLoading.show({template: "<ion-spinner></ion-spinner>"});
          if($stateParams.edit == 'yes'){
            LocalAPI.party.edit($scope.row.id, $scope.row).then(function (res){
              $ionicLoading.hide();
              $scope.data = {};
              $scope.row = {};
            });
          }else{
            LocalAPI.party.add($scope.row).then(function (res){
              $ionicLoading.hide();
              $scope.data = {};
            });
          }
        }else{
          $ionicLoading.show({duration: 2000, template: 'Party Name Required.', noBackdrop: true});
          $scope.focuson = "name";
        }
      };

      $scope.select_state = function (){
        if($scope.data.gstin !== undefined && $scope.data.gstin.length == 2){
          $scope.data.state = $scope.data.gstin.substr(0, 2);
        }
      };

    }])

  .controller('transactionsCtrl', ['$scope', '$stateParams', '$ionicModal', 'LocalAPI', '$ionicPopup', '$ionicLoading', '$filter',
    function ($scope, $stateParams, $ionicModal, LocalAPI, $ionicPopup, $ionicLoading, $filter) {
      $scope.toggle_item = true;
      $scope.selected = {party: false, item: false};
      $scope.items = [];
      $scope.s_items = [];
      $scope.data = {};
      $scope.parties = [];
      $scope.query = {p: {}, i: {}};
      $scope.party = {};
      $scope.n_party = {}; // Add Party Popup

      $scope.set_date = function (){
        $scope.data.date = new Date();
      };

      $scope.set_date();

      LocalAPI.items.all().then(function (result){
        for(var i=0; i<result.rows.length; i++){
          $scope.items.push(result.rows.item(i));
        }
      });

      LocalAPI.party.all().then(function (result){
        for(var i=0; i<result.rows.length; i++){
          $scope.parties.push(result.rows.item(i));
        }
      });

      $scope.toggle_i = function (){
        $scope.toggle_item = !$scope.toggle_item;
      };

      $scope.select_from_modal = function(s, i){
        if(s == 'party'){
          $scope.party = i;
        }else if(s == 'item'){
          $scope.s_items.push(i);
        }
      }

      $ionicModal.fromTemplateUrl('../templates/modal/addItem.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.item_modal = modal;
      });

      $ionicModal.fromTemplateUrl('../templates/modal/party.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.party_modal = modal;
      });

      $scope.open_modal = function (s){
        if(s == 'party'){
          $scope.party_modal.show();
        }else{
          $scope.selected.item = false;
          $scope.item_modal.show()
        }
      };

      $scope.addParty = function (){
        $scope.addPartyPopup = $ionicPopup.show({
          templateUrl: "../templates/popup/addParty.html",
          title: 'Add Party',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.n_party.name) {
                  e.preventDefault();
                } else {
                  return $scope.n_party;
                }
              }
            }
          ]
        });

        $scope.addPartyPopup.then(function(res) {
          if(res !== undefined){
            LocalAPI.party.add(res).then(function (result){
              res.id = result.insertId;
              $scope.select_party(res, 'hm');
              $scope.parties.push(res);
              $scope.n_party = {};
            });
          }
        });
      };

      $scope.select_party = function (p, c){
        $scope.data.party = p.id;
        $scope.party = p;
        if(c === 'hm') $scope.party_modal.hide();
      };

      $scope.addItem = function (item){
        if(item !== undefined && item !== null) {
          $scope.item = angular.copy(item);
          if($scope.data.type == 'sa') {
            $scope.item.rate = item.sale_p;
          }else if($scope.data.type == 'pu'){
            $scope.item.rate = item.purchase_p;
          }
          $scope.item.tax_percent = String(item.tax_percent);
        }else{
          $scope.item = {tax_percent: 0, tax_type: 'in'};
        }
        $scope.addItemPopup = $ionicPopup.show({
          templateUrl: "../templates/popup/addItem.html",
          title: 'Add Item',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Save</b>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.item.quantity && !$scope.item.name && $scope.item.rate) {
                  e.preventDefault();
                } else {
                  return $scope.item;
                }
              }
            }
          ]
        });

        $scope.addItemPopup.then(function(res) {
          if(res !== undefined){
            console.log("Popup Add Item: ", res);
            var tmp = angular.copy(res);
            $scope.item = null;
            if(res.id !== undefined && res.id !== null){
              console.log("Existing Item Added");
              $scope.s_items.push(tmp);

              if($scope.data.type == 'sa'||$scope.data.type=='sr'){
                LocalAPI.items.edit(res.id, {sale_p: res.rate}).then(function (){
                  console.log("Rate Updated.");
                  $filter('filter')($scope.items, {'id':res.id})[0].sale_p = res.rate;
                });
              }else if($scope.data.type == 'pu'||$scope.data.type=='pr'){
                LocalAPI.items.edit(res.id, {purchase_p: res.rate}).then(function (){
                  console.log("Rate Updated.");
                  $filter('filter')($scope.items, {'id':res.id})[0].purchase_p = res.rate;
                });
              }

              $ionicLoading.show({duration: 750, template: 'Added!', noBackdrop: true});
            }else{
              var ins;
              if($scope.data.type == 'sa'||$scope.data.type=='sr'){
                ins = {name: tmp.name, sale_p: tmp.rate, tax_percent: tmp.tax_percent, tax_type: tmp.tax_type};
              }else if($scope.data.type == 'pu'||$scope.data.type=='pr'){
                ins = {name: tmp.name, purchase_p: tmp.rate, tax_percent: tmp.tax_percent, tax_type: tmp.tax_type};
              }
              console.log("Inserting Item: ", ins);
              LocalAPI.items.add(ins).then(function (result){
                tmp.id = result.insertId;
                ins.id = result.insertId;
                console.log("Adding in Items: ", tmp);
                $scope.items.push(ins);
                $scope.s_items.push(tmp);
                $ionicLoading.show({duration: 750, template: 'Added!', noBackdrop: true});
              });
            }
          }
        });
      };

      $scope.get_stotal = function (){
        if($scope.item !== null && $scope.item !== {}){
          $scope.item.stotal = ($scope.item.tax_type==='in')?
            $scope.item.rate * $scope.item.quantity:
            (($scope.item.rate * (
              (100 + parseInt($scope.item.tax_percent) ) / 100 )
            ) * $scope.item.quantity);

          return $scope.item.stotal = Math.round($scope.item.stotal);
        }else return null;
      };

      $scope.calc = {
        total_amount: function(){
          if($scope.s_items.length > 0){
            $scope.data.total_amount = 0;
            $scope.s_items.forEach(function (a, b){
              $scope.data.total_amount += a.stotal;
            });
            return $scope.data.total_amount;
          }else return null;
        },
        balance: function (){
          if($scope.data.total_amount > 0){
            return $scope.data.balance = $scope.data.total_amount - $scope.data.paid_amount;
          }
        }
      };
      // $scope.select_item = function (i){
      //   console.log('SELECTED: ', i, $scope.item);
      //   $scope.item = i;
      //   $scope.item.included = (i.tax_type === 'in')?true:false;
      //   if($scope.data.type !== undefined && $scope.data.type == 'sa'&& parseInt(i.sale_p) !== 0){
      //       $scope.item.rate = i.sale_p;
      //   }else if($scope.data.type !== undefined && $scope.data.type == 'pu' && parseInt(i.sale_p) !== 0){
      //       $scope.item.rate = i.purchase_p;
      //   }
      //   $scope.item.tax_percent = String(i.tax_percent);
      //   $scope.selected = true;
      //   console.log('[] After: ', i, $scope.item);
      // }

      $scope.save = function (){
        var submit_data = null;
        if($scope.data.type !== null && $scope.data.total_amount !== undefined && $scope.data.total_amount !== 0 && ($scope.data.party!==undefined||$scope.data.type==='ex')){
          switch ($scope.data.type){
            case 'ci':
                submit_data = {date: (new Date($scope.data.date)).getTime(), party: ($scope.data.party!==undefined)?$scope.data.party:'', total_amount: $scope.data.total_amount, type: $scope.data.type, desc: ($scope.data.desc!==undefined?$scope.data.desc:'')};
              break;
            case 'co':
              submit_data = {date: (new Date($scope.data.date)).getTime(), party: ($scope.data.party!==undefined)?$scope.data.party:'', total_amount: $scope.data.total_amount, type: $scope.data.type, desc: ($scope.data.desc!==undefined?$scope.data.desc:'')};
              break;
            case 'ex':
              if($scope.data.category !== undefined && $scope.data.category !== null){
                submit_data = {date: (new Date($scope.data.date)).getTime(), party: ($scope.data.party!==undefined)?$scope.data.party:'', total_amount: $scope.data.total_amount, type: $scope.data.type, ref_no: ($scope.data.ref!==undefined?$scope.data.ref:''), desc: ($scope.data.desc!==undefined?$scope.data.desc:''), category: $scope.data.category};
              }
              break;
            default:
              submit_data = {date: (new Date($scope.data.date)).getTime(), party: ($scope.data.party!==undefined?$scope.data.party:'CASH'), total_amount: $scope.data.total_amount, type: $scope.data.type, ref_no: ($scope.data.ref!==undefined?$scope.data.ref:''), desc: ($scope.data.desc!==undefined?$scope.data.desc:''), inv_no: ($scope.data.bill_no!==undefined?$scope.data.bill_no:0), paid_amount: ($scope.data.paid_amount!==undefined?$scope.data.paid_amount:0)};
          }
        }else{
          if($scope.data.type === undefined && $scope.data.type === null){
            $ionicLoading.show({duration: 2000, template: 'Type Required.', noBackdrop: true});
          }else if($scope.data.total_amount === undefined && $scope.data.total_amount === null){
            $ionicLoading.show({duration: 2000, template: 'Total Amount Required.', noBackdrop: true});
          }else if($scope.data.category === undefined && $scope.data.category === null){
            $ionicLoading.show({duration: 2000, template: 'Category Required.', noBackdrop: true});
          }
        }

        if(submit_data !== null){
          var insertId;
          console.log("Transaction Adding: ", submit_data);
          LocalAPI.transactions.add(submit_data).then(function (result){
            insertId = result.insertId;
            console.log("Transaction Added: ", result);
            if($scope.only_sp()){
              $scope.s_items.forEach(function (item, index){
                var tmp;
                if(item.tax_type == 'in'){
                  tmp = {transaction: insertId, item: item.id, quantity: item.quantity, rate: parseInt(item.rate*(100/100+parseInt(item.tax_percent))), rate_inc_tax: item.rate, total_amount: item.stotal};
                }else{
                  tmp = {transaction: insertId, item: item.id, quantity: item.quantity, rate: item.rate, rate_inc_tax: parseInt(((100+parseInt(item.tax_percent))/100)*item.rate), total_amount: item.stotal};
                }
                console.log("Invoice Item Adding: ", tmp);
                LocalAPI.invoice_items.add(tmp).then(function (result){
                  console.log("Invoice Item Added: ", result);
                });
              });
              $scope.s_items = {};
            }

            $scope.data = {};
            $scope.party = {};
            $scope.set_date();
            $ionicLoading.show({duration: 1000, template: 'Transaction Added!', noBackdrop: true});
          });
        }
      };

      $scope.only_sp = function (){
        return $scope.data.type=='sa'||$scope.data.type=='pu'||$scope.data.type=='sr'||$scope.data.type=='pr';
      }
    }])

  .controller('reportsCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('menuCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('loginCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('registerCtrl', ['$scope', '$stateParams', 'LocalAPI', '$ionicLoading', '$state',
    function ($scope, $stateParams, LocalAPI, $ionicLoading, $state) {
      $scope.data = {};

      $scope.save_company = function (){
        var c_id = LocalAPI.company.create($scope.data);
        $scope.data = {};
        $ionicLoading.show({duration:2000, template: "Company created successfully.", noBackdrop:true});
        LocalAPI.company.load(c_id);
        $state.go('tabsController.dashboard');
      };
    }])

  .controller('companyCtrl', ['$scope', '$stateParams', 'LocalAPI', '$ionicLoading', '$rootScope', '$state',
    function ($scope, $stateParams, LocalAPI, $ionicLoading, $rootScope, $state) {
      $scope.select = function (i){
        LocalAPI.company.load(i);
        $state.go('tabsController.dashboard');
      }
    }])

  .controller('itemCtrl', ['$scope', '$stateParams', 'LocalAPI', '$ionicLoading', function($scope, $stateParams, LocalAPI, $ionicLoading){
    $scope.data = {};
    $scope.item = {};
    if($stateParams.edit === 'yes' && $stateParams.id !== ""){
      console.log("Item Edit: Yes, ID: ", $stateParams.id);
      LocalAPI.items.view($stateParams.id).then(function (result){
        $scope.item = result.rows.item(0);
        $scope.item.tax_percent = String($scope.item.tax_percent);
        $scope.purchase_price = parseInt($scope.purchase_price);
        $scope.data = $scope.item;
      });
    }

    $scope.save = function (){
      $ionicLoading.show({template: "<ion-spinner></ion-spinner>"});
      if($stateParams.edit == 'yes' && $stateParams.id !== ''){
        LocalAPI.items.edit($stateParams.id, $scope.data).then(function (result){
          $ionicLoading.hide();
          console.log(result);
          $ionicLoading.show({duration:2000, template: "Item Updated.", noBackdrop: true});
          $scope.data = {};
        });
      }else{
        LocalAPI.items.add($scope.data).then(function (result){
          $ionicLoading.hide();
          console.log(result);
          $ionicLoading.show({duration:2000, template: "Item Created.", noBackdrop: true});
          $scope.data = {};
        });
      }
    }
  }])

  .controller('dashboardCtrl', ['$scope', '$stateParams', 'LocalAPI', function ($scope, $stateParams, LocalAPI) {
    LocalAPI.init.items();
    LocalAPI.init.banks();
    LocalAPI.init.party();
    LocalAPI.init.transactions();
    LocalAPI.init.bank_transactions();
    LocalAPI.init.invoice_items();

    console.log("table created");
  }])

  .controller('allPartiesCtrl', ['$scope', '$stateParams', 'LocalAPI', '$ionicLoading', '$ionicPopup',
    function ($scope, $stateParams, LocalAPI, $ionicLoading, $ionicPopup) {
      $scope.party = [];
      $scope.delete_option = false;

      $scope.$on( "$ionicView.enter", function( scopes, states ) {
        $ionicLoading.show({template: "<ion-spinner></ion-spinner>"});
        LocalAPI.party.all().then(function (result){
          $scope.party = [];
          for(var i=0; i<result.rows.length; i++) {
            $scope.party.push(result.rows.item(i));
          }
          $ionicLoading.hide();
        });
      });

      $scope.toggle_delete = function (){
        $scope.delete_option = !$scope.delete_option;
        console.log("S: ", $scope.delete_option);
      }

      $scope.delete_party = function (p){
        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete '+p.name+' ? ',
          template: 'Are you sure you want to delete this party and its transactions ?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            $ionicLoading.show({template: "<ion-spinner></ion-spinner>"});
            LocalAPI.party.del(p.id).then(function (result){
              LocalAPI.transactions.del(p.id).then(function (result2){
                console.log(result2);
                $ionicLoading.hide();
              });
              console.log(result);
              $scope.party.splice(p, 1);
            });
          }
        });
      }

    }])

  .controller('partyTransactionsCtrl', ['$scope', '$stateParams', 'LocalAPI',
    function ($scope, $stateParams, LocalAPI) {
      $scope.party_id = $stateParams.party;
      $scope.ttype = {
        "sa": "Sales",
        "pu": "Purchase",
        "ci": "Cash-in",
        "co": "Cash-out",
        "sr": "Sale-Return",
        "pr": "Purchase-Return",
        "ex": "Expenses"
      };

      LocalAPI.party.view($stateParams.party).then(function (result){
        $scope.party = result.rows.item(0);
      });

      $scope.transactions = [];

      $scope.db.select('transactions', {
        'party': $stateParams.party
      }).then(function (result){
        $scope.transactions = [];
        for(i=0; i < result.rows.length; i++){
          $scope.transactions.push(result.rows.item(i));
        }
      });

    }])

  .controller('itemListCtrl', ['$scope', '$stateParams', 'LocalAPI',
    function ($scope, $stateParams, LocalAPI) {

      $scope.items = [];

      LocalAPI.items.all().then(function (result){
        for(var i =0; i<result.rows.length; i++){
          $scope.items.push(result.rows.item(i));
        }
      });

    }])

  .controller('settingsCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('tutorialsCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('bankAccountListCtrl', ['$scope', 'LocalAPI', '$ionicModal', '$ionicLoading',
    function ($scope, LocalAPI, $ionicModal, $ionicLoading) {
      $scope.data = {};
      $scope.banks = [];

      LocalAPI.banks.all().then(function (results) {
        for(var i=0;i<results.rows.length; i++){
          $scope.banks.push(results.rows.item(i));
        }
      });

      $ionicModal.fromTemplateUrl('../templates/modal/bank.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.bank_modal = modal;
      });

      $scope.openBankModal= function (){
        $scope.bank_modal.show();
      };

      $scope.addBank = function (){
        var b = angular.copy($scope.data);
        LocalAPI.banks.add(b).then(function (result) {
          console.log(result);
          b.id = result.insertId;
          $scope.bank_modal.hide();
          $ionicLoading.show({duration: 750, template: 'Bank Added!', noBackdrop: true});
          $scope.data = {};
          $scope.banks.push(b);
        });
      };

    }])

  .controller('cashInHandCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('expenseListCtrl', ['$scope', '$stateParams', 'LocalAPI',
    function ($scope, $stateParams, LocalAPI) {
      $scope.expenses = [];

      LocalAPI.transactions.where({"type":'ex'}).then(function (results){
        for(var i=0; i<results.rows.length; i++){
          var tmp = angular.copy(results.rows.item(i));
          tmp.date = parseInt(tmp.date);
          $scope.expenses.push(tmp);
        }
      });

    }])

  .controller('testingCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
    }])

  .controller('deviceLicenseCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams, $rootScope) {
      $scope.data = {};

      $scope.save = function (){

      }
    }])

  .controller('unlockDeviceCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    }])
