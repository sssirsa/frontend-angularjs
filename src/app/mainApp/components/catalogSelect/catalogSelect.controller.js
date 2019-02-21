/*
 *      catalog:{
 *          url: string,                 Full or partial URL depending on the kind
 *          query: string,               (Optional) query to be used if the catalog depends of other
 *                                       In this component it must be received without the value
 *                                       to use directly in the API.
 *                                       Example: ?parameter_name=
 *          query_value:string,          (Optional) Value tu search on the API with the given query.
 *          name: string,                (Optional) Default is "Catalog"
 *          loadMoreButtonText, string   (Optional) Test to show in the 'Load more' Button, default is 'Load more'
 *          model: string,               From the catalog object, which element will be sent (aka: id, name, etc.)
 *          option: string,              (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
 *                                       If not given, then the model will be used.
 *          showModel: boolean,          (Optional) If given, the model and the option will be shown with the following template
 *                                       <b>{{model}}</b> - {{option}}
 *      },
 *      hint: string,         (Optional) Shows a message under the field
 *      icon: string,         (Optional) Shows an icon from FontAwesome or ZMDI
 *      lock: boolean,        (Optional) If given the catalog select will be disabled
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
 *      },
 *      initial:string        (Optional) Must be the ID you want to be selected
 *      ---------------------------------------
 *      RETURNS
 *      {
 *          element: vm.selectedElement[vm.catalog.model],
 *          value: vm.selectedElement
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
                hint: '<',
                icon: '<',
                lock: '<',

                pagination: '<',
                elements: '<',
                lazy: '<',
                initial: '<',
                softDelete: '<',
                required: '<',
                noResults: '<',

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
            if (vm.initial && vm.pagination) {
                //Warranty that lazy is true if you have initial and pagination
                vm.lazy = true;
            }
        }

        function list() {
            //List behaviour handling (initial loading)
            createMainCatalogProvider();
            vm.catalogElements = [];
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
                            if (!vm.pagination) {
                                vm.selectedElement = vm.catalogElements
                                    .filter(function (currentElement) {
                                        return currentElement[vm.catalog.model]
                                            === vm.initial;
                                    })[0];
                                vm.onSelect({
                                    element: vm.selectedElement[vm.catalog.model],
                                    value: vm.selectedElement
                                });
                            }
                            else {
                                createMainCatalogProvider();
                                vm.listLoader = CATALOG_SELECT.detail(vm.initial)
                                    .then(function catalogSelectDetailSuccess(successCallback) {
                                        vm.selectedElement = successCallback;
                                        vm.catalogElements = [];
                                        vm.catalogElements.push(successCallback);
                                        vm.initial = null;
                                        vm.onSelect({
                                            element: vm.selectedElement[vm.catalog.model],
                                            value: vm.selectedElement
                                        });
                                    })
                                    .catch(function catalogSelectDetailError(errorCallback) {
                                        console.error('@CatalogSelectController @list @CATALOG_SELECT.detail', errorCallback);
                                    });
                            }
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
                });
            }
        }

        function createMainCatalogProvider() {
            vm.CatalogProvider = CATALOG_SELECT;
            if (vm.catalog.hasOwnProperty('query')
                && vm.catalog.hasOwnProperty('query_value')) {
                vm.CatalogProvider.url = vm.catalog.url
                    + vm.catalog.query
                    + vm.catalog.query_value;
            }
            else {
                vm.CatalogProvider.url = vm.catalog.url;
            }
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG_SELECT;
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
                vm.onSelect({
                    element: vm.selectedElement[vm.catalog.model],
                    value: vm.selectedElement
                });
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
