/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('assignGroupDialogController',assignGroupDialogController)
        .filter('groupSearch', groupSearch);

    function assignGroupDialogController($mdDialog,Administration,groups_user)
    {
        var vm = this;
        activate();

        function activate() {
            vm.loadingPromise=Administration.allGroups().then(function (groups_response) {
                groups_user =_.pluck(groups_user,"id");

                console.log(groups_user);
                vm.groups=_.filter(groups_response, function (group) {
                    console.log(groups_user.indexOf(group.id));
                    return groups_user.indexOf(group.id) === -1;
                });
            })
        }

        vm.cancel = cancel;
        vm.submit = submit;
        function submit()
        {
            var grupos=_.filter(vm.groups, function (group) {
                return group.added===true;
            });
            //grupos =_.pluck(grupos,"id");
            $mdDialog.hide(grupos);
        }

        function cancel()
        {
            $mdDialog.cancel();
        }
    }
    function groupSearch() {
        return function (input, text) {
            if (!angular.isString(text) || text === '') {
                return input;
            }

            return _.filter(input, function (item) {
                return item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });

        };

    }
})();
