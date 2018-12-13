/**
 * Created by franciscojaviercerdamartinez on 12/7/18.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory')
        .controller('cabinetStorageController', cabinetStorageController);

    function cabinetStorageController($scope, Translate, toastr, Helper,URLS, CATALOG,ErrorHandler) {
        //Variable definition
        var vm = this;
        vm.asset_location = {}; // Objeto de localización de Cabinet
        vm.storage = {}; //Objeto contenedor de la Bodega
        vm.type_storage = true;// true -> Capitalizado, false-> No Capitalizado


        //funciones
        vm.onSubsidiarySelect = onSubsidiarySelect;
        vm.onElementSelect=onElementSelect;


        //Translates
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');

        //Blank variables templates
        vm.catalogues = {
            subsidiary: {
                catalog: {
                    url: URLS.management.catalogues.subsidiary,
                    kind: 'Management',
                    name: Translate.translate('STORAGE.SUCURSAL'),
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
                noResults:Translate.translate('ERRORS.NO_RESULTS')
            }, storage_by_sucursal: {
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
                noResults:Translate.translate('ERRORS.NO_RESULTS')
            }

        };

        function onSubsidiarySelect(element) {
            vm.storage = null;
            vm.subsidiary = element;
            vm.catalogues.storage_by_sucursal.catalog.url = URLS.management.catalogues.storage + '?sucursal__id='+vm.subsidiary;
        }

        function onElementSelect(element) {

            CATALOG.management.url=URLS.management.catalogues.storage;
            var promise_storage=CATALOG.management.getByID(element);
            promise_storage.then(function (response_storage) {
                vm.storage=response_storage;
                vm.storage=_.pick(vm.storage,'descripcion','estiba_max','nombre','pasillo_max','profundidad_max');
                //we need to transform the max values from string to int
                vm.storage.estiba_max=parseInt(vm.storage.estiba_max);
                vm.storage.pasillo_max=parseInt(vm.storage.pasillo_max);
                vm.storage.profundidad_max=parseInt(vm.storage.profundidad_max);
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });




        }



    }
})();
