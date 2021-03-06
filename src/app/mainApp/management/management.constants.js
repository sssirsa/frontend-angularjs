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
                profile: 'info_full',
                project: 'project'
            },
            catalogues: {
                base: 'catalogues',
                app: 'app',
                cabinet_brand: 'fridgebrand',
                cabinet_model: 'modelo_cabinet',
                category: 'category',
                condition: 'condition',
                equipment_type: 'tipo_equipo',
                impediment: 'motivo_impedimento_salida',
                module: 'module',
                project: 'project',
                reason_not_labeled: 'motivo_no_capitalizado',
                status_unilever: 'status_unilever',
                status_com: 'status_com',
                status_not_labeled: 'estatus_no_capitalizado',
                storage: 'warehouse',
                subsidiary: 'subsidiary',
                template: 'template',
                udn: 'agency'
            },
            control: {
                base: 'control',
                cabinet_in_subsidiary: 'control_cabinet_capitalizado',
                no_labeled_in_subsidiary: 'control_cabinet_no_capitalizado'
            },
            inventory: {
                base: 'inventory',
                cabinet: 'fridge',
                unrecognizable_cabinet: 'cabinet_no_labeled_unilever',
                asset_location: 'asset_location',
                impediment: 'impedimento',
                obsolete: 'obsoleto',
                label: 'label'
            },
            oauth: {
                base: 'authentication',
                login: 'login',
                person: 'person'
            }
        });
})();
