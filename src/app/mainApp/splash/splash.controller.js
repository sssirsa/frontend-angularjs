(function () {
    'use strict';

    angular
        .module('app.mainApp.splash')
        .controller('splashController', ['$state', 'AuthService', '$timeout', splashController]);

    /* @ngInject */
    function splashController($state, AuthService, $timeout) {

        var keepSession = localStorage.getItem('keepSession');

        $timeout(function(){
            if(keepSession === "true") {
                if (AuthService.isAuthenticated()) {
                    $state.go('triangular.admin-default.bienvenida');
                }
                else {
                    AuthService
                        .refreshToken()
                        .then(function () {
                            $state.go('triangular.admin-default.bienvenida');
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
