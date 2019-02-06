(function () {
    angular
        .module('app.mainApp.technical_service')
        .constant('TECHNICAL_SERVICE', {
            base: 'technical_services',
            catalogues: {
                base: 'catalogues',
                action: 'action',
                com_incidence: 'com_incidence',
                failure_type: 'failure_type',
                next_step: 'next_step',
                stage:'stage',
                symptom: 'symptom'
            },
            choices: {
                tipo_etapa: [
                    {
                        value: 'Diagnostico',
                        display_name: 'Diagnóstico'
                    },
                    {
                        value: 'Checklist',
                        display_name: 'Checklist'
                    },
                    {
                        value: 'Pinchado',
                        display_name: 'Pinchado'
                    },
                    {
                        value: 'Presurizado',
                        display_name: 'Presurizado'
                    },
                    {
                        value: 'Obsoleto',
                        display_name: 'Obsoleto'
                    },
                    {
                        value: 'Mercado',
                        display_name: 'Listo para Mercado'
                    },
                    {
                        value: 'Impedido',
                        display_name: 'Impedido'
                    },
                    {
                        value: 'Reparacion',
                        display_name: 'Reparación'
                    }
                ]
            }
        });
})();
