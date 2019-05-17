/*
    Fields for "New" entries:
    entry:{
        nombre_chofer: string, (Required)
        ife_chofer: base64string, (Required) Image file
        descripcion: string, (Optional)
        linea_transporte_id: int(id), (Required)
        tipo_transporte_id: int(id), (Required)
        pedimento: string, (Optional)
        sucursal_destino_id: int(id), (Required if !udn_destino_id && !User.sucursal && !User.udn)
        udn_destino_id: int(id), (Required if !sucursal_destino_id && !User.sucursal && !User.udn)
        proveedor_origen_id: int(id), (Required)
        cabinets_id: array[id] (Required, not empty, validated)
    }
*/
(function () {
    angular
        .module('app.mainApp.entries_departures.entries.new')
        .controller('newManualEntryController', NewManualEntryController);
    function NewManualEntryController(
        MANUAL_ENTRIES,
        User,
        Translate,
        toastr,
        ErrorHandler,
        $mdDialog,
        Helper,
        EnvironmentConfig,
        URLS
    ) {
        var vm = this;

        //Constants
        vm.maxTabIndex = 1;

        //Variables
        vm.selectedTab;
        vm.entry;
        vm.showOriginSelector;
        vm.catalogues;
        vm.cabinetList;
        vm.entryToAgency; //Determines which catalog to show (subsidiary or udn-agency)
        vm.userAgency;
        vm.userSubsidiary;

        //Validations and constraints
        vm.imageConstraints = {
            validations: {
                size: {
                    max: '5MB',
                    min: '10B',
                    height: { max: 4096, min: 100 },
                    width: { max: 4096, min: 100 }
                }
            },
            resize: { width: 4096 },
            resizeIf: '$width > 4096 || $height > 4096'
        };

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
                        pagination: {},
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
                        query: '?marca__id=',
                        requires: 'marca',
                        name: 'Modelo',
                        model: 'id',
                        option: 'nombre',
                        elements: 'results',
                        pagination: {},
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
                            total: 'count',
                            next: 'next'
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
                            total: 'count',
                            next: 'next'
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
            vm.showOriginSelector = false;
            vm.cabinetList = [];
            vm.entryToAgency = false; //Determines what catalog to show (Petition or udn)
            vm.entry = MANUAL_ENTRIES.newEntry.template();
            vm.catalogues = MANUAL_ENTRIES.newEntry.catalogues();

            var user = User.getUser();
            //Determining whether or not to show the Subsidiary or the Udn selector.
            vm.showOriginSelector = !user['sucursal']
                && !user['udn'];

            vm.userAgency = user.udn;
            vm.userSubsidiary = user.sucursal;
        };

        vm.init();

        //Controller global functions

        vm.onElementSelect = function onElementSelect(element, field) {
            vm.entry[field] = element;
        };

        vm.selectDriverID = function selectDriverID(files) {
            if (files.length > 0) {
                var file = files[0];
                //Image processing as a base64 string
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;
                    vm.entry['ife_chofer'] = base64Image;
                };

            }
            else {
                delete (vm.entry['ife_chofer']);
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
                    toastr.warning(Translate.translate('ENTRIES.NEW.ERRORS.REPEATED_ID'), cabinetID);
                }
                else {
                    var cabinetToAdd = {
                        promise: MANUAL_ENTRIES
                            .getCabinet(cabinetID),
                        cabinet: null,
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
                            //Cabinet can enter
                            if (cabinetSuccessCallback.can_enter) {
                                //Cabinet exist in database
                                if (cabinetSuccessCallback.cabinet) {
                                    //Cabinet it's new
                                    if (cabinetSuccessCallback.cabinet.nuevo) {
                                        cabinetToAdd.cabinet = cabinetSuccessCallback.cabinet;
                                    }
                                    else {
                                        //Cabinet can´t enter because it's not new
                                        toastr.error(Translate.translate('ENTRIES.NEW.ERRORS.CANT_ENTER_NOT_NEW'), cabinetID);
                                        vm.removeCabinet(cabinetID);
                                    }
                                }
                                //else {
                                //    //The cabinet is added to be created (you do nothing)
                                //}
                            }
                            else {
                                //Cabinet can't enter because it's in a warehouse
                                toastr.error(Translate.translate('ENTRIES.NEW.ERRORS.CANT_ENTER_IN_WAREHOUSE'), cabinetID);
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
                    toastr.warning(Translate.translate('ENTRIES.NEW.ERRORS.NOT_FOUND_ID'), cabinetID);
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
                    .textContent(Translate.translate('ENTRIES.NEW.MESSAGES.PENDING_CABINETS'))
                    .ariaLabel(Translate.translate('ENTRIES.NEW.MESSAGES.PENDING_CABINETS'))
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
            //API callback
            vm.createEntryPromise = MANUAL_ENTRIES
                .createNew(entry)
                .then(function () {
                    vm.init();
                    toastr.success(
                        Translate.translate('ENTRIES.NEW.MESSAGES.SUCCESS_CREATE')
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
            if (entry.cabinets_id.length) {
                entry.cabinets_id = [];
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
                entry['cabinets_id'].push(existingCabinets[i].id);
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
