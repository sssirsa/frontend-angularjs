(function () {
    angular
        .module('app.mainApp.inventory')
        .constant('INVENTORY', {
            base: 'inventory',
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
            }
        });
})();
