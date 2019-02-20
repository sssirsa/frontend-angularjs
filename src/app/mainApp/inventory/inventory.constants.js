(function () {
    angular
        .module('app.mainApp.inventory')
        .constant('INVENTORY', {
            base: 'inventory',
            catalogues: {
                base: 'catalogues',
                supplier: 'proveedor',
                consumable_category: 'categoria_insumo',
                component_type: 'tipo_componente',
                consumable_brand: 'marca_insumo',
                consumable_model: 'modelo_insumo'
            }
        });
})();
