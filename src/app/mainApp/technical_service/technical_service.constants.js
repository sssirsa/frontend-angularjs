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
                failure:'failure',
                next_step: 'next_step',
                stage:'stage',
                symptom: 'symptom'
            },
            inspections:{
                base:'inspections',
                preliminary_inspection:'preliminary_inspection',
                pre_checklist:'pre_checklist'
            },
            services:{
                base:'repair',
                service:'cabinet_service',
                current_stage:'current_stage',
                checklist:'checklist'
            },
            puncture:{
                base:'puncture'
            },
            type_entrie:{
                base:'management',
                control:'control',
                cabinet_subsidiary:'cabinet_in_sucursal'
            },
            bulk_assets:{
                asset:'asset',
                bulksByStep:'bulk_asset_process'
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
