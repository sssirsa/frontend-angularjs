/*
                    fields:[
                 *          {
                 *              type: string,          Valid types are the html5 types, plus the types: options, catalog and fileUploader
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
                 *              catalog:{                (Optional) Just used when the type of the field is catalog,
                 *                                       in this case the component catalog-select is used to delegate the catalog handling
                 *                  requires: string,    (Optional) Field required to enable this catalog
                 *                  lazy: boolean,       (Optional) Determines if the load is lazy or initial
                 *                  url: string,         Full or partial URL depending on the kind
                 *                  kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
                 *                  name: string,        (Optional) Name of the catalog to show in the label
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
                 *      },
                 *      provider: CATALOG provider object
*/

(function () {
    angular
        .module('app.mainApp')
        .controller('CatalogCreateDialogController', CatalogCreateDialogController);
    function CatalogCreateDialogController($mdDialog, dialog, provider, fields) {
        var vm = this;

        vm.dialog = dialog;
        vm.fields = fields;
        vm.CatalogProvider = provider;

        vm.objectToCreate = {};

        vm.create = create;
        vm.cancel = cancel;
        vm.filesSelected = filesSelected;
        vm.onElementSelect = onElementSelect;

        function create(objectToCreate) {
            vm.createLoader = vm.CatalogProvider
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
