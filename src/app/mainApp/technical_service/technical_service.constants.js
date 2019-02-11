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
            services:{
                base:'repair',
                service:'cabinet_service',
                current_stage:'current_stage'
            },
            type_entrie:{
                base:'management',
                control:'control',
                cabinet_subsidiary:'cabinet_in_sucursal'
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
