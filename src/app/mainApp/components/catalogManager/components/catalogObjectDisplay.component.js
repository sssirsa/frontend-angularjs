(function () {
    angular
        .module('app.mainApp')
        .component('catalogObjectDisplay', {
            templateUrl: 'app/mainApp/components/catalogManager/components/catalogObjectDisplay.tmpl.html',
            controller: CatalogObjectDisplay,
            bindings: {
                element: '<',
                fields:'<',
                onElementSelect: '&'
            }
        });

    function CatalogObjectDisplay() {
        var vm = this;

        //Functions
        vm.elementSelection = elementSelection;
        vm.downloadFile = downloadFile;

        function activate() {
            treatObjectPropertyFields();
        }

        activate();

        //File downloading into new window
        function downloadFile(url) {
            $window.open(url);
        }

        function elementSelection(element) {
            vm.onElementSelect({ element: element });
        }

        //Treat the object fields and convert the desired property to a root property of the main object
        function treatObjectPropertyFields() {
            for (element in vm.fields) {
                if (vm.fields[element].type === 'object') {
                    let nested_properties = vm.fields[element]
                        .model
                        .split('__');
                    for (var catalog_index = 0; catalog_index < vm.catalogElements.length; catalog_index++) {
                        catalogElement = vm.catalogElements[catalog_index];
                        let actualProperty = catalogElement[nested_properties[0]];
                        for (var i = 1; i < nested_properties.length; i++) {
                            actualProperty = actualProperty[nested_properties[i]];
                        }
                        catalogElement[vm.fields[element]
                            .model] = actualProperty;
                    }
                }
            }
        }
    }
})();
