/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('symptomManager', {
            templateUrl: 'app/mainApp/technical_service/components/symptom/symptom.tmpl.html',
            controller: symptomController,
            bindings: {
                symptoms: '&'

            }
        });
    function symptomController(Translate, URLS, EnvironmentConfig,PAGINATION) {
        var vm = this;
        var symptomURL = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base + '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.symptom);
        vm.catalogues = {
            symptoms: {
                catalog: {
                    url: symptomURL,
                    name: Translate.translate('SYMTOMPS_COMPONENT.ADD_SYMTOMP'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'code',
                    option: 'descripcion',
                    pagination: {
                        total: PAGINATION.total,
                        limit: PAGINATION.limit,
                        offset: PAGINATION.offset,
                        pageSize: PAGINATION.pageSize
                    },
                    elements: 'results',
                    softDelete: {
                        hide: 'deleted',
                        reverse: false
                    }
                },
                required: true,
                noResults: Translate.translate('ERRORS.NO_RESULTS'),
                hint: Translate.translate('SYMTOMPS_COMPONENT.ADD')
            }
        };
        vm.sintomas_detectados = [];

        vm.onSelect = onSelect;
        vm.addSymptom = addSymptom;
        vm.deleteElement = deleteElement;
        function onSelect(value) {
            vm.element = value;
            addSymptom();
        }

        function addSymptom() {

            getDuplicity();
            vm.sintomas_detectados.push(vm.element);
            vm.symptoms({element: vm.sintomas_detectados});
        }

        function getDuplicity() {
            var index;
            for (index = 0; index < vm.sintomas_detectados.length; ++index) {
                if (vm.sintomas_detectados[index].code === vm.element.code) {
                    vm.sintomas_detectados.splice(index, 1);
                }
            }
        }

        function deleteElement(item) {
            var index;
            for (index = 0; index < vm.sintomas_detectados.length; ++index) {
                if (vm.sintomas_detectados[index].code === item.code) {
                    vm.sintomas_detectados.splice(index, 1);
                }
            }
            vm.symptoms({element: vm.sintomas_detectados});
        }


    }
})();
