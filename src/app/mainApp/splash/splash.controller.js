(function () {
    'use strict';

    angular
        .module('app.mainApp.splash')
        .controller('SplashController', SplashController);

    /* @ngInject */
    function SplashController($state, AuthService, $timeout, $cookies) {
        $timeout(function(){
            if($cookies.getObject('keepSession')) {
                if (AuthService.isAuthenticated()) {
                    $state.go('triangular.admin-default.welcome');
                }
                else {
                    if (AuthService.canRefreshSession()) {
                        AuthService
                            .refreshToken()
                            .then(function () {
                                $state.go('triangular.admin-default.welcome');
                            })
                            .catch(function () {
                                $state.go('login');
                            });
                    }
                    else {
                        $state.go('login');
                    }
                }
            }
            else {
                $state.go('login');
                AuthService.logout();
            }
        },3000);

    }

})();
