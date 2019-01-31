(function () {
    angular
        .module('app.mainApp')
        .config(CatalogManagerConfig);
    function CatalogManagerConfig(
        $stateProvider
    ) {
        $stateProvider
            .state('CatalogManagerCreate', {
                url: '/catalog-manager/create',
                templateUrl: 'app/mainApp/components/catalogManager/screens/createScreen',
                controller: 'CatalogCreateScreenController',
                controllerAs: 'vm'
            });
    }
})();
