/*
    Fields for "Warehouse" entries:
    entry:{
        nombre_chofer: string, (Required)
        ife_chofer: base64string, (Required) Image file
        descripcion: string, (Optional)
        linea_transporte_id: int(id), (Required)
        tipo_transporte_id: int(id), (Required)
        sucursal_destino_id: int(id), (Required if !udn_destino_id && !User.sucursal && !User.udn)
        udn_destino_id: int(id), (Required if !sucursal_destino_id && !User.sucursal && !User.udn)
        cabinets: array[id] (Required, not empty, validated)
    }
*/
(function () {
    angular
        .module('app.mainApp.entries_departures.entries.warehouse')
        .controller('warehouseManualEntryController', WarehouseManualEntryController);
    function WarehouseManualEntryController(
        MANUAL_ENTRIES,
        User,
        Translate,
        toastr,
        ErrorHandler,
        $mdDialog,
        Helper,
        EnvironmentConfig,
        URLS,
        PAGINATION,
        QUERIES
    ) {
        var vm = this;

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab;
        vm.entry;
        vm.showSelector;
        vm.catalogues;
        vm.cabinetList;
        vm.userAgency;
        vm.userSubsidiary;

        //Validations

        vm.createCabinetDialog = {
            fields: [
                {
                    type: 'text',
                    model: 'economico',
                    label: 'Económico',
                    initial_value: '',
                    lock: true
                },
                {
                    type: 'text',
                    model: 'no_serie',
                    label: 'Número de serie',
                    required: true,
                    hint: 'Número de serie del cabinet',
                    validations: {
                        errors: {
                            required: 'El número de serie es obligatorio'
                        }
                    }
                },
                {
                    type: 'text',
                    model: 'year',
                    label: 'Año',
                    required: true,
                    hint: 'Año de fabricación del cabinet',
                    validations: {
                        regex: '(19|20)[0-9]{2}',
                        errors: {
                            regex: 'Formato inválido de año',
                            required: 'El año es obligatorio'
                        }
                    }
                },
                {
                    type: 'text',
                    model: 'id_unilever',
                    label: 'Activo Unilever',
                    required: true,
                    hint: 'Número de identificación utilizado por Unilever',
                    validations: {
                        regex: '[a-zA-Z0-9]+',
                        errors: {
                            regex: 'Solo caracteres alfanuméricos',
                            required: 'El activo unilever'
                        }
                    }
                },
                {
                    type: 'catalog',
                    model: 'marca',
                    label: 'Marca del cabinet',
                    validations: {
                        errors: {
                            required: 'El campo es requerido.'
                        }
                    },
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.cabinet_brand,
                        name: 'Marca',
                        model: 'id',
                        option: 'nombre',
                        loadMoreButtonText: 'Cargar mas...',
                        elements: 'results',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    required: true
                },
                {
                    type: 'catalog',
                    model: 'modelo_id',
                    label: 'Modelo del cabinet',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.cabinet_model,
                        query: 'marca__id',
                        requires: 'marca',
                        name: 'Modelo',
                        model: 'id',
                        option: 'nombre',
                        elements: 'results',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        loadMoreButtonText: 'Cargar mas...',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    },
                    required: true
                },
                {
                    type: 'catalog',
                    model: 'condicion_id',
                    label: 'Condición del cabinet',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.condition,
                        name: 'Condición',
                        model: 'id',
                        option: 'letra',
                        loadMoreButtonText: 'Cargar mas...',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                },
                {
                    type: 'catalog',
                    model: 'categoria_id',
                    label: 'Categoría',
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.base
                            + '/' + URLS.management.catalogues.category,
                        name: 'Categoría del cabinet',
                        model: 'id',
                        option: 'nombre',
                        loadMoreButtonText: 'Cargar mas...',
                        pagination: {
                            total: PAGINATION.total,
                            limit: PAGINATION.limit,
                            offset: PAGINATION.offset,
                            pageSize: PAGINATION.pageSize
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                }
            ],
            dialog: {
                title: 'Información del cabinet',
                okButton: 'Guardar',
                cancelButton: 'Cancelar',
                loading: 'Creando cabinet'
            },
            url: EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.inventory.base
                + '/' + URLS.management.inventory.cabinet
        };

        // Auto invoked init function
        vm.init = function init() {
            vm.selectedTab = 0;
            vm.showSelector = false;
            vm.catalogues = {};
            vm.cabinetList = [];
            vm.entry = MANUAL_ENTRIES.warehouseEntry.template();
            vm.catalogues = MANUAL_ENTRIES.warehouseEntry.catalogues();

            var user = User.getUser();
            //Determining whether or not to show the Subsidiary or the Udn selector.
            vm.showSelector = !user['sucursal']
                && !user['udn'];

            vm.userAgency = user.udn;
            vm.userSubsidiary = user.sucursal;

            if (vm.userSubsidiary) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary._id;
                vm.catalogues['transport_line'].catalog.query_value = vm.userSubsidiary._id;
                vm.entry[vm.catalogues['subsidiary'].binding]=vm.userSubsidiary._id;
            }
            if (vm.userAgency) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency._id;
                vm.catalogues['transport_line'].catalog.query_value = vm.userAgency._id;
                vm.entry[vm.catalogues['udn'].binding]=vm.userAgency._id;
            }
        };

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.entry[field] = element;
        };

        vm.onTransportLineSelect = function (element, field) {
            vm.catalogues['transport_driver'].catalog['query_value'] = element;
            vm.catalogues['transport_kind'].catalog['query_value'] = element;
            vm.onElementSelect(element, field);
        };

        vm.onDestinationSelect = function onSubsidiarySelect(element, field) {

            vm.onElementSelect(element, field);

            if (vm.entry[vm.catalogues['subsidiary'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_subsidiary;
                vm.catalogues['transport_line'].catalog.query_value = vm.entry[vm.catalogues['subsidiary'].binding];
            }
            if (vm.entry[vm.catalogues['udn'].binding]) {
                vm.catalogues['transport_line'].catalog.query = QUERIES.entries_departures.by_agency;
                vm.catalogues['transport_line'].catalog.query_value = vm.entry[vm.catalogues['udn'].binding];
            }
        };

        vm.searchCabinet = function searchCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList.map(function (element) {
                    return element.id;
                }).indexOf(cabinetID);
                if (index !== -1) {
                    //Cleaning the search bar
                    vm.cabinetID = '';
                    //Cabinet already in list
                    toastr.warning(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_ENTRIES
                            .getCabinet(cabinetID),
                        cabinet: null,
                        obsolete: false,
                        id: null
                    };

                    //Adding element to the list
                    cabinetToAdd.id = cabinetID;
                    vm.cabinetList.unshift(cabinetToAdd);

                    //Cleaning the search bar
                    vm.cabinetID = '';

                    //Searching for cabinet in the API
                    cabinetToAdd
                        .promise
                        .then(function setCabinetToAddSuccess(cabinetSuccessCallback) {
                            if (cabinetSuccessCallback.can_enter) {
                                //Cabinet can enter
                                cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                            }
                            else {
                                //Cabinet can´t enter because it already has a subsidiary assigned
                                toastr.error(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.CANT_ENTER'), cabinetID);
                                vm.removeCabinet(cabinetID);
                            }
                        })
                        .catch(function setCabinetToAddError(error) {
                            //Cleaning the search bar
                            vm.cabinetID = '';
                            ErrorHandler.errorTranslate(error);
                        });
                }
            }
        };

        vm.removeCabinet = function removeCabinet(cabinetID) {
            if (cabinetID.length > 0) {
                var index = vm.cabinetList
                    .map(function (element) {
                        return element.id;
                    }).indexOf(cabinetID);
                if (index === -1) {
                    //Cabinet not found in list (unreachable unless code modification is made)
                    toastr.warning(Translate.translate('ENTRIES.WAREHOUSE.ERRORS.NOT_FOUND_ID'), cabinetID);
                }
                else {
                    vm.cabinetList.splice(index, 1);
                }
            }
        };

        vm.clickSaveEntry = function clickSaveEntry(entry) {
            //Show warning message if the entry has unregistered cabinets
            if (entryHasPendingCabinets()) {
                var confirm = $mdDialog.confirm()
                    .title(Translate.translate('MAIN.MSG.WARNING_TITLE'))
                    .textContent(Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.PENDING_CABINETS'))
                    .ok(Translate.translate('MAIN.BUTTONS.ACCEPT'))
                    .cancel(Translate.translate('MAIN.BUTTONS.CANCEL'));

                $mdDialog.show(confirm)
                    .then(function () {
                        saveEntry(entry);
                    });
            }
            else {
                saveEntry(entry);
            }
        };

        vm.createCabinet = function createCabinet(cabinetID) {
            vm.createCabinetDialog.fields[0].initial_value = cabinetID;
            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: vm.createCabinetDialog.dialog,
                    fields: vm.createCabinetDialog.fields,
                    url: vm.createCabinetDialog.url
                }
            }).then(function successCreateCabinet(successCallback) {
                var cabinetID = successCallback.economico;
                vm.removeCabinet(cabinetID);
                addCabinetToList(successCallback);
            }).catch(function errorCreateCabinet(errorCallback) {
                if (errorCallback) {
                    ErrorHandler.errorTranslate(errorCallback);
                }
            });
        };

        vm.changeSwitch = function changeSwitch() {
            //Removing mutual excluding variables when the switch is changed
            delete (vm.entry[vm.catalogues['udn'].binding]);
            delete (vm.entry[vm.catalogues['subsidiary'].binding]);
        };

        //Internal functions

        var saveEntry = function saveEntry(entry) {
            entry = addCabinetsToEntry(vm.cabinetList, entry);
            entry = Helper.removeBlankStrings(entry);
            if (vm.userAgency) {
                entry[vm.catalogues['udn'].binding] = vm.userAgency['_id'];
            }
            if (vm.userSubsidiary) {
                entry[vm.catalogues['subsidiary'].binding] = vm.userSubsidiary['_id'];
            }
            //API callback
            vm.createEntryPromise = MANUAL_ENTRIES
                .createWarehouse(entry)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('ENTRIES.WAREHOUSE.MESSAGES.SUCCESS_CREATE')
                    );
                })
                .catch(function (errorCallback) {
                    ErrorHandler.errorTranslate(errorCallback);
                });
        };

        var entryHasPendingCabinets = function entryHasPendingCabinets() {
            return vm.cabinetList.some(function (element) {
                return !element.cabinet;
            });
        };

        var addCabinetsToEntry = function addCabinetsToEntry(cabinets, entry) {
            //In case the cabinets array exist, restart it
            if (entry.cabinets.length) {
                entry.cabinets = [];
            }
            var existingCabinets = cabinets
                .filter(function (element) {
                    //Filtering to just add the cabinets that exist
                    return element.cabinet;
                });
            for (
                var i = 0;
                i < existingCabinets.length;
                i++) {
                entry['cabinets'].push(existingCabinets[i].id);
            }
            return entry;
        };

        var addCabinetToList = function addCabinetToList(cabinet) {
            var cabinetToAdd = {
                promise: null,
                cabinet: cabinet,
                id: cabinet['economico']
            };

            vm.cabinetList.push(cabinetToAdd);
        };

        //Tab functions

        vm.previousTab = function () {
            vm.selectedTab = vm.selectedTab - 1;
        };

        vm.nextTab = function () {
            vm.selectedTab = vm.selectedTab + 1;
        };

    }

})();
