(function () {
    'use strict';

    angular
        .module('app.mainApp.login')
        .controller('loginController', ['$state', 'toastr', '$log', 'AuthService', '$cookies', loginController]);

    /* @ngInject */
    function loginController($state, toastr, $log, AuthService, $cookies) {
        var vm = this;

        console.debug($cookies.get('keepSession'));

        vm.loginClick = loginClick;

        vm.user = {
            username: '',
            password: ''
        };

        vm.keepSession = false;

        function loginClick() {
            vm.loginPromise = AuthService.login(vm.user)
                .then(function () {
                    $cookies.put('keepSession', vm.keepSession, {path:'/'});
                    $state.go('triangular.admin-default.bienvenida');
                })
                .catch(function (loginError) {
                    toastr.error('Error al iniciar sesión');
                    $log.error('Error login');
                    $log.error(loginError);
                });

        }

    }
})();
