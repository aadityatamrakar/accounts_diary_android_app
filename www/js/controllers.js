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

  .controller('transactionsCtrl', ['$scope', '$stateParams', '$ionicModal', 'LocalAPI',
    function ($scope, $stateParams, $ionicModal, LocalAPI) {
      $scope.toggle_item = true;
      $scope.selected = false;
      $scope.items = [];
      $scope.data = {};

      LocalAPI.items.all().then(function (result){
        for(var i=0; i<result.rows.length; i++){
          $scope.items.push(result.rows.item(i));
        }
      });

      $scope.toggle_i = function (){
        $scope.toggle_item = !$scope.toggle_item;
      };

      $ionicModal.fromTemplateUrl('/templates/addItemModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.item_modal = modal;
      });

      $scope.open_modal = function (){
        $scope.selected = false;
        $scope.item_modal.show()
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

  .controller('bankAccountListCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('cashInHandCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('expenseListCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {


    }])

  .controller('testingCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
    }])

  .controller('deviceLicenseCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.data = {};

      $scope.save = function (){

      }
    }])

  .controller('unlockDeviceCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

    }])
