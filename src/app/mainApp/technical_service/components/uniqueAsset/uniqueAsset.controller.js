/**
 * Created by franciscojaviercerdamartinez on 3/20/19.
 */
/**
 * Created by franciscojaviercerdamartinez on 2/5/19.
 */

(function () {

    angular
        .module('app.mainApp')
        .component('uniqueAsset', {
            templateUrl: 'app/mainApp/technical_service/components/uniqueAsset/uniqueAsset.tmpl.html',
            controller: uniqueAssetController,
            bindings: {
                uniqueAssetLoaded: '&',
                uniqueAssetSelected: '<',
                sucursal:'<'

            }
        });
    function uniqueAssetController(Translate, ErrorHandler, uniqueAssetProvider) {
        var vm = this;
        vm.notDetected=[];
        vm.unique_asset_list=[];
        vm.selected_unique_assets=[];
        vm.search_unique_asset=search_unique_asset;
        vm.removePossibleUniqueAsset=removePossibleUniqueAsset;
        vm.onChange=onChange;
        vm.createUnique=createUnique;

        function removePossibleUniqueAsset(element) {
            var index;
            for (index = 0; index < vm.notDetected.length; ++index) {
                if (vm.notDetected[index] === element) {
                    vm.notDetected.splice(index, 1);
                }
            }
        }
        function getDuplicity(unique_asset) {
            var index;
            for (index = 0; index < vm.selected_unique_assets.length; ++index) {
                if (vm.selected_unique_assets[index].no_serie === unique_asset.no_serie) {
                    vm.selected_unique_assets.splice(index, 1);
                }
            }
        }

        function deleteElement(unique_asset) {
            var index;
            for (index = 0; index < vm.selected_unique_assets.length; ++index) {
                if (vm.selected_unique_assets[index].no_serie === unique_asset.no_serie) {
                    vm.selected_unique_assets.splice(index, 1);
                }
            }
            vm.uniqueAssetLoaded({element: vm.selected_unique_assets});
        }

        function addElement(unique_asset){
                getDuplicity();
                vm.selected_unique_assets.push(unique_asset);
                vm.uniqueAssetLoaded({element: vm.selected_unique_assets});

        }
        function onChange(unique_asset){
            console.log(unique_asset)
            if(unique_asset.used){
                addElement(unique_asset);
            }
            else{
                deleteElement(unique_asset);
            }
            console.log("insumos Usados:")
            console.log(vm.selected_unique_assets);

        }

        function search_unique_asset(){
           var promiseUniqueAssets= uniqueAssetProvider.getUniqueAssetsList(vm.barcode);
          promiseUniqueAssets.then(function (uniqueAssetsList) {
              if(uniqueAssetsList.results.length>0) {
                  var i;
                  for(i=0;i<uniqueAssetsList.results.length;++i){
                  vm.unique_asset_list.push(uniqueAssetsList.results[i]);
                  }
              }
              else{
                  vm.notDetected.push(vm.barcode);
              }
              console.log(vm.unique_asset_list);
              console.log(vm.notDetected);
          }).catch(function(errormsg){
              console.log(errormsg);
              ErrorHandler.errorTranslate(errormsg);
          });
        }

        function createUnique(element){
            vm.meta_creation={
                fields:[
                    {
                        type: 'catalog',
                        model: 'catalogo_insumo_unico_id',
                        label: Translate.translate('UNIQUE_ASSET_COMPONENT.CATALOG_UNIQUE_ASSET_BRANCH'),
                        required: true,
                        catalog: {
                            url: EnvironmentConfig.site.rest.api
                            + '/' + URLS.management.base
                            + '/' + URLS.management.catalogues.unique_asset_inventory,
                            name: Translate.translate('UNIQUE_ASSET_COMPONENT.CATALOG_UNIQUE_ASSET_BRANCH'),
                            model: 'id',
                            option: 'description',
                            elements: 'results',//elementos del promise donde iterar
                            showModel: true,//mostrar model y option
                            pagination: {}//manejo de Paginado
                        }
                    },
                    {
                        type: 'text',
                        model: 'no_serie',
                        initial:element,
                        label: Translate.translate('COM.FIELDS.COMPONENT')
                    }
                ]
            };
        }
    }
})();
