/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('actionsManager', {
            templateUrl: 'app/mainApp/technical_service/components/actions/actions.tmpl.html',
            controller: actionsController,
            bindings: {
                actionsAdded: '&',
                actualStep: '<',
                actions: '<'

            }
        });
    function actionsController(URLS, ErrorHandler, EnvironmentConfig, actionProvider) {
        var vm = this;

        vm.actionsDoIt = [];

        activate();


        vm.onSelectAction = onSelectAction;
        vm.addAction = addAction;
        vm.deleteElement = deleteElement;

        function activate() {
            getActions();
            var promiseGetStage = actionProvider.getStage(vm.actualStep.id);
            promiseGetStage.then(function (currentStage) {
                vm.actions = currentStage.acciones;
            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);
            });
        }

        function getActions() {
            var index;
            if (vm.actions) {
                for (index = 0; index < vm.actions.length; ++index) {
                    vm.actionsDoIt.push(vm.actions[index]);
                }
                vm.actionsAdded({element: vm.actionsDoIt});
            }

        }


        function onSelectAction(value) {
            if (value) {
                vm.element = value;
                addAction();
            }
        }

        function addAction() {
            getDuplicity();
            vm.actionsDoIt.push(vm.element);
            vm.actionsAdded({element: vm.actionsDoIt});
            // $log.debug(vm.actionsDoIt);
        }

        function getDuplicity() {
            var index;
            for (index = 0; index < vm.actionsDoIt.length; ++index) {
                if (vm.actionsDoIt[index].com_code === vm.element.com_code) {
                    vm.actionsDoIt.splice(index, 1);
                }
            }
        }

        function deleteElement(item) {
            var index;
            for (index = 0; index < vm.actionsDoIt.length; ++index) {
                if (vm.actionsDoIt[index].com_code === item.com_code) {
                    vm.actionsDoIt.splice(index, 1);
                }
            }
            vm.actionsAdded({element: vm.actionsDoIt});
            // $log.debug(vm.actionsDoIt);
        }


    }
})();
