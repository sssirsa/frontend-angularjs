(function () {
    angular
        .module('app.mainApp.inventory')
        .constant('INVENTORY', {
            base: 'inventory',
            asset: {
                base: 'asset',
                bulk_asset_stage: 'bulk_asset_process',
                unique_asset_stage:'unique_asset_process'
            },
            catalogues: {
                base: 'catalogues',
                bulk_asset:'bulk_asset',
                consumable_category: 'categoria_insumo',
                component_type: 'tipo_componente',
                consumable_brand: 'marca_insumo',
                consumable_model: 'modelo_insumo',
                consumable_unit: 'unidad',
                supplier: 'proveedor',
                unique_asset: 'unique_asset'
            },
            management: {
                base: 'management',
                bulk_asset_inventory: 'bulk_asset_branch',
                unique_asset_inventory:'unique_asset_branch',
                recover_asset:'recover_asset'
            }
        });
})();
