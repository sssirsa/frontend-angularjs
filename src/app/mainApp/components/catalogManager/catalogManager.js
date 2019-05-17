(function () {
    angular
        .module('catalogManager')
        .component('catalogManager', {
            templateUrl: 'app/mainApp/components/catalogManager/catalogManager.tmpl.html',
            controller: CatalogManagerController,
            bindings: {
                url: '<', //Full URL

                //Labels
                totalText: '<', //If not given, the word 'Total' will be used
                totalFilteredText: '<', //If not given 'Total filtered' will be used
                loadingMessage: '<',

                //Functions
                onSuccessList: '&',
                onErrorList: '&',
                onSuccessGet: '&',
                onErrorGet: '&',
                onSuccessCreate: '&',
                onErrorCreate: '&',
                onSuccessModify: '&',
                onErrorModify: '&',
                onSuccessUpdate: '&',
                onErrorUpdate: '&',
                onSuccessDelete: '&',
                onErrorDelete: '&',
                onSuccessSearch: '&',
                onErrorSearch: '&',
                onElementSelect: '&',

                //Buttons, if no text is given, the button would only have an icon
                searchButtonText: '<',
                createButtonText: '<',
                deleteButtonText: '<',
                modifyButtonText: '<',
                updateButtonText: '<',
                nextButtonText: '<',
                previousButtonText: '<',
                loadMoreButtonText: '<',
                removeFilterButtonText: '<',

                //Meta object for the component
                actions: '<'

                /*
                 *
                 * Actions object documentation
                 *
                 * Root elements of the object MUST be the actions
                 * Example:
                 * {
                 *  SEARCH:{...},  Not yet implemented----------------
                 *  POST:{...},    New element meta
                 *  PUT:{...},     Update element meta
                 *  GET:{...},     Detail element meta
                 *  LIST:{...},    List element meta
                 *  DELETE:{...}   Delete element permission
                 * }
                 *
                 * Inside each 'action' sub-object you must place the meta information, specific for each action
                 * Below are the descriptions of each action sub-object
                 *
                 * Example:
                 * {
                 *  POST:{
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are the html5 types, plus the types:
                 *                                     options, catalog, array(strings), catalog_array
                 *                                     and fileUploader.
                 *              model: string,         Name of the field that will be sent to the API
                 *              required: boolean,     (Optional) Specifies whether or not the field is required
                 *              label: string,         (Optional) Label to show in the form, if not given, the model string will be used as label
                 *              validations:
                 *                  {
                 *                      regex: string,          Option regular expression for field validation (just used when text),
                 *                      max: number,            Maximum value allowed for selection (just used when number)
                 *                      min: number,            Minimum value allowed for selection (just used when number)
                 *                      date_format: string,    String format to use for date formating (just used when date)
                 *                      errors:{
                 *                          required: string,       (Optional) Default is 'Required field'
                 *                          regex: string,          (Optional) Default is 'Invalid pattern {{regex}}'
                 *                          max: string,            (Optional) Default is 'Max value is {{max}}'
                 *                          min: string,            (Optional) Default is 'Min value is {{min}}'
                 *                          date_format: string     (Optional) Default is 'Required date format is {{date_format}}'
                 *                      }
                 *                  },
                 *              catalog:{                (Optional) Just used when the type of the field is catalog, in this case the component handles itself the loading of the catalog
                 *                  lazy: boolean,       (Optional) Determines if the load is lazy or initial
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              },
                 *              options:{              // (Optional) Just used when the field is options, in this case, the possible options are passed to the component since the beginning
                 *                  model: string,            Field of the element to be used in the model
                 *                  option: string,           Field of the element to show in list
                 *                  elements:[
                 *                      {
                 *                          model: {{}},
                 *                          option: {{}}
                 *                      }
                 *                  ]
                 *              }
                 *              fileUploder: {                 As used by the file-uploader component
                 *                          fileFormats: '<',           //image/*, audio/*, video/*, application/pdf
                 *                          capture: '<',               //camera
                 *                          validations: '<',           //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                 *                          resize: '<',                //{width: 1000, height: 1000, centerCrop: true}
                 *                          resizeIf: '<',              //$width > 5000 || $height > 5000
                 *                          maxDimensions: '<',         //Max dimensions for images
                 *                          maxDuration: '<',           //Max duration for videos
                 *                          multipleFiles: '<',         //Allow multiple files
                 *                          allowFolders: '<',          //Allow directory uploading
                 *                          maxFiles: '<',              //Max number of files allowed
                 *                          keep: '<',                  //true, false or distinct,
                 *                                                      (Optional) Just necessary if any further treatment is required in the model of the files, such as conversion.
                 *                          filesSelected: '<'          * function(files){ return model; } //Do the necesary processing for the files inside the given function
                 *                      },
                 *          }
                 *      ],
                 *      dialog:{              //Labels to use in the creation dialog
                 *          title: string,          (Optional) Title for the creation dialog, default is 'Create element'
                 *          okButton: string,       (Optional) Label for the Ok button, default is 'Create'
                 *          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
                 *      }
                 *  },
                 *  PUT:{
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are the html5 types, plus the types: options, catalog and fileUploader
                 *              model: string,         Name of the field that will be sent to the API
                 *              required: boolean,     (Optional) Specifies whether or not the field is required
                 *              hint: string,          (Optional) Hint label to show
                 *              label: string,         (Optional) Label to show in the form, if not given, the model string will be used as label
                 *              validations:
                 *                  {
                 *                      regex: string,          Option regular expression for field validation (just used when text),
                 *                      max: number,            Maximum value allowed for selection (just used when number)
                 *                      min: number,            Minimum value allowed for selection (just used when number)
                 *                      date_format: string,    String format to use for date formating (just used when date)
                 *                      errors:{
                 *                          required: string,       (Optional) Default is 'Required field'
                 *                          regex: string,          (Optional) Default is 'Invalid pattern {{regex}}'
                 *                          max: string,            (Optional) Default is 'Max value is {{max}}'
                 *                          min: string,            (Optional) Default is 'Min value is {{min}}'
                 *                          date_format: string     (Optional) Default is 'Required date format is {{date_format}}'
                 *                      }
                 *                  },
                 *              catalog:{                 As used by the catalog-select component
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  name: string,        (Optional) Default is "Catalog"
                 *                  loadMoreButtonText, string (Optional) Test to show in the 'Load more' Button, default is 'Load more'
                 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *
                 *                  pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
                 *                      total: string,        (Optional) Binding for the number of total elements
                 *                      next: string,         (Optional) Binding for the url that brings to the next page
                 *                  },
                 *                  required: boolean,    (Optional) To be used in form validation
                 *                  elements: string,     (Optional) Model used if the elements are not returned at the root of the response
                 *                                        aka: the API returns the array of objects in an element of the response, as in pagination
                 *                                        Example:
                 *                                        {
                 *                                          total:'',
                 *                                          description:'',
                 *                                          results:[
                 *                                              {...},
                 *                                              {...}
                 *                                          ]
                 *                                        }
                 *                                        In this case 'elements' should receive the parameter 'results'
                 *                  softDelete: {
                 *                      hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
                 *                      reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
                 *                  }
                 *              },
                 *              options:{              // (Optional) Just used when the field is options, in this case, the possible options are passed to the component since the beginning
                 *                  model: string,            Field of the element to be used in the model
                 *                  option: string,           Field of the element to show in list
                 *                  elements:[
                 *                      {
                 *                          model: {{}},
                 *                          option: {{}}
                 *                      }
                 *                  ]
                 *              }
                 *              fileUploder: {                 As used by the file-uploader component
                 *                          fileFormats: '<',           //image/*, audio/*, video/*, application/pdf
                 *                          capture: '<',               //camera
                 *                          validations: '<',           //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                 *                          resize: '<',                //{width: 1000, height: 1000, centerCrop: true}
                 *                          resizeIf: '<',              //$width > 5000 || $height > 5000
                 *                          maxDimensions: '<',         //Max dimensions for images
                 *                          maxDuration: '<',           //Max duration for videos
                 *                          multipleFiles: '<',         //Allow multiple files
                 *                          allowFolders: '<',          //Allow directory uploading
                 *                          maxFiles: '<',              //Max number of files allowed
                 *                          keep: '<',                  //true, false or distinct,
                 *                                                      (Optional) Just necessary if any further treatment is required in the model of the files, such as conversion.
                 *                          filesSelected: '<'          * function(files){ return model; } //Do the necesary processing for the files inside the given function
                 *                      },
                 *          }
                 *      ],
                 *      dialog:{              //Labels to use in the creation dialog
                 *          title: string,          (Optional) Title for the creation dialog, default is 'Create element'
                 *          okButton: string,       (Optional) Label for the Ok button, default is 'Create'
                 *          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
                 *      },
                 *      id: string,           //Field name to be used as id for HTTP PUT method
                 *      element: object       //Initial object to be modified
                 *  },
                 *  PATCH:{
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are the html5 types, plus the types: options, catalog and fileUploader
                 *              model: string,         Name of the field that will be sent to the API
                 *              required: boolean,     (Optional) Specifies whether or not the field is required
                 *              hint: string,          (Optional) Hint label to show
                 *              label: string,         (Optional) Label to show in the form, if not given, the model string will be used as label
                 *              validations:
                 *                  {
                 *                      regex: string,          Option regular expression for field validation (just used when text),
                 *                      max: number,            Maximum value allowed for selection (just used when number)
                 *                      min: number,            Minimum value allowed for selection (just used when number)
                 *                      date_format: string,    String format to use for date formating (just used when date)
                 *                      errors:{
                 *                          required: string,       (Optional) Default is 'Required field'
                 *                          regex: string,          (Optional) Default is 'Invalid pattern {{regex}}'
                 *                          max: string,            (Optional) Default is 'Max value is {{max}}'
                 *                          min: string,            (Optional) Default is 'Min value is {{min}}'
                 *                          date_format: string     (Optional) Default is 'Required date format is {{date_format}}'
                 *                      }
                 *                  },
                 *              catalog:{                 As used by the catalog-select component
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  name: string,        (Optional) Default is "Catalog"
                 *                  loadMoreButtonText, string (Optional) Test to show in the 'Load more' Button, default is 'Load more'
                 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *
                 *                  pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
                 *                      total: string,        (Optional) Binding for the number of total elements
                 *                      next: string,         (Optional) Binding for the url that brings to the next page
                 *                  },
                 *                  required: boolean,    (Optional) To be used in form validation
                 *                  elements: string,     (Optional) Model used if the elements are not returned at the root of the response
                 *                                        aka: the API returns the array of objects in an element of the response, as in pagination
                 *                                        Example:
                 *                                        {
                 *                                          total:'',
                 *                                          description:'',
                 *                                          results:[
                 *                                              {...},
                 *                                              {...}
                 *                                          ]
                 *                                        }
                 *                                        In this case 'elements' should receive the parameter 'results'
                 *                  softDelete: {
                 *                      hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
                 *                      reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
                 *                  }
                 *              },
                 *              options:{              // (Optional) Just used when the field is options, in this case, the possible options are passed to the component since the beginning
                 *                  model: string,            Field of the element to be used in the model
                 *                  option: string,           Field of the element to show in list
                 *                  elements:[
                 *                      {
                 *                          model: {{}},
                 *                          option: {{}}
                 *                      }
                 *                  ]
                 *              }
                 *              fileUploder: {                 As used by the file-uploader component
                 *                          fileFormats: '<',           //image/*, audio/*, video/*, application/pdf
                 *                          capture: '<',               //camera
                 *                          validations: '<',           //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                 *                          resize: '<',                //{width: 1000, height: 1000, centerCrop: true}
                 *                          resizeIf: '<',              //$width > 5000 || $height > 5000
                 *                          maxDimensions: '<',         //Max dimensions for images
                 *                          maxDuration: '<',           //Max duration for videos
                 *                          multipleFiles: '<',         //Allow multiple files
                 *                          allowFolders: '<',          //Allow directory uploading
                 *                          maxFiles: '<',              //Max number of files allowed
                 *                          keep: '<',                  //true, false or distinct,
                 *                                                      (Optional) Just necessary if any further treatment is required in the model of the files, such as conversion.
                 *                          filesSelected: '<'          * function(files){ return model; } //Do the necesary processing for the files inside the given function
                 *                      },
                 *          }
                 *      ],
                 *      dialog:{              //Labels to use in the creation dialog
                 *          title: string,          (Optional) Title for the creation dialog, default is 'Patch element'
                 *          okButton: string,       (Optional) Label for the Ok button, default is 'Patch'
                 *          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
                 *      },
                 *      id: string            //Field name of the object to be used as id for HTTP PATCH method
                 *  },
                 *  LIST:{
                 *      mode: string,                  (Optional) paged or infinite, default is Paged
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are text, options, catalog, file, object, array_object, object_property and color //Options and catalog not yet implemented
                 *              model: string,         Name of the field that will be used to show the data from the API,
                 *                                     separate with double underscores when nested fields are found (just in object type field)
                 *              label: string,         (Optional) Label to show, if not given, the model will be used
                 *              nullOrEmpty: string,   (Optional) Text to show if the binding is null or empty, if not sent, the element won't be shown at all.
                 *              catalog:{                (Optional) Just used when the type of the field is options and the option field is not given
                 *                  url: string,         Full URL
                 *                  model: string,       From the catalog object, which element is used for binding (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              }
                 *              file:{                   (Optional) Just used if the type of the field is file
                 *                  mode: string            Valid modes are preview and download, preview just work for images
                 *              },
                 *              fields:{                 (Optional) Used when object and array_object
                 *                                       Nest the same kind of fields object in order to show the required fields
                 *              }
                 *          }
                 *      ],
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
                 *      pagination: {         (Optional) If present, the component asumes that the catalog API uses pagination
                 *          total: string,        (Optional) Binding for the number of total elements
                 *          previous: string,     (Optional) binding for the url that returns to the previous page
                 *          next: string,         (Optional) Binding for the url that brings to the next page
                 *      },
                 *      softDelete: {
                 *          hide: string,         Boolean property to consider in order to hide the element (hide, deleted, disabled, etc.)
                 *          reverse: boolean      If true, the element will be hiden when the parameter is false rather than true
                 *      }
                 *  },
                 *  DELETE:{
                 *      //TODO: Add procedures, validations, etc.
                 *      id:string,            //Defines the name of the filed that with be used as ID for deletion
                 *      dialog:{              //Labels to use in the deletion dialog
                 *          title: string,          (Optional) Title for the deletion dialog, default is 'Confirm deletion'
                 *          message: string,        (Optional) Message for the deletion dialog, default is 'Confirm element deletion'
                 *          okButton: string,       (Optional) Label for the Ok button, default is 'Ok'
                 *          cancelButton: string    (Optional) Label for the cancel button, default is 'Cancel'
                 *      }
                 *  },
                 *  SEARCH:{
                 *      //TODO:Add procedures, validations, etc.
                 *  }
                 * }
                 */

            }
        });

    /* @ngInject */
    function CatalogManagerController(
        CATALOG,
        $window,
        $mdDialog,
        ErrorHandler,
        $log
    ) {
        var vm = this;

        activate();
        vm.totalText ? null : vm.totalText = 'Total';

        vm.paginationHelper = {};
        vm.catalogElements = [];
        vm.selectedElement = null;
        vm.CatalogProvider = null;
        vm.PaginationProvider = null;
        vm.filterApplied = null;

        //Function mapping
        vm.create = create;
        vm.delete = remove;
        vm.modify = modify;
        vm.update = update;
        vm.search = search;
        vm.previousPage = previousPage;
        vm.nextPage = nextPage;
        vm.loadMore = loadMore;
        vm.removeFilter = removeFilter;
        vm.elementSelection = elementSelection;

        function activate() {
            list();
        }

        function createMainCatalogProvider() {
            vm.CatalogProvider = CATALOG;
            vm.CatalogProvider.url = vm.url;
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG;
        }

        function list() {
            //List behaviour handling (initial loading)
            createMainCatalogProvider();
            vm.catalogElements = [];
            if (vm.actions['LIST']) {
                vm.listLoader = vm.CatalogProvider
                    .list()
                    .then(function (response) {
                        treatResponse(response);
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        $log.error(errorElements);
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({ error: '"actions" parameter does not have the LIST element defined' });
            }
        }

        function create() {
            //Creation behavior handling
            if (vm.actions['POST']) {
                $mdDialog.show({
                    controller: 'CatalogCreateDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                    fullscreen: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        dialog: vm.actions['POST'].dialog,
                        fields: vm.actions['POST'].fields,
                        url: vm.url
                    }
                }).then(function (createdElement) {
                    if (vm.filterApplied) {
                        vm.removeFilter();
                    }
                    else {
                        vm.catalogElements.push(createdElement);
                    }
                    ErrorHandler.successCreation();
                    vm.onSuccessCreate();
                }).catch(function (errorCreate) {
                    if (errorCreate) {
                        ErrorHandler.errorTranslate(errorCreate);
                        vm.onErrorCreate(errorCreate);
                    }
                });
            }

            else {
                ErrorHandler.errorTranslate({ status: -1 });
                vm.onErrorCreate({ error: '"actions" parameter does not have the POST element defined' });
            }
        }

        function remove(idToRemove) {
            //Confirmation dialog for deletion behavior
            if (vm.actions['DELETE']) {
                $mdDialog.show({
                    controller: 'CatalogDeleteDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/mainApp/components/catalogManager/dialogs/deleteDialog/deleteDialog.tmpl.html',
                    fullscreen: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        dialog: vm.actions['DELETE'].dialog,
                        id: idToRemove,
                        url: vm.url
                    }
                }).then(function () {
                    if (vm.filterApplied) {
                        vm.removeFilter();
                    }
                    else {
                        removeElementFromList(
                            findIndexInListById(
                                idToRemove,
                                vm.actions['DELETE'].id)
                        );
                    }
                    ErrorHandler.successDelete();
                    vm.onSuccessDelete();

                }).catch(function (errorDelete) {
                    if (errorDelete) {
                        ErrorHandler.errorTranslate(errorDelete);
                        vm.onErrorDelete(errorDelete);
                    }
                });
            }
            else {
                ErrorHandler.errorTranslate({ status: -1 });
                vm.onErrorDelete({ error: '"actions" parameter does not have the DELETE element defined' });
            }
        }

        function modify(element) {
            if (vm.actions['PUT']) {
                $mdDialog.show({
                    controller: 'CatalogModifyDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/mainApp/components/catalogManager/dialogs/modifyDialog/modifyDialog.tmpl.html',
                    fullscreen: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        dialog: vm.actions['PUT'].dialog,
                        id: vm.actions['PUT'].id,
                        fields: vm.actions['PUT'].fields,
                        url: vm.url,
                        element: element
                    }
                }).then(function (modifiedElement) {
                    if (vm.filterApplied) {
                        vm.removeFilter();
                    }
                    else {
                        var elementIndexInList = findIndexInListById(
                            modifiedElement[vm.actions['PUT'].id] || modifiedElement['id'],
                            vm.actions['PUT'].id || 'id'
                        );
                        vm.catalogElements[elementIndexInList] = angular
                            .fromJson(
                                angular.toJson(modifiedElement)
                            );
                    }
                    ErrorHandler.successUpdate();
                    vm.onSuccessModify();
                }).catch(function (errorModify) {
                    if (errorModify) {
                        ErrorHandler.errorTranslate(errorModify);
                        vm.onErrorModify(errorModify);
                    }
                });
            }
            else {
                vm.onErrorUpdate({ error: '"actions" parameter does not have the PUT element defined' });
                ErrorHandler.errorTranslate({ status: -1 });
            }
        }

        function update(element) {
            if (vm.actions['PATCH']) {
                $mdDialog.show({
                    controller: 'CatalogUpdateDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/mainApp/components/catalogManager/dialogs/patchDialog/patchDialog.tmpl.html',
                    fullscreen: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        dialog: vm.actions['PATCH'].dialog,
                        id: element[vm.actions['PATCH'].id],
                        fields: vm.actions['PATCH'].fields,
                        url: vm.url
                    }
                }).then(function () {
                    if (vm.filterApplied) {
                        vm.removeFilter();
                    }
                    else {
                        activate();
                        ErrorHandler.successUpdate();
                        vm.onSuccessUpdate();
                    }
                }).catch(function (errorUpdate) {
                    if (errorUpdate) {
                        ErrorHandler.errorTranslate(errorUpdate);
                        vm.onErrorUpdate(errorUpdate);
                    }
                });
            }
            else {
                vm.onErrorUpdate({ error: '"actions" parameter does not have the PATCH element defined' });
                ErrorHandler.errorTranslate({ status: -1 });
            }
        }

        function search() {
            //Search behavior handling, delegated to the search Dialog
            if (vm.actions['SEARCH']) {
                $mdDialog.show({
                    controller: 'CatalogSearchDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/mainApp/components/catalogManager/dialogs/searchDialog/searchDialog.tmpl.html',
                    fullscreen: true,
                    clickOutsideToClose: true,
                    focusOnOpen: true,
                    locals: {
                        dialog: vm.actions['SEARCH'].dialog,
                        filters: vm.actions['SEARCH'].filters,
                        url: vm.url
                    }
                }).then(function (successCallback) {
                    treatResponse(successCallback.response);
                    vm.filterApplied = successCallback.filter;
                    vm.onSuccessSearch({ elements: vm.catalogElements });
                }).catch(function (errorSearch) {
                    if (errorSearch) {
                        vm.onErrorSearch(errorSearch);
                        ErrorHandler.errorTranslate(errorSearch);
                    }
                });
            }
            else {
                ErrorHandler.errorTranslate({ status: -1 });
                vm.onErrorCreate({ error: '"actions" parameter does not have the POST element defined' });
            }
        }

        //Load the previous page of results qhen the pagination is Paged
        function previousPage() {
            if (vm.paginationHelper.previous) {
                if (vm.actions['LIST'].pagination) {
                    createPaginationProvider();
                }
                vm.PaginationProvider.url = vm.paginationHelper.previous;
                vm.pageLoader = vm.PaginationProvider
                    .list()
                    .then(function (response) {
                        treatResponse(response);
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({ error: 'No previous page URL found' });
            }
        }

        //Load the next page of results when the pagination is Paged
        function nextPage() {
            if (vm.paginationHelper.next) {
                if (vm.actions['LIST'].pagination) {
                    createPaginationProvider();
                }
                vm.PaginationProvider.url = vm.paginationHelper.next;
                vm.pageLoader = vm.PaginationProvider
                    .list()
                    .then(function (response) {
                        treatResponse(response);
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({ error: 'No next page URL found' });
            }
        }

        //Load more elements when pagination is infinite
        function loadMore() {
            if (vm.paginationHelper.next) {
                if (vm.actions['LIST'].pagination) {
                    createPaginationProvider();
                }
                vm.PaginationProvider.url = vm.paginationHelper.next;
                vm.infiniteLoader = vm.PaginationProvider
                    .list()
                    .then(function (response) {
                        treatResponse(response, true);
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        ErrorHandler.errorTranslate(errorElements);
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({ error: 'No next page URL found' });
            }
        }

        function elementSelection(element) {
            vm.onElementSelect({ element: element });
        }

        //Soft-Delete dynamic filtering function
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

        //Treatment function for backend responses
        function treatResponse(response, infinitePagination) {
            //Elements list is returned in any other model
            if (vm.actions['LIST'].elements) {
                if (infinitePagination) {
                    vm.catalogElements = vm.catalogElements.concat(response[vm.actions['LIST'].elements]);
                }
                else {
                    vm.catalogElements = response[vm.actions['LIST'].elements];
                }
            }
            //Elements list is returned directly as an array
            else {
                if (infinitePagination) {
                    vm.catalogElements = vm.catalogElements.concat(response);
                }
                else {
                    vm.catalogElements = response;
                }
            }
            //Determine if the soft delete parameter is given, and procede with the filtering
            if (vm.actions['LIST'].softDelete) {
                vm.catalogElements = filterDeleted(vm.catalogElements);
            }
            //Determine if the pagination parameter is given, and proceed with the building of the pagination helper
            if (vm.actions['LIST'].pagination) {
                buildPaginationHelper(response);
            }
        }

        //Pagination helper builder
        function buildPaginationHelper(response) {
            //Building the pagination helper
            //(if pagination element is in the actions of the LIST),
            //if the meta contains the specific models,
            //then those will be used, otherwise, the default models will.
            if (vm.actions['LIST'].pagination) {
                //Total of response model to be used
                if (vm.actions['LIST'].pagination['total']) {
                    vm.paginationHelper['total'] = response[vm.actions['LIST'].pagination['total']];
                }
                else {
                    vm.paginationHelper['total'] = response['total'];
                }
                //Previous page model to be used
                if (vm.actions['LIST'].pagination['previous']) {
                    vm.paginationHelper['previous'] = response[vm.actions['LIST'].pagination['previous']];
                }
                else {
                    vm.paginationHelper['previous'] = response['previous'];
                }
                //Next page model to be used
                if (vm.actions['LIST'].pagination['next']) {
                    vm.paginationHelper['next'] = response[vm.actions['LIST'].pagination['next']];
                }
                else {
                    vm.paginationHelper['next'] = response['next'];
                }
            }
        }

        //Remove filter function that reloads the elements of the list
        function removeFilter() {
            vm.filterApplied = null;
            activate();
        }

        //Remove element from list when deleted
        //Receives the index to remove from the list
        function removeElementFromList(index) {
            if (index > -1) {
                vm.catalogElements.splice(index, 1);
            }
            else {
                $log.error('@CatalogManager, function @removeElementFromList: the index ${index} provided is invalid');
            }
        }

        //Finds a element in the displayed list by its ID
        function findIndexInListById(idToFind, idField) {
            if (idToFind && idField) {
                var elementIndex = vm.catalogElements
                    .map(function mapRepeater(currentElement) {
                        return currentElement[idField];
                    })
                    .indexOf(idToFind);
                return elementIndex;
            }
            else {
                return -1;
            }
        }

    }
})();
