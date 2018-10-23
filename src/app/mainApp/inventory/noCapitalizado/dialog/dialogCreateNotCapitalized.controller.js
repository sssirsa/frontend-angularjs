/**
 * Created by Alejandro Noriega on 15/10/2018.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('notCapitalizedDialogController', notCapitalizedDialogController);

    function notCapitalizedDialogController($mdDialog, Translate, toastr, User, URLS, Sucursal, Helper)
    {
        var vm = this;
        vm.user = User.getUser();

        //Functions
        vm.create = create;
        vm.cancel = cancel;
        vm.loadSucursales = loadSucursales;
        vm.onSelectedSucursal = onSelectedSucursal;

        //variables definicion
        vm.sucursales = null;
        vm.limitSucursales = 20;
        vm.offsetSucursales = 0;

        //Fields
        vm.catalogSucursal = {
            catalog:{
                url: URLS.sucursal,
                kind: 'Web',
                name: 'Sucursal',
                loadMoreButtonText: 'Cargar mas',
                model: 'id',
                option: 'nombre'
            },
            elements: 'results'

        };


        function create() {
            $mdDialog.hide("Regreso lo que hizo");
            /*vm.createPromise = Cabinet.createClean(vm.cabinet).then(function (res) {
                $mdDialog.hide(vm.cabinet.economico);
            }).catch(function (err) {
                $mdDialog.cancel(err);
            });*/
        }

        function cancel() {
            console.log("Cancelaaaaa");
            $mdDialog.cancel();
        }

        function loadSucursales() {
            if (!vm.sucursales) {
                return Sucursal.listObject(vm.limitSucursales, vm.limitSucursales)
                    .then(function (sucursalList) {
                        vm.sucursales = Helper.filterDeleted(sucursalList.results, true);
                    })
                    .catch(function (sucursalListError) {
                        $log.error(sucursalListError);
                    });
            }
        }

        function onSelectedSucursal(element) {
            vm.request.sucursal = element;
        }
    }
})();
