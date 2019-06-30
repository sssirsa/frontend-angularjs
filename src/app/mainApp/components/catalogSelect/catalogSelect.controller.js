/*
 *      catalog:{
 *          url: string,                 Without query or pagination parameters
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
 *          elements: string,     (Optional) Model used if the elements are not returned at the root of the response
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
 *          pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
 *          //Next parameter, just used when the url is going to be used from what the API returned.
 *              next: string,         (Optional) Binding for the url that brings to the next page
 *          //Total, limit and offset, used when the component is going to calculate and build the query,
 *          //All of the following are required if no next parameter is given.
 *              total: string,        (Optional) Binding for the number of total elements.
 *              limit: string,        (Optional) Parameter used for the query building, not the number.
 *              offset: string,       (Optional) Parameter used for the query building, not the number.
 *              pageSize: number      (Optional) Used to determine how many results are going to be loaded per page.
 *          },
 *          softDelete: {
 *              hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
 *              reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
 *          },
 *      },
 *      hint: string,         (Optional) Shows a message under the field
 *      icon: string,         (Optional) Shows an icon from FontAwesome or ZMDI
 *      lock: boolean,        (Optional) If given the catalog select will be disabled
 *      required: boolean,    (Optional) To be used in form validation
 *      lazy: boolean,        (Optional) If given, the catalog won't load until the selector is opened
 *      
 *      initial:string,       (Optional) Must be the ID you want to be selected (if single)
 *                            Must be the elements selected with ID and option (if multiple)
 *                            Iy nulls the lazy parameter
 *      showModel:boolean,    (Optional) Allows to shoe the model and the option of the catalog with the following format
 *                            <b>{{model}}</b> - {{option}}
 *      multiple:boolean,     (Optional) Allows to select more than one element.
 *      noResults: string     (Optional) Used when the url return a 0 length array, default is "No results" 
 *      ---------------------------------------
 *      RETURNS
 *      {
 *          element: vm.selectedElement[vm.catalog.model],
 *          value: vm.selectedElement
 *      }
 * */
(function () {
    angular
        .module('catalogSelectComponent')
        .component('catalogSelect', {
            templateUrl: 'app/mainApp/components/catalogSelect/catalogSelect.tmpl.html',
            controller: CatalogSelectController,
            bindings: {
                catalog: '<',//Here goes elemets, pagination and softDelete parameters
                hint: '<',
                icon: '<',
                lock: '<',
                multiple: '<',

                lazy: '<',
                initial: '<',
                required: '<',
                noResults: '<',

                onSuccessList: '&',
                onErrorList: '&',
                onSelect: '&',
                onOpen: '&'
            }
        });
    function CatalogSelectController(
        CATALOG_SELECT,
        $log
    ) {
        var vm = this;

        vm.Catalogrovider = null;
        vm.PaginationProvider = null;
        vm.catalogElements = [];
        vm.paginationHelper = {
            totalPages: null,
            actualPage: null,
            nextPage: null
        };
        vm.selectedElement = null;


        //Functions
        vm.loadMore = loadMore;
        vm.onClose = onClose;
        vm.onSelectOpen = onSelectOpen;

        init();

        function init() {
            if (!vm.lazy || vm.initial) {
                //The catalog is not loaded in lazy mode and when no initial value is given
                list();
            }
        }

        function list() {
            //List behaviour handling (initial loading)
            createMainCatalogProvider();
            vm.catalogElements = [];
            if (vm.catalog) {
                vm.listLoader = vm.CatalogProvider
                    .list()
                    .then(function (apiResponse) {
                        //Elements list is returned in any other model
                        if (vm.catalog.elements) {
                            vm.catalogElements = apiResponse[vm.catalog.elements];
                        }
                        //Elements list is returned directly as an array
                        else {
                            vm.catalogElements = apiResponse;
                        }
                        //Determine if the soft delete parameter is given, and procede with the filtering
                        if (vm.catalog.softDelete) {
                            vm.catalogElements = filterDeleted(vm.catalogElements);
                        }

                        buildPaginationHelper(apiResponse);

                        vm.onSuccessList({ elements: vm.catalogElemets });
                        //If initial parameter is given, select (and load) the element after listing the catalogue
                        if (vm.initial) {
                            initialValueLoad();
                        }
                    })
                    .catch(function (errorElements) {
                        $log.error(errorElements);
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({
                    error: '"catalog" parameter is not defined'
                });
            }
        }

        //Initial paginationHelper building
        function buildPaginationHelper(apiResponse) {
            //Building the pagination helper just if pagination object was provided
            if ("pagination" in vm.catalog) {
                //Next page pagination kind is going to be used.
                if (vm.catalog.pagination['next']) {
                    vm.paginationHelper['nextPage'] = apiResponse[vm.catalog.pagination['next']];
                }
                //Query building pagination is going to be used
                else {
                    //Errors management
                    if (!vm.catalog.pagination['total']) {
                        $log.error("@CatalogSelectController, function @buildPaginationHelper << @list, parameter 'total' was not found on catalog.pagination object");
                        return;
                    }
                    if (!vm.catalog.pagination['limit']) {
                        $log.error("@CatalogSelectController, function @buildPaginationHelper << @list, parameter 'limit' was not found on catalog.pagination object");
                        return;
                    }
                    if (!vm.catalog.pagination['offset']) {
                        $log.error("@CatalogSelectController, function @buildPaginationHelper << @list, parameter 'offset' was not found on catalog.pagination object");
                        return;
                    }
                    if (!vm.catalog.pagination['pageSize']) {
                        $log.error("@CatalogSelectController, function @buildPaginationHelper << @list, parameter 'pageSize' was not found on catalog.pagination object");
                        return;
                    }

                    //If the remainder it's not zero, it means that an aditional page should be added to the count
                    vm.paginationHelper['totalPages'] = Math.ceil(apiResponse[vm.catalog.pagination['total']] / vm.catalog.pagination['pageSize']);

                    vm.paginationHelper['actualPage'] = 1;

                    //Initial URL building
                    if (vm.paginationHelper['totalPages'] > vm.paginationHelper['actualPage']) {
                        if (vm.catalog['query']
                            && vm.catalog['query_value']) {
                            vm.paginationHelper['nextPage'] = vm.catalog.url
                                + '?' + vm.catalog.query
                                + '=' + vm.catalog.query_value
                                + '&limit=' + vm.catalog.pagination['pageSize'];
                        }
                        else {
                            vm.paginationHelper['nextPage'] = vm.catalog.url
                                + '?limit=' + vm.catalog.pagination['pageSize'];
                        }
                        vm.paginationHelper['nextPage'] = vm.paginationHelper['nextPage']
                            + '&offset=' + vm.catalog.pagination['pageSize'];
                    }
                }
            }
        }

        //Called if the parameter vm.initial exists when listing the elements
        function initialValueLoad() {
            //Non paginated catalogue
            if (!vm.catalog.pagination) {
                //Multiple elements to select
                if (vm.multiple) {
                    vm.selectedElement = vm.catalogElements
                        .filter(function (currentElement) {
                            return vm.initial.find(function (iteratedElement) {
                                return iteratedElement === currentElement;
                            });
                        })[0];
                    vm.onClose();
                }
                //Just one element to select
                else {
                    vm.selectedElement = vm.catalogElements
                        .filter(function (currentElement) {
                            return currentElement[vm.catalog.model]
                                === vm.initial;
                        })[0];
                    vm.onClose();
                }
                //Pushing if no elements are in the list or the element is not contained
                if (!elementInList(vm.selectedElement, vm.catalogElements)) {
                    vm.catalogElements.push(vm.selectedElement);
                }
            }
            //Paginated catalogue
            else {
                if (vm.multiple) {
                    vm.selectedElement = angular.fromJson(angular.toJson(vm.initial));
                    //Iterating over every initial object
                    for (var selectedElementRepeater = 0;
                        selectedElementRepeater < vm.selectedElement.length;
                        selectedElementRepeater++) {
                        if (!elementInList(vm.selectedElement[selectedElementRepeater], vm.catalogElements)) {
                            //Adding elements to list if they were not in the actual page of pagination
                            vm.catalogElements.unshift(vm.selectedElement[selectedElementRepeater]);
                        }
                        else {
                            vm.catalogElements.splice(
                                getIndexById(vm.selectedElement[selectedElementRepeater],
                                    vm.catalogElements), 1);
                            vm.catalogElements.unshift(vm.selectedElement[selectedElementRepeater]);
                        }
                    }
                    vm.onClose();
                }
                else {
                    createMainCatalogProvider(true);
                    vm.listLoader = CATALOG_SELECT.detail(vm.initial)
                        .then(function catalogSelectDetailSuccess(successCallback) {
                            vm.selectedElement = successCallback;
                            if (!vm.catalogElements) {
                                vm.catalogElements = [];
                            }
                            if (!elementInList(successCallback, vm.catalogElements)) {
                                vm.catalogElements.unshift(successCallback);
                            }
                            else {
                                vm.catalogElements.splice(
                                    getIndexById(vm.selectedElement,
                                        vm.catalogElements), 1);
                                vm.catalogElements.unshift(vm.selectedElement);
                            }
                            vm.onClose();

                        })
                        .catch(function catalogSelectDetailError(errorCallback) {
                            $log.error('@CatalogSelectController @list @CATALOG_SELECT.detail', errorCallback);
                        });

                }
            }
        }

        //If the element is on the list, it returns it, else, returns undefined
        function elementInList(element, list) {
            return list.find(function (iteratedElement) {
                return iteratedElement[vm.catalog.model] === element[vm.catalog.model];
            });
        }

        function getIndexById(element, list) {
            var index = null;
            var listIterator = 0;
            while (listIterator < list.length && !index) {
                if (list[listIterator][vm.catalog.model] === element[vm.catalog.model]) {
                    index = listIterator;
                }
                listIterator++;
            }
            return index;
        }

        function createMainCatalogProvider(detailRequest) {
            vm.CatalogProvider = CATALOG_SELECT;
            if (detailRequest) {
                vm.CatalogProvider.url = vm.catalog.url;
            }
            else {
                if (vm.catalog['query']
                    && vm.catalog['query_value']) {
                    vm.CatalogProvider.url = vm.catalog.url
                        + '?' + vm.catalog.query
                        + '=' + vm.catalog.query_value;
                    if ("pagination" in vm.catalog) {
                        //Build paginated URL
                        vm.CatalogProvider.url = vm.CatalogProvider.url
                            + '&limit=' + vm.catalog.pagination.pageSize
                            + '&offset=' + '0';
                    }
                }
                else {//Initial URL building
                    vm.CatalogProvider.url = vm.catalog.url;
                    if ("pagination" in vm.catalog) {
                        //Build paginated URL
                        vm.CatalogProvider.url = vm.CatalogProvider.url
                            + '?limit=' + vm.catalog.pagination.pageSize
                            + '&offset=' + '0';
                    }
                }
            }
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG_SELECT;
        }

        function loadMore() {
            if (vm.paginationHelper['nextPage']) {
                if (vm.catalog.pagination) {
                    createPaginationProvider();
                }
                vm.PaginationProvider.url = vm.paginationHelper['nextPage'];
                vm.loadMoreLoader = vm.PaginationProvider
                    .list()
                    .then(function (response) {
                        var elements = response;
                        var loadedElementList = [];
                        //Elements list is returned in any other model
                        if (vm.catalog.elements) {
                            //Add the returned elements after the list sanitation
                            //vm.catalogElements = vm.catalogElements.concat(elements[vm.catalog.elements]);
                            loadedElementList = elements[vm.catalog.elements];
                        }
                        //Elements list is returned directly as an array
                        else {
                            loadedElementList = elements;
                        }
                        //This procedures are required because of the initial loading of the elements
                        //Are just used in the case of pagination
                        //and when an initial value exists
                        if (vm.initial) {
                            if (vm.multiple) {
                                for (var selectedElementRepeater = 0;
                                    selectedElementRepeater < vm.selectedElement.length;
                                    selectedElementRepeater++) {
                                    //Validating if one of the selected elements is present in the actual page
                                    if (elementInList(vm.selectedElement[selectedElementRepeater], loadedElementList)) {
                                        //remove vm.selectedElement[selectedElementRepeater]
                                        loadedElementList.splice(
                                            getIndexById(vm.selectedElement[selectedElementRepeater],
                                                loadedElementList
                                            ), 1);
                                    }
                                }

                            }
                            else {
                                //Validate if selected element is present on the actual page
                                if (elementInList(vm.selectedElement, loadedElementList)) {
                                    //remove vm.selectedElement
                                    loadedElementList.splice(
                                        getIndexById(
                                            vm.selectedElement,
                                            loadedElementList
                                        ), 1);
                                }
                            }
                        }
                        //Appending elemets to the now sanitized list
                        vm.catalogElements = vm.catalogElements.concat(loadedElementList);

                        //Determine if the soft delete parameter is given, and procede with the filtering
                        if (vm.catalog.softDelete) {
                            vm.catalogElements = filterDeleted(vm.catalogElements);
                        }

                        //Updating the pagination helper
                        updatePaginationHelper(vm.paginationHelper.actualPage + 1, response);

                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        vm.onErrorList({ error: errorElements });
                    });
            }
        }

        //Just works for loading more pages.
        function updatePaginationHelper(requestedPage, response) {
            //Valid page
            if (requestedPage >= 1) {
                //Next page handling by returned URL(if aplicable)
                if (vm.catalog.pagination['next']) {
                    vm.paginationHelper['nextPage'] = response[vm.catalog.pagination['next']];
                }
                //URL building pagination handling
                else {
                    //Requested next page
                    if (requestedPage > vm.paginationHelper['actualPage']) {
                        vm.paginationHelper['actualPage']++;
                    }

                    //Next page handling
                    if (vm.paginationHelper['actualPage'] < vm.paginationHelper['totalPages']) {
                        if (vm.catalog['query']
                            && vm.catalog['query_value']) {
                            vm.paginationHelper['nextPage'] = vm.catalog.url
                                + '?' + vm.catalog.query
                                + '=' + vm.catalog.query_value
                                + '&limit=' + vm.catalog.pagination['pageSize']
                                + '&offset=' + (vm.paginationHelper['actualPage'] * vm.catalog.pagination['pageSize']);
                        }
                        else {
                            vm.paginationHelper['nextPage'] = vm.catalog.url
                                + '?limit=' + vm.catalog.pagination['pageSize']
                                + '&offset=' + (vm.paginationHelper['actualPage'] * vm.catalog.pagination['pageSize']);
                        }
                    }
                    else {
                        vm.paginationHelper['nextPage'] = null;
                    }
                }
            }
            else {
                //Invalid page
                $log.error("@CatalogSelect controller, @updatePaginationHelper function, requestedPage parameter is not valid, must be greater or equal to 1");
            }
        }

        function filterDeleted(elements) {
            var hide = vm.catalog.softDelete['hide'];
            var reverse = vm.catalog.softDelete['reverse'];
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
                if (!vm.multiple) {
                    //Returns the element and value as is.
                    vm.onSelect({
                        element: vm.selectedElement[vm.catalog.model],
                        value: vm.selectedElement
                    });
                }
                else {
                    //Makes tratment for returning the element as an id array,
                    //the value is return as is.
                    var idArray = [];
                    for (var elementRepeater = 0;
                        elementRepeater < vm.selectedElement.length;
                        elementRepeater++) {
                        idArray.push(vm.selectedElement[elementRepeater][vm.catalog.model]);
                    }
                    vm.onSelect({
                        element: idArray,
                        value: vm.selectedElement
                    });
                }
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
