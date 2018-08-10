(function () {
    angular
        .module('app.mainApp')
        .component('catalogManager', {
            templateUrl: 'app/mainApp/components/catalogManager/catalogManager.tmpl.html',
            controller: CatalogManagerController,
            bindings: {
                url: '<', //Full or partial URL, depending on kind
                kind: '<', //Mobile, Web, Generic. Default is 'Generic'

                //Labels
                name: '<', //Catalog name to show, default is 'Catalog'
                namePlural: '<', //If not given, the default plural handler adds an 's' to the end of the name
                totalText: '<', //If not given, the word 'Total' will be used
                loadingMessage: '<',

                //Functions
                onSuccessList: '&',
                onErrorList: '&',
                onSuccessGet: '&',
                onErrorGet: '&',
                onSuccessCreate: '&',
                onErrorCreate: '&',
                onSuccessUpdate: '&',
                onErrorUpdate: '&',
                onSuccessDelete: '&',
                onErrorDelete: '&',

                //Buttons, if no text is given, the button would only have an icon
                searchButtonText: '<',
                createButtonText: '<',
                deleteButtonText: '<',
                modifyButtonText: '<',
                saveButtonText: '<',
                confirmButtonText: '<',
                cancelButtonText: '<',

                //Meta object for the component
                actions: '<',

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
                 *              type: string,          Valid types are text, number, email, options, date, color, file, fileUploader
                 *              model: string,         Name of the field that will be sent to the API
                 *              required: boolean,     (Optional) Specifies whether or not the field is required
                 *              label: string,         (Optional) Label to show in the form, if not given, the model string will be used as label
                 *              validations: [
                 *                  {
                 *                      regex: string,          Option regular expression for field validation (just used when text),
                 *                      max: number,            Maximum value allowed for selection (just used when number)
                 *                      min: number,            Minimum value allowed for selection (just used when number)
                 *                      date_format: string,    String format to use for date formating (just used when date)
                 *                      fileUploder: {                 As used by the file-uploader component
                 *                          fileFormats: '<', //image/*, audio/*, video/*, application/pdf
                 *                          capture: '<', //camera
                 *                          validations: '<', //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                 *                          resize: '<', //{width: 1000, height: 1000, centerCrop: true}
                 *                          resizeIf: '<', //$width > 5000 || $height > 5000
                 *                          maxDimensions: '<', //Max dimensions for images
                 *                          maxDuration: '<', //Max duration for videos
                 *                          multipleFiles: '<', //Allow multiple files
                 *                          allowFolders: '<', //Allow directory uploading
                 *                          maxFiles: '<', //Max number of files allowed
                 *                          keep: '<', //true, false or distinct,
                 *                          filesSelected: '&'// {files:vm.files}
                 *                      },
                 *                      error_message: string   Error message to show when the validation is not fulfilled
                 *                  }
                 *              ],
                 *              catalog:{                just used when the type of the field is options
                 *                  requires: string,    (Optional) Field required to enable this catalog
                 *                  lazy: boolean,       (Optional) Determines if the load is lazy or initial
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              }
                 *          }
                 *      ]
                 *  },
                 *  PUT:{
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are text, number, email, options, date, color, file, fileUploader
                 *              option: string,        (Optional) If type is options, and the value for the actual option is provided by the API
                 *                                     rather than just the ID, you could bind it whit this element.
                 *                                     This will also add and "Edit" button to the field in order to load the catalog, just if it's needed.
                 *              model: string,         Name of the field that will be sent to the API
                 *              required: boolean,     Specifies whether or not the field is required
                 *              label: string,         (Optional) Label to show in the form. If not given, the model will be used
                 *              validations: [
                 *                  {
                 *                      regex: string,          Option regular expression for field validation (just used when text),
                 *                      max: number,            Maximum value allowed for selection (just used when number)
                 *                      min: number,            Minimum value allowed for selection (just used when number)
                 *                      date_format: string,    String format to use for date formating (just used when date)
                 *                      fileUploder: {                 As used by the file-uploader component
                 *                          fileFormats: '<', //image/*, audio/*, video/*, application/pdf
                 *                          capture: '<', //camera
                 *                          validations: '<', //size: {max: '20MB', min: '10B'}, height: {max: 12000}, width: {max: 12000}, duration: {max: '5m'}}
                 *                          resize: '<', //{width: 1000, height: 1000, centerCrop: true}
                 *                          resizeIf: '<', //$width > 5000 || $height > 5000
                 *                          maxDimensions: '<', //Max dimensions for images
                 *                          maxDuration: '<', //Max duration for videos
                 *                          multipleFiles: '<', //Allow multiple files
                 *                          allowFolders: '<', //Allow directory uploading
                 *                          maxFiles: '<', //Max number of files allowed
                 *                          keep: '<', //true, false or distinct,
                 *                          filesSelected: '&'// {files:vm.files}
                 *                      },
                 *                      error_message: string   Error message to show when the validation is not fulfilled
                 *                  }
                 *              ],
                 *              catalog:{                just used when the type of the field is options
                 *                  requires: string,    (Optional) Field required to enable this catalog
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              }
                 *          }
                 *      ]
                 *  },
                 *  GET:{
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are text, options, file
                 *              model: string,         Name of the field that will be used to show the data from the API
                 *              label: string,         (Optional) Label to show, if not given, the model will be used
                 *              catalog:{                just used when the type of the field is options and the option field is not given
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        Mobile, Web, Generic. Default is 'Generic'
                 *                  model: string,       From the catalog object, which element is used for binding (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              }
                 *          }
                 *      ]
                 *  },
                 *  LIST:{
                 *      mode: string,                  (Optional) Paged or Infinite, default is Paged //Infinite is not yet implemented
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are text, options, file //Options not yet implemented
                 *              model: string,         Name of the field that will be used to show the data from the API
                 *              label: string,         (Optional) Label to show, if not given, the model will be used
                 *              catalog:{                (Optional) Just used when the type of the field is options and the option field is not given
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        Mobile, Web, Generic. Default is 'Generic'
                 *                  model: string,       From the catalog object, which element is used for binding (aka: id, name, etc.)
                 *                  option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
                 *                                       If not given, then the model will be used
                 *              }
                 *              file:{                   (Optional) Just used if the type of the field is file
                 *                  mode: string            Valid modes are preview and download, preview just work for images
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
                 *      }
                 *  },
                 *  DELETE:{
                 *      //TODO: Add procedures, validations, etc.
                 *      id:string             //Defines the name of the filed that with be used as ID for deletion
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
        $window
    ) {
        var vm = this;

        activate();

        //Initializing or assingning default values to global variables
        if (vm.name) {
            if (!vm.namePlural) {
                vm.namePlural = vn.name + 's';
            }
        }
        else {
            vm.name = 'Catalog';
        }
        vm.kind ? null : vm.kind = 'Generic';
        vm.totalText ? null : vm.totalText = 'Total';

        vm.paginationHelper = {};
        vm.catalogElements = [];
        vm.selectedElement = null;
        vm.CatalogProvider = null;
        vm.PaginationProvider = null;

        //Function mapping
        vm.create = create;
        vm.delete = remove;
        vm.update = update;
        vm.geByID = getByID;
        vm.downloadFile = downloadFile;

        function activate() {
            //var verticalContainer =
            //    document.getElementsByClassName("catalog-vertical-container");
            //console.debug(verticalContainer);
            //if (verticalContainer.style.maxHeight < 200) {
            //    verticalContainer.stye.maxHeight = '100%';
            //}
            createMainCatalogProvider();
            function createPaginationProvider() {
                vm.PaginationProvider = CATALOG.generic;
            }
            list();
        }

        function createMainCatalogProvider() {
            if (vm.kind) {
                switch (vm.kind) {
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

        function search() {
            //TODO: Search behaviour handling
        }

        function list() {
            //List behaviour handling (initial loading)
            if (vm.actions['LIST']) {
                vm.listLoader = vm.CatalogProvider
                    .list()
                    .then(function (elements) {
                        //Elements list is returned in any other model
                        if (vm.actions['LIST'].elements) {
                            vm.catalogElements = elements[vm.actions['LIST'].elements];
                        }
                        //Elements list is returned directly as an array
                        else {
                            vm.catalogElements = elements;
                        }

                        //Building the pagination helper
                        //(if pagination element is in the actions of the LIST),
                        //if the meta contains the specific models,
                        //then those will be used, otherwise, the default models will.
                        if (vm.actions['LIST'].pagination) {
                            //Total of elements model to be used
                            if (vm.actions['LIST'].pagination['total']) {
                                vm.paginationHelper['total'] = elements[vm.actions['LIST'].pagination['total']];
                            }
                            else {
                                vm.paginationHelper['total'] = elements['total'];
                            }
                            //Previous page model to be used
                            if (vm.actions['LIST'].pagination['previous']) {
                                vm.paginationHelper['previous'] = elements[vm.actions['LIST'].pagination['previous']];
                            }
                            else {
                                vm.paginationHelper['previous'] = elements['previous'];
                            }
                            //Next page model to be used
                            if (vm.actions['LIST'].pagination['next']) {
                                vm.paginationHelper['next'] = elements[vm.actions['LIST'].pagination['next']];
                            }
                            else {
                                vm.paginationHelper['next'] = elements['next'];
                            }
                        }
                        console.debug(vm.catalogElements);
                        console.debug(vm.paginationHelper);
                        vm.onSuccessList({ elements: vm.catalogElemets });
                    })
                    .catch(function (errorElements) {
                        console.error(errorElements);
                        vm.onErrorList({ error: errorElements });
                    });
            }
            else {
                vm.onErrorList({ error: '"actions" parameter does not have the LIST element defined' });
            }
        }

        function create(objectToCreate) {
            //Creation behavior handling
            if (vm.actions['POST']) {
                vm.createLoader = vm.CatalogProvider
                    .create(vm.url, objectToCreate)
                    .then(function (createResult) {
                        activate();
                        vm.onSuccessCreate({ result: createResult });
                    })
                    .catch(function (createError) {
                        vm.onErrorCreate({ error: createError });
                    });
            }
            else {
                vm.onErrorCreate({ error: '"actions" parameter does not have the POST element defined' });
            }
        }

        function remove(idToRemove) {
            //Confirmation dialog for deletion behavior
            if (vm.actions['DELETE']) {
                vm.removeLoader = vm.CatalogProvider
                    .remove(idToRemove)
                    .then(function () {
                        activate();
                        vm.onSuccessDelete();
                    })
                    .catch(function (removeError) {
                        vm.onErrorDelete({ error: removeError });
                    });
            }
            else {
                vm.onErrorDelete({ error: '"actions" parameter does not have the DELETE element defined' });
            }
        }

        function update(idToUpdate, newObject) {
            //Update behavior handling
            if (vm.actions['PUT']) {
                vm.updateLoader = vm.CatalogProvider
                    .update(vm.url, idToUpdate, newObject)
                    .then(function (updateResult) {
                        activate();
                        vm.onSuccessUpdate({ result: updateResult });
                    })
                    .catch(function (errorUpdate) {
                        vm.onErrorUpdate({ error: errorUpdate });
                    });
            }
            else {
                vm.onErrorUpdate({ error: '"actions" parameter does not have the PUT element defined' });
            }
        }

        function getByID(idToGet) {
            //Get one element behavior
            if (vm.actions['GET']) {
                vm.getByIDLoader = vm.CatalogProvider
                    .getByID(vm.url, idToGet)
                    .then(function (element) {
                        vm.onSuccessGet({ element: element });
                    })
                    .catch(function (elementError) {
                        vm.onErrorGet({ error: elementError });
                    });
            }
            else {
                vm.onErrorGet({ error: '"actions" parameter does not have the GET element defined' });
            }
        }

        function downloadFile(url) {
            $window.open(url);
        }

    }

})();
