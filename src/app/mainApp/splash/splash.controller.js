(function () {
    'use strict';

    angular
        .module('app.mainApp.splash')
        .controller('splashController', ['$state', 'AuthService', '$timeout', '$cookies', splashController]);

    /* @ngInject */
    function splashController($state, AuthService, $timeout, $cookies) {


        $timeout(function(){
            if($cookies.getObject('keepSession')) {
                if (AuthService.isAuthenticated()) {
                    $state.go('triangular.admin-default.welcome');
                }
                else {
                    AuthService
                        .refreshToken()
                        .then(function () {
                            $state.go('triangular.admin-default.welcome');
                        })
                        .catch(function () {
                            $state.go('login');
                        });
                }
            }
            else{
                AuthService.logout();
                $state.go('login');
            }
        },3000);

    }

})();
