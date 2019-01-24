(function () {
    angular
        .module('app.mainApp.management')
        .constant('MANAGEMENT', {
            base: 'management',
            catalogues: {
                base: 'catalogues',
                subsidiary: 'subsidiary',
                category: 'category',
                status_unilever: 'status_unilever',
                status_com: 'status_com',
                condition: 'condition',
                equipment_type: 'tipo_equipo',
                cabinet_brand: 'marca_cabinet',
                cabinet_model: 'modelo_cabinet',
                impediment: 'motivo_impedimento_salida',
                storage: 'warehouse',
                reason_not_labeled: 'motivo_no_capitalizado',
                status_not_labeled: 'estatus_no_capitalizado'
            },
            inventory: {
                base: 'inventory',
                cabinet: 'cabinet_unilever',
                unrecognizable_cabinet: 'cabinet_no_labeled_unilever',
                asset_location: 'asset_location',
                impediment: 'impedimento',
                label: 'label'
            },
            control: {
                base: 'control',
                cabinet_in_subsidiary: 'cabinet_in_sucursal',
                no_labeled_in_subsidiary:'no_capitalizado_in_sucursal'
            },
            restrictions: {},
            users: {}
        });
})();
