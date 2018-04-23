(function () {
    'use strict';

    angular
        .module('app.mainApp.login')
        .controller('loginController', loginController);

    /* @ngInject */
    function loginController($state, toastr, $log, AuthService) {
        var vm = this;

        vm.loginClick = loginClick;

        vm.user = {
            username: '',
            password: ''
        };

        function loginClick() {
            vm.loginPromise = AuthService.login(vm.user)
                .then(function () {
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
