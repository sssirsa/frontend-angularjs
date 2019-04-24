/**
 * Created by Luis_Olvera on 19/07/2016.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('assignGroupDialogController', assignGroupDialogController)
        .filter('groupSearch', groupSearch);

    function assignGroupDialogController(
        $mdDialog,
        groups_user,
        Administration,
        _
    ) {
        var vm = this;
        activate();

        function activate() {
            vm.loadingPromise = Administration.allGroups().then(function (groups_response) {
                var group_array = groups_response.results;
                groups_user = _.pluck(groups_user, "id");
                
                vm.groups = _.filter(group_array, function (group) {
                    return groups_user.indexOf(group.id) === -1;
                });
            });
        }

        vm.cancel = cancel;
        vm.submit = submit;
        function submit() {
            var grupos = _.filter(vm.groups, function (group) {
                return group.added === true;
            });
            //grupos =_.pluck(grupos,"id");
            $mdDialog.hide(grupos);
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
    function groupSearch(_) {
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
