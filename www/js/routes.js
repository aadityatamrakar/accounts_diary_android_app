angular.module('app.routes', ['ngCordova.plugins.device'])

  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('deviceLicense', {
        url: '/deviceLicense',
        templateUrl: 'templates/device_registration.html',
        controller: 'deviceLicenseCtrl'
      })

      .state('unlockDevice', {
        url: '/unlockDevice',
        templateUrl: 'templates/unlockdevice.html',
        controller: 'unlockDeviceCtrl'
      })

      .state('tabsController.party', {
        url: '/party',
        params: {
          edit: "no",
          id: ""
        },
        views: {
          'party_tab': {
            templateUrl: 'templates/party.html',
            controller: 'partyCtrl'
          }
        }
      })

      .state('tabsController.transactions', {
        url: '/transactions',
        views: {
          'transaction_tab': {
            templateUrl: 'templates/transactions.html',
            controller: 'transactionsCtrl'
          }
        }
      })

      .state('tabsController.reports', {
        url: '/reports',
        views: {
          'report_tab': {
            templateUrl: 'templates/reports.html',
            controller: 'reportsCtrl'
          }
        }
      })

      .state('tabsController', {
        url: '/tabs',
        templateUrl: 'templates/tabsController.html',
        abstract:true
      })

      .state('login', {
        url: '/page5',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      })

      .state('register', {
        url: '/page6',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      })

      .state('company', {
        url: '/company',
        templateUrl: 'templates/company.html',
        controller: 'companyCtrl'
      })

      .state('tabsController.dashboard', {
        url: '/dashboard',
        views: {
          'dashboard_tab': {
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardCtrl'
          }
        }
      })

      .state('tabsController.allParties', {
        url: '/parties',
        views: {
          'party_tab': {
            templateUrl: 'templates/allParties.html',
            controller: 'allPartiesCtrl'
          }
        }
      })

      .state('tabsController.partyTransactions', {
        url: '/party_vouchers',
        params: {
          party: ""
        },
        views: {
          'party_tab': {
            templateUrl: 'templates/partyTransactions.html',
            controller: 'partyTransactionsCtrl'
          }
        }
      })

      .state('itemList', {
        url: '/items',
        templateUrl: 'templates/itemList.html',
        controller: 'itemListCtrl'
      })

      .state('item', {
        url: '/item',
        params: {
          edit: "no",
          id: ""
        },
        templateUrl: 'templates/addItem.html',
        controller: 'itemCtrl'
      })

      .state('settings', {
        url: '/settings',
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      })

      .state('tutorials', {
        url: '/tutorials',
        templateUrl: 'templates/tutorials.html',
        controller: 'tutorialsCtrl'
      })

      .state('bankAccountList', {
        url: '/bank_account',
        templateUrl: 'templates/bankAccountList.html',
        controller: 'bankAccountListCtrl'
      })

      .state('cashInHand', {
        url: '/cashinhand',
        templateUrl: 'templates/cashInHand.html',
        controller: 'cashInHandCtrl'
      })

      .state('expenseList', {
        url: '/expenses',
        templateUrl: 'templates/expenseList.html',
        controller: 'expenseListCtrl'
      })

      .state('testing', {
        url: '/testing',
        templateUrl: 'templates/testing.html',
        controller: 'testingCtrl'
      });


    $urlRouterProvider.otherwise('/page5')


  });
