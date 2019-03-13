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
 *      softDelete: {
 *          hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
 *          reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
 *      },
 *      
 *      initial:string,       (Optional) Must be the ID you want to be selected (if single)
 *                            Must be the elements selected with ID and option (if multiple)
 *                            Iy nulls the lazy parameter
 *      showModel:boolean,    (Optional) Allows to shoe the model and the option of the catalog with the following format
 *                            <b>{{model}}</b> - {{option}}
 *      multiple:boolean      (Optional) Allows to select more than one element.
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
                multiple: '<',

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
            if (!vm.lazy || vm.initial) {
                //The catalog is not loaded in lazy mode and when no initial value is given
                list();
            }
            //if (vm.initial && vm.pagination) {
            //    //Warranty that lazy is true if you have initial and pagination
            //    vm.lazy = true;
            //}
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
                        //If initial parameter is given, select (and load) the element after listing the catalogue
                        if (vm.initial) {
                            initialValueLoad();
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

        //Called if the parameter vm.initial exists when listing the elements
        function initialValueLoad() {
            //Non paginated catalogue
            if (!vm.pagination) {
                //Multiple elements to select
                if (vm.multiple) {
                    vm.selectedElement = vm.catalogElements
                        .filter(function (currentElement) {
                            return vm.initial.find(function (iteratedElement) {
                                iteratedElement === currentElement;
                            })
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
                if (!elementInList(vm.selectedElement)) {
                    vm.catalogElements.push(vm.selectedElement);
                }
            }
            //Paginated catalogue
            else {
                createMainCatalogProvider();
                if (vm.multiple) {
                    vm.selectedElement = JSON.parse(JSON.stringify(vm.initial));
                    //Iterating over every initial object
                    for (var selectedElementRepeater = 0;
                        selectedElementRepeater < vm.selectedElement.length;
                        selectedElementRepeater++) {
                        if (!elementInList(vm.selectedElement[selectedElementRepeater], vm.catalogElements)) {
                            //Adding elements to list if they were not in the actual page of pagination
                            vm.catalogElements.push(vm.selectedElement[selectedElementRepeater]);
                        }
                    }
                    vm.onClose();
                }
                else {
                    vm.listLoader = CATALOG_SELECT.detail(vm.initial)
                        .then(function catalogSelectDetailSuccess(successCallback) {
                            vm.selectedElement = successCallback;
                            if (!vm.catalogElements) {
                                vm.catalogElements = [];
                            }
                            if (!elementInList(successCallback, vm.catalogElements)) {
                                vm.catalogElements.push(successCallback);
                            }
                            vm.onClose();

                        })
                        .catch(function catalogSelectDetailError(errorCallback) {
                            console.error('@CatalogSelectController @list @CATALOG_SELECT.detail', errorCallback);
                        });

                }
            }
        }

        //If the element is on the list, it returns it, else, returns undefined
        function elementInList(element, list) {
            return list.find(function (iteratedElement) {
                iteratedElement[vm.catalog.model] === element[vm.catalog.model];
            });
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
                        let loadedElementList = [];
                        //Elements list is returned in any other model
                        if (vm.elements) {
                            //Add the returned elements after the list sanitation
                            //vm.catalogElements = vm.catalogElements.concat(elements[vm.elements]);
                            loadedElementList = elements[vm.elements];
                        }
                        //Elements list is returned directly as an array
                        else {
                            loadedElementList = elements;
                        }

                        //This procedures are required because of the initial loading of the elements
                        //And are just used in the case of pagination
                        if (vm.multiple) {
                            for (var selectedElementRepeater = 0;
                                selectedElementRepeater < vm.selectedElement.length;
                                selectedElementRepeater++) {
                                //Validating if one of the selected elements is present in the actual page
                                if (elementInList(vm.selectedElement[selectedElementRepeater], loadedElementList)) {
                                    //remove vm.selectedElement[selectedElementRepeater]
                                    vm.catalogElements.splice(
                                        vm.catalogElements.indexOf(
                                            vm.selectedElement[selectedElementRepeater]
                                        ), 1);
                                }
                            }
                        }
                        else {
                            //Validate if selected element is present on the actual page
                            if (elementInList(vm.selectedElement, loadedElementList)) {
                                //remove vm.selectedElement
                                vm.catalogElements.splice(
                                    vm.catalogElements.indexOf(
                                        vm.selectedElement[selectedElementRepeater]
                                    ), 1);
                            }
                        }

                        //Appending elemets to the now sanitized list
                        vm.catalogElements = vm.catalogElements.concat(elements[vm.elements]);

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
                    let idArray = [];
                    for (let elementRepeater = 0;
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
