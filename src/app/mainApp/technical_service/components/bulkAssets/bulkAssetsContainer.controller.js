/**
 * Created by franciscojaviercerdamartinez on 2/11/19.
 */
(function () {

    angular
        .module('app.mainApp')
        .component('bulkAssetContainer', {
            templateUrl: 'app/mainApp/technical_service/components/bulkAssets/bulkAssetsContainer.tmpl.html',
            controller: bulkAssetsContainerController,
            bindings: {
                sucursal: '<',
                bulkAssets: '&',
                tipoEquipo: '<',
                catalogoEtapa:'<'
            }
        });

    function bulkAssetsContainerController(bulkAssetsProvider,ErrorHandler, User) {

        var vm = this;
        vm.onElementSelect=onElementSelect;
        init();

        function init(){
            var promiseBulkAssetsByStep=bulkAssetsProvider.getByStage(vm.tipoEquipo,vm.catalogoEtapa);
            promiseBulkAssetsByStep.then(function (response) {
                vm.bulks=response.results;

            }).catch(function(error){
                ErrorHandler.errorTranslate(error);
            });
        }

        function onElementSelect(element) {
            getDuplicity(element.insumo_lote_id);
            vm.insumos_lote.push(element);
            vm.bulkAssets({element:vm.insumos_lote});


        }
        function getDuplicity(bulkAssetToFind) {
            var index;
            for (index = 0; index < vm.insumos_lote.length; ++index) {
                if (vm.insumos_lote[index].insumo_lote_id === bulkAssetToFind) {
                    vm.insumos_lote.splice(index, 1);
                }
            }


        }

    }
})();
