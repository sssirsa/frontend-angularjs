(function () {
    angular
        .module('app')
        .factory('User', UserController);
    function UserController() {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            clearUser: clearUser,
            setUser: setUser
        };

        function getUser() {
            if (!vm.user) {
                vm.user = angular.fromJson(localStorage.getItem('user'));
            }
            return vm.user;
        }

        function clearUser() {
            vm.user = null;
            localStorage.removeItem('user');
        }

        function setUser(user) {
            //User object sanitizing 
            vm.user = {
                apellido_materno: user['apellido_materno'],
                apellido_paterno: user['apellido_paterno'],
                direccion: user['direccion'],
                establecimiento: user['establecimiento'],
                foto: user['foto'],
                id: user['id'],
                ife: user['ife'],
                nombre: user['nombre'],
                sucursal: user['sucursal'],
                telefono: user['telefono'],
                udn: user['udn'],
                user: user['user']
            };
            localStorage.setItem('user', angular.toJson(vm.user));
            //$cookies.putObject('user', vm.user);
        }

    }

})();
