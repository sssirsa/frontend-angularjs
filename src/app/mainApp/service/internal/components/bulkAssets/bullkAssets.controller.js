/**
 * Created by franciscojaviercerdamartinez on 1/10/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('bulkAsset', {
            templateUrl: 'app/mainApp/service/internal/components/bulkAssets/bulkAssets.tmpl.html',
            controller: bulkAssetsController,
            bindings: {
                bulkAsset: '<',
                onSelect: '&',
                sucursal: '<'
            }
        });

    function bulkAssetsController() {

        var vm = this;
        vm.finalAssetBulk = {};
        vm.stockHere = {};

        vm.selectElement = selectElement;
        vm.validaMax = validaMax;
        //insumo_lote_id


        activate();


        function activate() {
            getMaxValue();

        }

//Function that deteminates whats is  the accepted or the usable quantity of inventory it depends of
        //the stock and the max value usable for the differents assets is considered.
        function getMaxValue() {
            getStock();
            var stock = Number(vm.stock[0].cantidad);
            var used = Number(vm.bulkAsset.cantidad);
            console.log("stock:" + stock);
            console.log("used:" + used);
            if (used < 1) {
                vm.showSelector = true;
                if (stock < used) {
                    if (stock > 0) {
                        vm.maxUseAccepted = stock;
                        console.log("vm.maxUseAccepted:" + vm.maxUseAccepted);
                    }
                    else {
                        vm.notStock = true;
                    }
                } else {
                    vm.maxUseAccepted = used;
                    console.log("vm.maxUseAccepted:" + vm.maxUseAccepted);
                }
            } else {
                if (stock < used) {
                    vm.notStock = true;
                } else {
                    vm.maxUseAccepted = used;
                    console.log("vm.maxUseAccepted:" + vm.maxUseAccepted);
                }
            }

        }

//Function with the objective of get the stock of the bulk asset in the subsidary given
        function getStock() {
            vm.stock = vm.bulkAsset.catalogo_insumo_lote.stock.filter(function (element) {
                return element.sucursal.id === 1;
            });
        }

//Function that validate the max value of the bulk assets acceptec
        function validaMax() {
            if (parseFloat(vm.finalAssetBulk.cantidad) > parseFloat(vm.maxUseAccepted)) {
                vm.finalAssetBulk.cantidad = vm.maxUseAccepted;
            }

        }

        function selectElement() {

            if (vm.use_asset) {
                console.log("ya lo mande");
                var assetSelected={};
                assetSelected.insumo_lote_id=vm.bulkAsset.id;
                assetSelected.cantidad=vm.finalAssetBulk.cantidad;
                vm.onSelect({element:assetSelected});

            }

        }




    }
})();
