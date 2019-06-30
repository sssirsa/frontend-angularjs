(function () {
    angular
        .module('app')
        .factory('User', UserController);
    function UserController($cookies) {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            setUser: setUser
        };

        function getUser() {
            if (!vm.user) {
                vm.user = $cookies.getObject('user');
            }
            return vm.user;
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
                //permissions:user['permissions'],
                sucursal: user['sucursal'],
                telefono: user['telefono'],
                udn: user['udn']
            };
            $cookies.putObject('user', vm.user);
        }

    }

})();
