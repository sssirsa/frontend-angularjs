(function () {
    angular
        .module('app.mainApp.management')
        .constant('MANAGEMENT', {
            base: 'management',
            administration: {
                base: 'manage_system',
                app: 'app',
                error_message: 'error_message',
                module: 'module',
                person: 'persona',
                profile:'info_full',
                project: 'project'
            },
            catalogues: {
                base: 'catalogues',
                cabinet_brand: 'marca_cabinet',
                cabinet_model: 'modelo_cabinet',
                category: 'category',
                condition: 'condition',
                equipment_type: 'tipo_equipo',
                impediment: 'motivo_impedimento_salida',
                reason_not_labeled: 'motivo_no_capitalizado',
                status_unilever: 'status_unilever',
                status_com: 'status_com',
                status_not_labeled: 'estatus_no_capitalizado',
                storage: 'warehouse',
                subsidiary: 'subsidiary',
                udn:'udn'
            },
            control: {
                base: 'control',
                cabinet_in_subsidiary: 'control_cabinet_capitalizado',
                no_labeled_in_subsidiary: 'control_cabinet_no_capitalizado'
            },
            inventory: {
                base: 'inventory',
                cabinet: 'cabinet_unilever',
                unrecognizable_cabinet: 'cabinet_no_labeled_unilever',
                asset_location: 'asset_location',
                impediment: 'impedimento',
                label: 'label'
            },
            oauth: {
                base: 'oauth',
                login: 'token/'
            }
        });
})();
