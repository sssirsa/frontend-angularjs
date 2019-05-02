/**
 * Created by franciscojaviercerdamartinez on 12/7/18.
 */
(function () {
    'use strict';
    angular
        .module('app.mainApp.inventory')
        .controller('cabinetStorageController', cabinetStorageController);

    function cabinetStorageController($scope,
                                      Translate,
                                      toastr,
                                      Helper,
                                      URLS,
                                      CATALOG,
                                      ErrorHandler,
                                      cabinetUC,
                                      User,
                                      noLabeled,
                                      assetStoringProvider,
                                      _,
                                      EnvironmentConfig) {
        //Variable definition
        var vm = this;
        vm.asset_location = {}; // Objeto de localización de Cabinet
        vm.storage = {}; //Objeto contenedor de la Bodega
        vm.type_storage = true;// true -> Capitalizado, false-> No Capitalizado
        vm.asset = {}; //objeto contenedor del cabinet
        vm.edition = true; // Booleano que permite mostrar los campos de seleccion de sucursal y/ó bodega


        //funciones
        vm.onElementSelect = onElementSelect;
        vm.increment_element = increment_element;
        vm.decrement_element = decrement_element;
        vm.object_builder = object_builder;
        vm.search_asset = search_asset;
        vm.enableEdition = enableEdition;
        vm.clear = clear;
        vm.changeStorage = changeStorage;


        //Translates
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');
        vm.errorNotSubsidiary = Translate.translate('STORAGE.ERROR.NOT_SUBSIDIARY');

        //Blank variables templates
        vm.catalogues = {
            storage_by_sucursal: {
                catalog: {
                    url: null,
                    kind: 'Management',
                    name: Translate.translate('STORAGE.STORAGE'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                },
                noResults: Translate.translate('ERRORS.NO_RESULTS')
            }

        };

        onLoad();


        function onSubsidiarySelect(element) {
            vm.storage = null;
            vm.subsidiary = element;
            vm.catalogues.storage_by_sucursal.catalog.url =
                EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.catalogues.base
                + '/' + URLS.management.catalogues.storage
                + '?sucursal__id=' + vm.subsidiary;
        }

        function onLoad() {
            //TODO: Improve subsidiary selection
            vm.user = User.getUser();
            if (vm.user.sucursal) {
                onSubsidiarySelect(vm.user.sucursal);
            }
        }


        function onElementSelect(element) {
            var catalog_service = CATALOG;
            catalog_service.url = EnvironmentConfig.site.rest.api
                + '/' + URLS.management.base
                + '/' + URLS.management.catalogues.base
                + '/' + URLS.management.catalogues.storage;//agregar la ruta completa
            var promise_storage = catalog_service.getByID(element);
            promise_storage.then(function (response_storage) {
                vm.storage = response_storage;
                vm.storage = _.pick(vm.storage, 'descripcion', 'estiba_max', 'nombre', 'pasillo_max', 'profundidad_max', 'id');
                //we need to transform the max values from string to int
                vm.storage.estiba_max = parseInt(vm.storage.estiba_max);
                vm.storage.pasillo_max = parseInt(vm.storage.pasillo_max);
                vm.storage.profundidad_max = parseInt(vm.storage.profundidad_max);

            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });
        }

        function increment_element(coordinate) {

            switch (coordinate) {
                case 0:
                    if (vm.asset_location.pasillo == null || vm.asset_location.pasillo < 0) {
                        vm.asset_location.pasillo = 0;
                    }
                    vm.asset_location.pasillo++;
                    break;
                case 1:
                    if (vm.asset_location.estiba == null || vm.asset_location.pasillo < 0) {
                        vm.asset_location.estiba = 0;
                    }
                    vm.asset_location.estiba++;
                    break;
                case 2:
                    if (vm.asset_location.profundidad == null || vm.asset_location.pasillo < 0) {
                        vm.asset_location.profundidad = 0;
                    }
                    vm.asset_location.profundidad++;
                    break;
                default:
                    vm.asset_location.pasillo++;
            }
        }

        function decrement_element(coordinate) {

            switch (coordinate) {
                case 0:
                    if (vm.asset_location.pasillo == null) {
                        vm.asset_location.pasillo = 0;
                    }
                    vm.asset_location.pasillo--;
                    if (vm.asset_location.pasillo < 0) {
                        vm.asset_location.pasillo = 0;
                    }
                    break;
                case 1:
                    if (vm.asset_location.estiba == null) {
                        vm.asset_location.estiba = 0;
                    }
                    vm.asset_location.estiba--;
                    if (vm.asset_location.estiba < 0) {
                        vm.asset_location.estiba = 0;
                    }
                    break;
                case 2:
                    if (vm.asset_location.profundidad == null) {
                        vm.asset_location.profundidad = 0;
                    }
                    vm.asset_location.profundidad--;
                    if (vm.asset_location.profundidad < 0) {
                        vm.asset_location.profundidad = 0;
                    }
                    break;
                default:
                    vm.asset_location.pasillo--;
            }
        }

        function object_builder() {
            vm.asset_id = vm.asset_location.cabinet_id;
            vm.asset_location.bodega_id = vm.storage.id;
            if (!vm.type_storage) {
                vm.asset_location.no_capitalizado_id = vm.asset_location.cabinet_id;
                vm.asset_location = _.omit(vm.asset_location, 'cabinet_id');
            }
            saveAssetLocation();
        }

        function enableEdition() {
            vm.edition = true;
        }

        function saveAssetLocation() {
            var promiseCreateLocation = assetStoringProvider.create(vm.asset_location);
            promiseCreateLocation.then(function () {
                ErrorHandler.successCreation();
                clear();

            }).catch(function (errormsg) {
                ErrorHandler.errorTranslate(errormsg);

            });

        }

        function clear() {
            vm.asset_location = {}; // Objeto de localización de Cabinet
            vm.storage = {}; //Objeto contenedor de la Bodega
            vm.asset = {}; //objeto contenedor del cabinet
            vm.edition = true; // Booleano que permite mostrar los campos de seleccion de sucursal y/ó bodega

        }

        function changeStorage() {
            vm.editionStorage = !vm.editionStorage;

        }

        function search_asset() {
            if (vm.type_storage) {
                //Search in cabinets location
                clear();
                var promiseCabinetInfo = cabinetUC.getByID(vm.asset_id);
                promiseCabinetInfo.then(function (asset) {

                    vm.asset = asset;
                    vm.asset_location.cabinet_id = vm.asset.economico;
                    //selection subsidiary
                    if (vm.asset.sucursal) {
                        onSubsidiarySelect(vm.asset.sucursal.id);

                    }
                    else {
                        toastr.error(vm.errorNotSubsidiary, vm.errorTitle);
                        clear();

                    }
                    //Validación Posicionamiento existente
                    if (vm.asset.posicionamiento) {
                        vm.editionStorage = false;
                        onElementSelect(vm.asset.posicionamiento.bodega.id);
                        vm.asset_location.pasillo = vm.asset.posicionamiento.pasillo;
                        vm.asset_location.estiba = vm.asset.posicionamiento.estiba;
                        vm.asset_location.profundidad = vm.asset.posicionamiento.profundidad;
                        vm.edition = false;
                    }
                    else {
                        vm.edition = true;
                        vm.editionStorage = true;
                    }


                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });

            }
            else {
                //search in unrecognizible assets location

                var promiseUnrecognizibleAssetInfo = noLabeled.getByID(vm.asset_id);
                promiseUnrecognizibleAssetInfo.then(function (asset) {

                    vm.asset = asset;
                    vm.asset_location.cabinet_id = vm.asset.id;

                    //selectionsSubsidiary
                    if (vm.asset.sucursal) {
                        onSubsidiarySelect(vm.asset.sucursal.id);

                    }
                    else {
                        toastr.error(vm.errorNotSubsidiary, vm.errorTitle);
                        clear();

                    }
                    if (vm.asset.posicionamiento) {
                        onElementSelect(vm.asset.posicionamiento.bodega.id);
                        vm.asset_location.pasillo = vm.asset.posicionamiento.pasillo;
                        vm.asset_location.estiba = vm.asset.posicionamiento.estiba;
                        vm.asset_location.profundidad = vm.asset.posicionamiento.profundidad;
                        vm.edition = false;
                    }
                    else {
                        vm.edition = true;
                        vm.editionStorage = true;
                    }


                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
                });


            }

        }


    }
})();
