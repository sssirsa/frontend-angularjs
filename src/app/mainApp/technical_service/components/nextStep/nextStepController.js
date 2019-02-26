/**
 * Created by franciscojaviercerdamartinez on 2/25/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('nextStep', {
            templateUrl: 'app/mainApp/technical_service/components/nextStep/nextStep.tmpl.html',
            controller: nextStepController,
            bindings: {
                nextstep: '&',
                failures:'<',
                actual_step:'<'

            }
        });
    function nextStepController(Translate, URLS, ErrorHandler, EnvironmentConfig) {
        var vm = this;
        vm.steps= [
            {
                "id": 4,
                "nombre": "Diagnóstico",
                "tipo_etapa": "Diagnostico"
            },
            {
                "id": 5,
                "nombre": "Checklist",
                "tipo_etapa": "Checklist"
            },
            {
                "id": 7,
                "nombre": "Presurizado",
                "tipo_etapa": "Presurizado"
            },
            {
                "id": 10,
                "nombre": "Impedido",
                "tipo_etapa": "Impedido"
            }
        ];



    }
})();
