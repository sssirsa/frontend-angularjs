(function () {
    angular
        .module('app.mainApp.management.users')
        .controller('userDetailController', UserDetailController);
    function UserDetailController(
        $stateParams,
        USERS
    ) {
        var vm = this;

        vm.user;

        function init() {
            if (!$stateParams.person) {
                //Getting the user when page was updated
                vm.userPromise = USERS.getUserDetail($stateParams.personId)
                    .then(function (user) {
                        vm.user = user;
                    });
            }
            else {
                //Getting the user from navigation data
                vm.user = $stateParams.person;
            }
        }
        init();
    }
})();
