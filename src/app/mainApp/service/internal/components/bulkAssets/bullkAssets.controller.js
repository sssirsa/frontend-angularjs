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
                bulkAssetSelected: '&',
                sucursal: '<'
            }
        });

    function bulkAssetsController() {

        var vm = this;
        vm.finalAssetBulk = {};
        vm.stockHere = {};
        //insumo_lote_id
        activate();
        function activate() {


        }

        function getMaxValue() {
            var stock = Number(getStock());
            var used = Number(vm.bulkAsset.cantidad);
            if (used < 1) {
                vm.showSelector=true;
                if (stock < used) {
                    if(stock>0) {
                        vm.maxUseAccepted = stock;
                    }
                    else{
                        vm.notStock=true;
                    }
                } else {
                    vm.maxUseAccepted = used;
                }
            }else{
                if (stock < used) {
                    vm.notStock=true;
                } else {
                    vm.finalAssetBulk.cantidad = used;
                }
            }

        }

        function getStock() {


            var stock = vm.bulkAsset.catalogo_insumo_lote.stock.filter(function (element) {
                return element.sucursal.id === 1;
            });
            return stock.cantidad;

        }


    }
})();
