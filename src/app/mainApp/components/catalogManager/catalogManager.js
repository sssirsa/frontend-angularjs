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
                namePlural: '@?', //If not given, the default plural handler adds an 's' to the end of the name

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
                createButtonText: '@?',
                deleteButtonText: '@?',
                modifyButtonText: '@?',
                saveButtonText: '@?',
                confirmButtonText: '@?',
                cancelButtonText: '@?',

                //Meta object for the component
                actions: '<',

                /*
                 *
                 * Actions object documentation
                 *
                 * Root elements of the object MUST be the actions
                 * Example:
                 * {
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
                 *              type: string,          Valid types are text, number, email, options, file
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
                 *      mode: string,                  (Optional) Paged or Infinite, default is Paged
                 *      fields:[
                 *          {
                 *              type: string,          Valid types are text, number, email, options, file
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
                 *  }
                 * }
                 */

            }
        });

    /* @ngInject */
    function CatalogManagerController(
        CATALOG
    ) {
        var vm = this;

        activate();

        //Initializing or assingning default values to global variables
        vm.name ? vm.Name = vm.name : vm.Name = 'Catalog';
        vm.url ? vm.Url = vm.url : null;
        vm.kind ? vm.Kind = vm.kind : vm.Kind = 'Generic';
        vm.actions ? vm.Actions : vm.actions = null;

        vm.catalogElements = [];

        //Initializing local instance of providers
        vm.CatalogProvider = null;
        vm.PaginationProvider = null;

        //Function mapping
        vm.create = create;
        vm.delete = remove;
        vm.update = update;
        vm.geByID = getByID;

        function activate() {
            createMainCatalogProvider();
            if (vm.actions.LIST.pagination) {
                createPaginationCatalogProvider();
            }
        }

        function createMainCatalogProvider() {
            if (vm.Kind) {
                switch (vm.Kind) {
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
            vm.CatalogProvider.url = vm.Url;
        }

        function createPaginationProvider() {
            vm.PaginationProvider = CATALOG.generic;
        }

        function list() {
            //List behaviour handling (initial loading)
            if (vm.actions['LIST']) {
                vm.listLoader = vm.CatalogProvider
                    .list()
                    .then(function (elements) {
                        if (vm.actions.LIST.elements) {
                            vm.catalogElements = elements[vm.actions.LIST.elements];
                        }
                        else {
                            vm.catalogElements = elements;
                        }
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
                    .create(objectToCreate)
                    .then(function (createResult) {
                        activate();
                        vm.onSuccessCreate({ result: createResult });
                    })
                    .catch(function (createError) {
                        vm.onErrorCreate({ error: createError });
                    });
            }
            else {
                vm.onErrorCreate({ error: '"actions" parameter does not have the POST element defined');
            }
        }

        function remove(idToRemove) {
            //Confirmation dialog for deletion behavior
            if (vm.actions['DELETE']) {

            }
            else {
                vm.onErrorDelete({ error: '"actions" parameter does not have the DELETE element defined' });
            }
        }

        function update(idToUpdate, newObject) {
            //Update behavior handling
            if (vm.actions['PUT']) {
                vm.updateLoader = vm.CatalogProvider
                    .update(idToUpdate, newObject)
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
                    .getByID(idToGet)
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

    }

})();
