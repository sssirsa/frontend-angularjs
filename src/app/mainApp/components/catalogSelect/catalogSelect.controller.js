/*
 *      catalog:{
 *          url: string,         Full or partial URL depending on the kind
 *          kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
 *          name: string,        (Optional) Default is "Catalog"
 *          loadMoreButtonText, string (Optional) Test to show in the 'Load more' Button, default is 'Load more'
 *          model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
 *          option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
 *                               If not given, then the model will be used
 *      },
 *      pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
 *          total: string,        (Optional) Binding for the number of total elements
 *          next: string,         (Optional) Binding for the url that brings to the next page
 *      },
 *      required: boolean,    (Optional) To be used in form validation
 *      elements: string,     (Optional) Model used if the elements are not returned at the root of the response
 *                            aka: the API returns the array of objects in an element of the response, as in pagination
 *                            Example:
 *                            {
 *                              total:'',
 *                              description:'',
 *                              results:[
 *                                  {...},
 *                                  {...}
 *                              ]
 *                            }
 *                            In this case 'elements' should receive the parameter 'results'
 *                            
 *      lazy: boolean,        (Optional) If given, the catalog won't load until the selector is opened
 *      initial: string,      (Optional) If given, the lazy functionality will be disabled, and and initial
 *                            value will be selected by the model given inside the catalog object.
 *      softDelete: {
 *          hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
 *          reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
 *      }
 * */
(function () {
    angular
        .module('app.mainApp')
        .component('catalogSelect', {
            templateUrl: 'app/mainApp/components/catalogSelect/catalogSelect.tmpl.html',
            controller: CatalogSelectController,
            bindings: {
                catalog: '<',
                pagination: '<',
                elements: '<',
                lazy: '<',
                initial: '<',
                softDelete: '<',
                required: '<',

                onSuccessList: '&',
                onErrorList: '&',
                onSelect: '&',
                onOpen: '&'
            }
        });
    function CatalogSelectController(
        CATALOG_SELECT
    ) {
        var vm = this;
        ////Variables
        //vm.catalog = catalog;
        //vm.pagination = pagination;
        //vm.elements = elements;
        //vm.sofDelete = softDelete;

        vm.Catalogrovider = null;
        vm.PaginationProvider = null;
        vm.catalogElements = [];
        vm.paginationHelper = {};
        vm.selectedElement = null;

        //Functions
        vm.loadMore = loadMore;
        vm.onClose = onClose;
        vm.onSelectOpen = onSelectOpen;

        init();

        function init() {
            if (!vm.lazy) {
                //The catalog is not loaded in lazy mode
                list();
            }
            else {
                //The catalog is required to be loaded in lazy mode
                if (vm.initial) {
                    //The parameter initial was given, so the lazy parameter is ignored
                    list();
                }
            }
        }

        function list() {
            //List behaviour handling (initial loading)
            createMainCatalogProvider();
            if (vm.catalog) {
                vm.listLoader = vm.CatalogProvider
                    .list()
                    .then(function (elements) {
                        //Elements list is returned in any other model
                        if (vm.elements) {
                            vm.catalogElements = elements[vm.elements];
                        }
                        //Elements list is returned directly as an array
                        else {
                            vm.catalogElements = elements;
                        }
                        //Determine if the soft delete parameter is given, and procede with the filtering
                        if (vm.softDelete) {
                            vm.catalogElements = filterDeleted(vm.catalogElements);
                        }

                        //Building the pagination helper
                        //(if pagination element present)
                        //if the 'pagination' contains the specific models,
                        //then those will be used, otherwise, the default models will.
                        if (vm.pagination) {
                            //Total of elements model to be used
                            if (vm.pagination['total']) {
                                vm.paginationHelper['total'] = elements[vm.pagination['total']];
                            }
                            else {
                                vm.paginationHelper['total'] = elements['total'];
                            }
                            //Next page model to be used
                            if (vm.pagination['next']) {
                                vm.paginationHelper['next'] = elements[vm.pagination['next']];
                            }
                            else {
                                vm.paginationHelper['next'] = elements['next'];
                            }
                        }
                        vm.onSuccessList({ elements: vm.catalogElemets });
                        //If initial parameter is given, select the element after listing the catalogue
                        if (vm.initial) {
                            vm.selectedElement = vm.initial;
                        }
                    })
                    .catch(function (errorElements) {
                        console.error(errorElements);
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({
                    error: '"catalog" parameter is not defined'
                })
            }
        }

        function createMainCatalogProvider() {
            if (vm.catalog.kind) {
                switch (vm.catalog.kind) {
                    case 'Mobile':
                        vm.CatalogProvider = CATALOG_SELECT.mobile;
                        break;
                    case 'Web':
                        vm.CatalogProvider = CATALOG_SELECT.web;
                        break;
                    default:
                        vm.CatalogProvider = CATALOG_SELECT.generic;
                        break;
                }
            }
            else {
                vm.CatalogProvider = CATALOG_SELECT.generic;
            }
            vm.CatalogProvider.url = vm.catalog.url;
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG_SELECT.generic;
        }

        function loadMore() {
            if (vm.paginationHelper.next) {
                if (vm.pagination) {
                    createPaginationProvider();
                }
                vm.PaginationProvider.url = vm.paginationHelper.next;
                vm.loadMoreLoader = vm.PaginationProvider
                    .list()
                    .then(function (response) {
                        var elements = response;
                        //Elements list is returned in any other model
                        if (vm.elements) {
                            vm.catalogElements = vm.catalogElements.concat(elements[vm.elements]);
                        }
                        //Elements list is returned directly as an array
                        else {
                            vm.catalogElements = vm.catalogElements.concat(elements);
                        }
                        //Determine if the soft delete parameter is given, and procede with the filtering
                        if (vm.softDelete) {
                            vm.catalogElements = filterDeleted(vm.catalogElements);
                        }

                        //Updating the pagination helper
                        if (vm.pagination) {
                            //Next page model to be used
                            if (vm.pagination['next']) {
                                vm.paginationHelper['next'] = elements[vm.pagination['next']];
                            }
                            else {
                                vm.paginationHelper['next'] = elements['next'];
                            }
                        }
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        vm.onErrorList({ error: errorElements });
                    });
            }
        }

        function filterDeleted(elements) {
            var hide = vm.softDelete['hide'];
            var reverse = vm.softDelete['reverse'];
            var filteredElements = [];
            elements.forEach(function (element) {
                //Negated XOR comparison to decide whether to show or not the element
                if (!element[hide] ? !reverse : reverse) {
                    filteredElements.push(element);
                }
            });
            return filteredElements;
        }

        function onClose() {
            if (vm.selectedElement) {
                vm.onSelect({ element: vm.selectedElement });
            }
        }

        function onSelectOpen() {
            if (vm.lazy) {
                list();
            }
            vm.onOpen();
        }

    }
})();
