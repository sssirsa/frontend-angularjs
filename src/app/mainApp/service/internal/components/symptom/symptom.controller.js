/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('symptomManager', {
            templateUrl: 'app/mainApp/service/internal/components/symptom/symptom.tmpl.html',
            controller: symptomController,
            bindings: {
                symptoms: '&'

            }
        });
    function symptomController(Translate,URLS,ErrorHandler,EnvironmentConfig) {
        var vm = this;
        const symptomURL =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.technical_service.base+ '/' + URLS.technical_service.catalogues.base + '/' + URLS.technical_service.catalogues.symptom);
        vm.catalogues = {
            symptoms: {
                catalog: {
                    url:symptomURL,
                    name: Translate.translate('SYMTOMPS_COMPONENT.TITLE'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'code',
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
                noResults: Translate.translate('ERRORS.NO_RESULTS')
            }
        };
        vm.sintomas_detectados=[];

        vm.onSelect=onSelect;
        vm.addSymptom=addSymptom;
        vm.deleteElement=deleteElement;
        function onSelect(value) {
            console.log(value);
            vm.element=value;
        }
        function addSymptom(){

            getDuplicity();
            vm.sintomas_detectados.push(vm.element);
        }
        function getDuplicity() {
            var index;
            for (index = 0; index < vm.sintomas_detectados.length; ++index) {
                if (vm.sintomas_detectados[index].code === vm.element.code) {
                    vm.sintomas_detectados.splice(index, 1);
                }
            }
        }
        function deleteElement(item){
            var index;
            for (index = 0; index < vm.sintomas_detectados.length; ++index) {
                if (vm.sintomas_detectados[index].code === item.code) {
                    vm.sintomas_detectados.splice(index, 1);
                }
            }
        }


    }
})();
