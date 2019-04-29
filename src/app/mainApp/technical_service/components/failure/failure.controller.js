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
                failuresDetected: '&',
                failures: '<'

            }
        });
    function failureController(Translate, URLS, EnvironmentConfig,$log) {
        var vm = this;
        var failure_typeURL = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.failure_type);
        vm.catalogues = {
            failure_type: {
                catalog: {
                    url: failure_typeURL,
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
                hint: Translate.translate('FAILURES_COMPONENT.SELECT_FAILURE_TYPE_FOR')
            },
            failure: {
                catalog: {
                    url: null,
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
                hint: Translate.translate('FAILURES_COMPONENT.ADD_FAILURE')
            }
        };


        vm.onSelectType = onSelectType;
        vm.addFailure = addFailure;
        vm.deleteElement = deleteElement;
        getFailures();
        function getFailures() {
            $log.debug.log("Fallas Obtenidas de la carga de información");
            $log.debug.log(vm.failures);
            if (vm.failures.length === 0) {
                vm.failures = [];
            }

        }

        function onSelectType(value) {

            if (value.id) {
                vm.idType = value.id;
            }
            vm.fallasCargadas = false;
            var failure_URL = (EnvironmentConfig.site.rest.api)
                .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.failure + '?clasificador_falla__id=').concat(vm.idType);

            vm.catalogues.failure.catalog.url = failure_URL;
            vm.fallasCargadas = true;
        }

        function addFailure(value) {
            vm.element = value;
            getDuplicity();
            vm.failures.push(vm.element);
            vm.failuresDetected({element: vm.failures});
        }

        function getDuplicity() {
            var index;
            for (index = 0; index < vm.failures.length; ++index) {
                if (vm.failures[index].com_code === vm.failures.com_code) {
                    vm.failures.splice(index, 1);
                }
            }
        }

        function deleteElement(item) {
            var index;
            for (index = 0; index < vm.failures.length; ++index) {
                if (vm.failures[index].com_code === item.com_code) {
                    vm.failures.splice(index, 1);
                }
            }
            vm.failuresDetected({element: vm.failures});
        }


    }
})();
