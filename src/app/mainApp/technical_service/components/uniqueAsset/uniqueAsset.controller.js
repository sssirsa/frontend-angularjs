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

    }
})();
