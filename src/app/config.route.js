(function() {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        // Setup the apps routes

        // 401, 404 & 500 pages
        $stateProvider
        .state('401', {
            url: '/401',
            templateUrl: '401.tmpl.html',
            controllerAs: 'vm',
            controller: function($state) {
                var vm = this;
                vm.goHome = function() {
                    $state.go('splash');
                };
            }
        })

        .state('404', {
            url: '/404',
            templateUrl: '404.tmpl.html',
            controllerAs: 'vm',
            controller: function($state) {
                var vm = this;
                vm.goHome = function() {
                    $state.go('splash');
                };
            }
        })

        .state('500', {
            url: '/500',
            templateUrl: '500.tmpl.html',
            controllerAs: 'vm',
            controller: function($state) {
                var vm = this;
                vm.goHome = function() {
                    $state.go('splash');
                };
            }
        });


        // set default routes when no path specified
        $urlRouterProvider.when('', '/main');
        $urlRouterProvider.when('/', '/main');

        // always goto 404 if route not found
        $urlRouterProvider.otherwise('/404');
    }
})();
