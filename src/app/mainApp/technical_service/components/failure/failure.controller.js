/**
 * Created by franciscojaviercerdamartinez on 2/21/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('faultManager', {
            templateUrl: 'app/mainApp/technical_service/components/failure/failure.tmpl.html',
            controller: failureController,
            bindings: {
                failuresDetected: '&'

            }
        });
    function failureController(Translate,URLS,ErrorHandler,EnvironmentConfig) {
        var vm = this;
        const failure_typeURL =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base+ '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.failure_type);
        const failure_URL =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base+ '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.failure_type);
        vm.catalogues = {
            failure_type: {
                catalog: {
                    url:failure_typeURL,
                    name: Translate.translate('FAILURES_COMPONENT.SELECT_FAILURE_TYPE'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
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
                hint:Translate.translate('FAILURES_COMPONENT.SELECT_FAILURE_TYPE_FOR')
            },
            failure: {
                catalog: {
                    url:failure_URL+'?clasificador_falla__id='+vm.failure_type,
                    name: Translate.translate('FAILURES_COMPONENT.SELECT_FAILURE'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'com_code',
                    option: 'nombre'
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
                hint:Translate.translate('FAILURES_COMPONENT.ADD_FAILURE')
            }
        };
        vm.failures=[];

        vm.onSelectType=onSelectType;
        vm.addFailure=addFailure;
        vm.deleteElement=deleteElement;
        function onSelectType(value) {
            console.log(value);
            vm.failure_type=vm.value.id;
        }
        function addFailure(value){
            vm.element=value;
            getDuplicity();
            vm.failures.push(vm.element);
            vm.failuresDetected({element:vm.failures});
        }
        function getDuplicity() {
            var index;
            for (index = 0; index < vm.failures.length; ++index) {
                if (vm.failures[index].com_code === vm.failures.com_code) {
                    vm.failures.splice(index, 1);
                }
            }
        }
        function deleteElement(item){
            var index;
            for (index = 0; index < vm.failures.length; ++index) {
                if (vm.failures[index].com_code === item.com_code) {
                    vm.failures.splice(index, 1);
                }
            }
            vm.failuresDetected({element:vm.failures});
        }


    }
})();
