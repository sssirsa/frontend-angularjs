/*
   fields:[
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
*      provider: CATALOG provider object
*
*      PROVIDER = {        //Every function must return a promise, the URL must be defined when the provider object is given
 *                         //The Create dialog just uses the "create" function of the provider
           url: null,
           getByID: function (id) {...},
           list: function () {...},
           create: function (object) {...},
           update: function (id, object) {...},
           remove: function (id) {...},
           search: function (query) {...}
           }
*/

(function () {
    angular
        .module('app.mainApp')
        .controller('CatalogCreateDialogController', CatalogCreateDialogController);
    function CatalogCreateDialogController($mdDialog, dialog, provider, fields) {
        var vm = this;

        vm.dialog = dialog;
        vm.fields = fields;
        vm.CreateCatalogProvider = jQuery.extend(true, {}, provider);
        //vm.CreateCatalogProvider = provider;

        vm.objectToCreate = {};

        vm.create = create;
        vm.cancel = cancel;
        vm.filesSelected = filesSelected;
        vm.onElementSelect = onElementSelect;

        activate();

        function activate() {
            angular.forEach(vm.fields, function (field) {
                if (field.type === 'array') {
                    vm.objectToCreate[field.model] = [];
                }
            });
        }

        function create(objectToCreate) {
            vm.createLoader = vm.CreateCatalogProvider
                .create(objectToCreate)
                .then(function (createdElement) {
                    $mdDialog.hide(createdElement);
                })
                .catch(function (createError) {
                    $mdDialog.cancel(createError);
                });
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

        function filesSelected(files, field) {
            //fileProcessing MUST be a function in case it exists
            let fileProcessing = field.fileUploader['filesSelected'];
            if (fileProcessing) {
                files = fileProcessing(files);
            }
            vm.objectToCreate[field.model] = files;
        }

        function onElementSelect(element, field) {
            vm.objectToCreate[field.model] = element;
        }
    }

})();
