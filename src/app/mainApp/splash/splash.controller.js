(function () {
    'use strict';

    angular
        .module('app.mainApp.splash')
        .controller('SplashController', SplashController);

    /* @ngInject */
    function SplashController($state, AuthService, $timeout, $cookies) {
        var vm = this;

        $timeout(function(){
            if($cookies.getObject('keepSession')) {
                if (AuthService.isAuthenticated()) {
                    $state.go('triangular.admin-default.welcome');
                }
                else {
                    if (AuthService.canRefreshSession()) {
                        vm.refreshTokenPromise =AuthService
                            .refreshToken()
                            .then(function () {
                                $state.go('triangular.admin-default.welcome');
                            })
                            .catch(function () {
                                $state.go('login');
                                AuthService.logout();
                            });
                    }
                    else {
                        $state.go('login');
                        AuthService.logout();
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
