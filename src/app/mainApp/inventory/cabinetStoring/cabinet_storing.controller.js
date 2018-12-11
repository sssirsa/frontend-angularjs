/**
 * Created by franciscojaviercerdamartinez on 12/7/18.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory')
        .controller('cabinetStorageController', cabinetStorageController);

    function cabinetStorageController($scope, Translate, toastr, Helper,URLS) {
        //Variable definition
        var vm = this;
        vm.asset_location = {}; // Objeto de localización de Cabinet
        vm.storage = {}; //Objeto contenedor de la Bodega
        vm.type_storage = true;// true -> Capitalizado, false-> No Capitalizado

        //funciones
        vm.onBrandSelect = onSubsidiarySelect;


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
                }
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
                }
            }

        };

        function onSubsidiarySelect(element) {
            vm.storage = null;
            vm.subsidiary = element;
            vm.catalogues.storage_by_sucursal.catalog.url = URLS.management.catalogues.storage + '?sucursal__id='+vm.subsidiary.id;
        }



    }
})();
