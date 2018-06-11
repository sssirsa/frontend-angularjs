(function () {
    'use strict';

    angular
        .module('app.mainApp.splash')
        .controller('splashController', ['$state', 'AuthService', '$cookies', '$timeout', splashController]);

    /* @ngInject */
    function splashController($state, AuthService, $cookies, $timeout) {

        var keepSession = $cookies.get('keepSession');
        console.debug(keepSession);

        $timeout(function(){
            if(keepSession == "true") {
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
                $state.go('login');
            }
        },2000);

    }

})();
