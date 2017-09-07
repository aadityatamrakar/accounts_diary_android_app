angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('tabsController.party', {
    url: '/party',
    views: {
      'tab5': {
        templateUrl: 'templates/party.html',
        controller: 'partyCtrl'
      }
    }
  })

  .state('tabsController.transactions', {
    url: '/transactions',
    views: {
      'tab2': {
        templateUrl: 'templates/transactions.html',
        controller: 'transactionsCtrl'
      }
    }
  })

  .state('tabsController.reports', {
    url: '/reports',
    views: {
      'tab3': {
        templateUrl: 'templates/reports.html',
        controller: 'reportsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
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

  .state('tabsController.dashboard', {
    url: '/dashboard',
    views: {
      'tab1': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page5')


});