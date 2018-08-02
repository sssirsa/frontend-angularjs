(function () {
    'use strict';

    angular
        .module('app.mainApp.login')
        .controller('loginController', ['$state', 'toastr', '$log', 'AuthService', loginController]);

    /* @ngInject */
    function loginController($state, toastr, $log, AuthService) {
        var vm = this;

        vm.loginClick = loginClick;

        vm.user = {
            username: '',
            password: ''
        };

        vm.keepSession = false;

        function loginClick() {
            vm.loginPromise = AuthService.login(vm.user)
                .then(function () {
                    localStorage.setItem('keepSession', vm.keepSession);
                    $state.go('triangular.admin-default.welcome');
                })
                .catch(function (loginError) {
                    if(loginError.data.error_description==='Invalid credentials given.'){
                        toastr.warning('Usuario o contraseña inválidos');
                    }
                    else {
                        toastr.error('Error al iniciar sesión');
                    }
                    $log.error('Error login');
                    $log.error(loginError);
                });

        }

    }
})();
