(function () {
    angular
        .module('app.mainApp.warehouse')
        .controller('cabinetGestionController', cabinetGestionController);

    function cabinetGestionController(
        EnvironmentConfig,
        ErrorHandler,
        URLS,
        Translate,
        User,
        WAREHOUSE
    ) {
        var vm = this;

        //Variables
        vm.user = User.getUser();
        vm.showSelector = false;
        vm.showSwitch = false;
        vm.filter;
        vm.showFromAgency;
        vm.showAll;
        vm.selectedTab;
        vm.loadingWarehouse;

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
        vm.searchWarehouse = searchWarehouse;

        vm.init = function init() {
            vm.filter = {};
            vm.selectedTab = 0;
            if (!vm.user['sucursal'] && !vm.user['udn']) {
                vm.showSwitch = true;
                vm.showSelector = true;
            }
            if (vm.user['sucursal']) {
                if (!vm.user['sucursal']._id) {
                    vm.showSelector = true;
                }
            }
            if (vm.user['udn']) {
                if (!vm.user['udn']._id) {
                    vm.showSelector = true;
                }
            }
            if (!vm.showSelector) {
                if (vm.user['sucursal']) {
                    vm.filter['sucursal'] = vm.user['sucursal'];
                }
                if (vm.user['udn']) {
                    vm.filter['udn'] = vm.user['udn'];
                }
                vm.searchWarehouse('brand');
            }
        };

        vm.init();

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.filter = {};
            vm.filter[field] = element;
            vm.selectedTab = 0;
            vm.searchWarehouse('brand');
        };

        vm.changeSwitch = function () {
            vm.filter = {};
        };

        vm.changeSwitchAll = function () {
            if (vm.showAll) {
                if (vm.user.sucursal) {
                    vm.filter = {
                        sucursal: {}
                    };
                }
                if (vm.user.udn) {
                    vm.filter = {
                        udn: {}
                    };
                }
                searchWarehouse('brand');
            }
            vm.filter = {};
        };

        function searchWarehouse(parameter) {
            vm.warehouse = null;
            switch (parameter) {
                case 'brand':
                    vm.loadingWarehouse = WAREHOUSE.listByBrand(vm.filter)
                        .then(function (response) {
                            vm.warehouse = response;
                        })
                        .catch(function (error) {
                            ErrorHandler.errorTranslate(error);
                        });
                    break;
                case 'model':
                    vm.loadingWarehouse = WAREHOUSE.listByModel(vm.filter)
                        .then(function (response) {
                            vm.warehouse = response;
                        })
                        .catch(function (error) {
                            ErrorHandler.errorTranslate(error);
                        });
                    break;
                case 'kind':
                    vm.loadingWarehouse = WAREHOUSE.listByKind(vm.filter)
                        .then(function (response) {
                            vm.warehouse = response;
                        })
                        .catch(function (error) {
                            ErrorHandler.errorTranslate(error);
                        });
                    break;
                case 'unilever_status':
                    vm.loadingWarehouse = WAREHOUSE.listByUnileverStatus(vm.filter)
                        .then(function (response) {
                            vm.warehouse = response;
                        })
                        .catch(function (error) {
                            ErrorHandler.errorTranslate(error);
                        });
                    break;
            }

        }
    }

})();
