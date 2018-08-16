/*
 *      catalog:{
 *          url: string,         Full or partial URL depending on the kind
 *          kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
 *          name: string,        (Optional) Default is "Catalog"
 *          model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
 *          option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
 *                               If not given, then the model will be used
 *      },
 *      pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
 *          total: string,        (Optional) Binding for the number of total elements
 *          next: string,         (Optional) Binding for the url that brings to the next page
 *      },
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
 *      softDelete: {
 *          hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
 *          reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
 *      }
 * */
(function () {
    angular
        .module('app.mainApp')
        .component('catalogSelect', {
            temlateUrl: 'app/mainApp/components/catalogSelect/catalogSlect.tmpl.html',
            controller: CatalogSelectController,
            bindings: {
                catalog: '<',
                pagination: '<',
                elements: '<',
                softDelete:'<',

                onSuccessList: '&',
                onErrorList: '&'
            }
        });
    function CatalogSelectController(
        CATALOG
    ) {
        var vm = this;

        //Variables
        vm.catalog = catalog;
        vm.pagination = pagination;
        vm.elements = elements;
        vm.sofDelete = softDelete;

        vm.Catalogrovider = null;
        vm.PaginationProvider = null;
        vm.catalogElements = [];
        vm.paginationHelper = {};

        //Functions
        vm.loadMore = loadMore;

        init();

        function init() {
            list();
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
                        vm.CatalogProvider = CATALOG.mobile;
                        break;
                    case 'Web':
                        vm.CatalogProvider = CATALOG.web;
                        break;
                    default:
                        vm.CatalogProvider = CATALOG.generic;
                        break;
                }
            }
            else {
                vm.CatalogProvider = CATALOG.generic;
            }
            vm.CatalogProvider.url = vm.url;
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG.generic;
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
                        var elements = response.data;
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
            var hide = vm.actions['LIST'].softDelete['hide'];
            var reverse = vm.actions['LIST'].softDelete['reverse'];
            //ng - hide="element[$ctrl.actions['LIST'].softDelete['hide']] ^ $ctrl.actions['LIST'].softDelete['reverse']"
            var filteredElements = [];
            elements.forEach(function (element) {
                //Negated XOR comparison to decide whether to show or not the element
                if (!element[hide] ? !reverse : reverse) {
                    filteredElements.push(element);
                }
            });
            return filteredElements;
        }

    }
})();
