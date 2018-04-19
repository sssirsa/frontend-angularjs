(function () {
    'use strict';

    angular
        .module('app.mainApp.login')
        .controller('loginController', loginController);

    /* @ngInject */
    function loginController($state, toastr, triSettings, $log, AuthService) {
        var vm = this;

        vm.loginClick = loginClick;

        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.user = {
            username: '',
            password: ''
        };

        function loginClick() {
            vm.loginPromise = AuthService.login(vm.user)
                .then(function () {
                    $log.debug('SuccessLogin');
                    $state.go('triangular.admin-default.bienvenida');
                })
                .catch(function (loginError) {
                    $log.error('Error login');
                    $log.error(loginError);
                    toastr.error('Error al iniciar sesión');
                });

        }

    }
})();
