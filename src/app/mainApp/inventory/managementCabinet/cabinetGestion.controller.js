(function () {
    angular
        .module('app.mainApp.inventory')
        .controller('cabinetGestionController', cabinetGestionController);

    function cabinetGestionController(
        EnvironmentConfig,
        URLS,
        Translate,
        User,
        WAREHOUSE
    ) {
        var vm = this;

        //Variables
        vm.user = User.getUser();
        vm.showSelector = false;
        vm.filter;
        vm.showFromAgency;
        vm.selectedTab;

        vm.warehouse;

        //Constants
        vm.catalogues = {
            subsidiary: {
                binding: 'sucursal',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.subsidiary,

                    name: Translate.translate('WAREHOUSE.LABELS.SUBSIDIARY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'nombre'
                },
                hint: Translate.translate('WAREHOUSE.HINTS.SUBSIDIARY'),
                icon: 'fa fa-warehouse',
                required: true
            },
            udn: {
                binding: 'udn',
                catalog: {
                    url: EnvironmentConfig.site.rest.api
                        + '/' + URLS.management.base
                        + '/' + URLS.management.catalogues.base
                        + '/' + URLS.management.catalogues.udn,
                    name: Translate.translate('WAREHOUSE.LABELS.AGENCY'),
                    loadMoreButtonText: Translate.translate('MAIN.BUTTONS.LOAD_MORE'),
                    model: '_id',
                    option: 'agencia'
                },
                hint: Translate.translate('WAREHOUSE.HINTS.AGENCY'),
                icon: 'fa fa-building',
                required: true
            }
        };

        //Functions
        vm.searchWarehouse=searchWarehouse;

        vm.init = function init() {
            vm.filter = {};
            vm.selectedTab = 0;
            vm.showSelector = !vm.user['sucursal'] && !vm.user['udn'];
            if (!vm.showSelector) {
                if (vm.user['sucursal']) {
                    vm.filter[vm.catalogues.subsidiary.binding] = vm.user['sucursal'];
                }
                if (vm.user['udn']) {
                    vm.filter[vm.catalogues.udn.binding] = vm.user['udn'];
                }
                vm.searchWarehouse('brand');
            }
        };

        vm.init();

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.filter[field] = element;
            vm.selectedTab=0;
            vm.searchWarehouse('brand');
        };

        function searchWarehouse(parameter) {
            vm.warehouse=null;
            switch (parameter) {
                case 'brand':
                    vm.warehouse = WAREHOUSE.listByBrand();
                    break;
                case 'model':
                    vm.warehouse = WAREHOUSE.listByModel();
                    break;
                case 'kind':
                    vm.warehouse = WAREHOUSE.listByKind();
                    break;
                case 'unilever_status':
                    vm.warehouse = WAREHOUSE.listByUnileverStatus();
                    break;
            }
        }
    }

})();
