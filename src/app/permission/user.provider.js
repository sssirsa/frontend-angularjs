(function () {
    angular
        .module('app')
        .factory('User', ['$cookieStore', UserController]);

    function UserController($cookieStore) {
        var vm = this;

        vm.user = null;

        return {
            getUser: getUser,
            setUser: setUser
        }

        function getUser() {
            if(!vm.user){
                vm.user=$cookieStore.get('user');
            }
            return vm.user;
        }

        function setUser(user) {
            $cookieStore.put('user', user);
            vm.user = user;
        }

    }

})();
