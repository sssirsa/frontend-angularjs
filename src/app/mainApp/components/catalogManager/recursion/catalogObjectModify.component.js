(function () {
    angular
        .module('app.mainApp')
        .component('catalogObjectModify', {
            templateUrl: 'app/mainApp/components/catalogManager/recursion/catalogObjectModify.tmpl.html',
            controller: CatalogObjectModifyController,
            controllerAs: 'vm',
            bindings: {
                element: '=', //Bidirectional bindings
                fields: '<'
            }
        });
    function CatalogObjectModifyController() {
        var vm = this;

        vm.objectToModify = vm.element;

        function activate() {
            //Handle aditional information loading
            bindCatalogs();
            loadCatalogArrays();
        }

        activate();

        vm.filesSelected = function filesSelected(files, field) {
            //fileProcessing MUST be a function in case it exists
            let fileProcessing = field.fileUploader['filesSelected'];
            if (fileProcessing) {
                files = fileProcessing(files);
            }
            vm.objectToModify[field.model] = files;
        }

        vm.onElementSelect = function onElementSelect(element, field) {
            if (element) {
                vm.objectToModify[field.model] = element;
                loadCatalogDependance(element, field.model);
            }
        }

        function loadCatalogDependance(element, fieldName) {
            //Validating that a element has been provided
            if (element) {
                vm.fields.forEach(function loadCataloguesDependanceFieldIterator(field) {
                    //Validating it's a catalog
                    if (field.hasOwnProperty('catalog')) {
                        //Validating it's a dependable catalog
                        if (field.catalog.hasOwnProperty('requires')) {
                            //Validating that this catalog indeed requires of the previously
                            //selected catalog.
                            if (fieldName === field.catalog.requires) {
                                //Validating that a query is provided
                                if (field.catalog.hasOwnProperty('query')) {
                                    field.catalog.query = field.catalog.query;
                                    field.catalog.query_value = element;
                                }
                                else {
                                    console.error('No query has been provided in the catalog object of the field:'
                                        + field.model + ' @function loadCatalogDependance @controller CatalogModifyDialogController');
                                }
                            }
                        }
                    }
                });
            }
            else {
                //Unreachable unless code changes are done
                console.error('No element has been provided for querying, @function loadCatalogDependance @controller CatalogModifyDialogController');
            }
        }

        function bindCatalogs() {
            angular.forEach(
                vm.fields,
                function bindCatalogsRepeater(field) {
                    if (field.type === 'catalog'
                        || field.type === 'catalog_array') {
                        if (field['catalog'].bindTo) {
                            vm.objectToModify[field.model] = JSON.parse(JSON.stringify(vm.objectToModify[field.catalog.bindTo]));
                            console.debug(vm.objectToModify);
                        }
                    }
                    if (field.type === 'options') {
                        if (field['options'].bindTo) {
                            vm.objectToModify[field.model] = JSON.parse(JSON.stringify(vm.objectToModify[field.options.bindTo]));
                        }
                    }
                }
            );
        }

        function loadCatalogArrays() {
            angular.forEach(
                vm.fields,
                function loadCatalogArraysRepeater(field) {
                    if (field.type === 'catalog_array') {
                        vm[field.model + '_chip'] = JSON.parse(
                            JSON.stringify(
                                vm.objectToModify[field.model]
                            ));
                    }
                }
            );
        }

        vm.onArrayElementSelect = function onArrayElementSelect(element, field, value) {
            if (field.hasOwnProperty('validations')
                && field.validations.hasOwnProperty('max')
                && !(field.validations.max <= vm.objectToModify[field.model].length)) {
                console.error('Maximum quantity of "catalog_array" objects has been reached'
                    + '@function onArrayElementSelect @controller CatalogModifyDialogController');
            }
            else {
                addCatalogToArray(element, field, value);
            }

        }

        //Internal function
        //It add just the returned ID of the elements to the catalog_array
        function addCatalogToArray(element, field, value) {
            if (element) {
                //if (!vm.objectToModify[field.model]) {
                //    vm.objectToModify[field.model] = [];
                //}
                //if (!vm[field.model + '_chip']) {
                //    vm[field.model + '_chip'] = [];
                //}
                vm.objectToModify[field.model].push(element);
                vm[field.model + '_chip'].push(value);
            }
        }

        vm.onArrayElementRemove = function onArrayElementRemove(index, field) {
            vm.objectToModify[field.model].splice(index, 1);
        }
    }
})();
