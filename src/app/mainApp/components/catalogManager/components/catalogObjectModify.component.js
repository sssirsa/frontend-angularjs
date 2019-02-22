(function () {
    angular
        .module('app.mainApp')
        .component('catalogObjectModify', {
            templateUrl: 'app/mainApp/components/catalogManager/components/catalogObjectModify.tmpl.html',
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
        vm.array_objects = {};

        function activate() {
            //Handle aditional information loading
            angular.forEach(vm.fields, function (field) {
                if (field.type === 'array_object') {
                    vm.array_objects[field.model] = {};
                }
            });
            ///bindData();
            //loadCatalogues();
            //Functionality delegated to the catalog-select Component
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

        function bindData() {
            angular.forEach(
                vm.fields,
                function bindDataRepeater(field) {
                    if (
                        field.type !== 'catalog'
                        && field.type !== 'catalog_array'
                        //&& field.type !== 'array_object'
                        && field.type !== 'fileUploader') {
                        if (field.bindTo) {
                            vm.objectToModify[field.model] = JSON.parse(
                                JSON.stringify(
                                    vm.objectToModify[field.bindTo]
                                ));
                            delete (vm.objectToModify[field.bindTo]);
                        }
                    }
                    if (field.type === 'catalog') {
                        if (field.bindTo) {
                            let catalogElement = JSON.parse(
                                JSON.stringify(
                                    vm.objectToModify[field.bindTo]
                                ))[field.catalog.model];
                            vm.objectToModify[field.model] = catalogElement;
                            delete (vm.objectToModify[field.bindTo]);
                        }
                        else {
                            let catalogElement = JSON.parse(
                                JSON.stringify(
                                    vm.objectToModify[field.model]
                                ))[field.catalog.model];
                            vm.objectToModify[field.model] = catalogElement;
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
                        if (
                            vm.objectToModify[field.model]
                            || vm.objectToModify[field.bindTo]
                        ) {
                            let tempCatalogArray;
                            if (field.bindTo) {
                                tempCatalogArray = JSON.parse(
                                    JSON.stringify(
                                        vm.objectToModify[field.bindTo]
                                    ));
                                delete (vm.objectToModify[field.bindTo]);
                            }
                            else {
                                tempCatalogArray = JSON.parse(
                                    JSON.stringify(
                                        vm.objectToModify[field.model]
                                    ));
                            }

                            vm[field.model + '_chip'] = JSON.parse(
                                JSON.stringify(
                                    tempCatalogArray
                                ));

                            if (!vm.objectToModify[field.model]) {
                                vm.objectToModify[field.model] = [];
                            }

                            for (
                                var catalogIndex = 0;
                                catalogIndex < tempCatalogArray.length;
                                catalogIndex++
                            ) {
                                vm.objectToModify[field.model].push(
                                    tempCatalogArray[catalogIndex][field.catalog.model]
                                );
                            }
                        }
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

        vm.addObjectToArray = function addObjectToArray(field) {
            if (!vm.objectToModify[field.model]) {
                vm.objectToModify[field.model] = [];
            }
            vm.objectToModify[field.model].push({});
        }

        vm.removeObjectToArray = function removeObjectToArray(field, index) {
            vm.objectToModify[field.model].splice(index, 1);
        }
    }
})();
