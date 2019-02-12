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
                actions: '&'

            }
        });
    function actionsController(Translate,URLS,ErrorHandler,EnvironmentConfig) {
        var vm = this;
        const actionURL =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base+ '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.action);
        vm.catalogues = {
            actions: {
                catalog: {
                    url:actionURL,
                    name: Translate.translate('ACTIONS_COMPONENT.ADD_ACTION'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'com_code',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                },
                noResults: Translate.translate('ERRORS.NO_RESULTS'),
                hint:Translate.translate('ACTIONS_COMPONENT.ADD')
            }
        };
        vm.actionsDoIt=[];

        vm.onSelectAction=onSelectAction;
        vm.addAction=addAction;
        vm.deleteElement=deleteElement;
        function onSelectAction(value) {
            console.log(value);
            vm.element=value;
            addAction();
        }
        function addAction(){

            getDuplicity();
            vm.actionsDoIt.push(vm.element);
            vm.actions({element:vm.actionsDoIt});
        }
        function getDuplicity() {
            var index;
            for (index = 0; index < vm.actionsDoIt.length; ++index) {
                if (vm.actionsDoIt[index].com_code === vm.element.com_code) {
                    vm.actionsDoIt.splice(index, 1);
                }
            }
        }
        function deleteElement(item){
            var index;
            for (index = 0; index < vm.actionsDoIt.length; ++index) {
                if (vm.actionsDoIt[index].com_code === item.com_code) {
                    vm.actionsDoIt.splice(index, 1);
                }
            }
            vm.actions({element:vm.actionsDoIt});
        }


    }
})();
