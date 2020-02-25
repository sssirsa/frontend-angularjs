(function(){
    angular
    .module('app.mainApp.warehouse')
    .config(moduleConfig);
    function moduleConfig(
        $stateProvider,
        $translatePartialLoaderProvider,
        triMenuProvider
    ){
        $translatePartialLoaderProvider.addPart('app/mainApp/warehouse');
        $stateProvider
        .state('triangular.admin-default.gestion_cabinets', {
            url: '/activos/cabinet/stock',
            data: {
                permissions: {
                    only: ['management__inventory__cabinet', 
                    'warehouse__fridge__stock']
                }
            },
            templateUrl: 'app/mainApp/warehouse/fridges/cabinetGestion.tmpl.html',
            controller: 'cabinetGestionController',
            controllerAs: 'vm'
        });

        triMenuProvider.addMenu({
            name: 'MAIN.MENU.WAREHOUSE.TITLE',
            icon: 'fa fa-pallet',
            type: 'dropdown',
            permission: ['warehouse__fridge__stock'],
            priority: 8,
            children: [{
                name: 'MAIN.MENU.WAREHOUSE.CABINET_MANAGEMENT',
                state: 'triangular.admin-default.gestion_cabinets',
                permission:['warehouse__fridge__stock'],
                type: 'link'
            }
            ]
        });
    }
})();