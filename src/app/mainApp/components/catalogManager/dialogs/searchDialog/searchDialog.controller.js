/* 
 *      dialog:{              //Labels to use in the creation dialog
 *          title: string,          (Optional) Title for the creation dialog, default is 'Search element'
 *          searchButton: string,   (Optional) Label for the Search button, default is 'Search'
 *          loadingText: string     (Optional) Text to show in the Loading, default is "Please wait..."
 *      },
 *      provider: CATALOG provider object,
 *      fields:[
 *          {
 *              type: string,            Valid types are the html5 types, plus the types: options and catalog
 *              model: string,           Is the name of the field that will be used for searching
 *              header: string,          (Optional) Header to show in the tab, default is "Search by {{label}}" or "Search by {{model}}" if no label is given either
 *              label: string,           (Optional) Label to show in the search-bar or selector
 *              
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
 *                  model: string,            Field of the element to be used in the searching
 *                  option: string,           Field of the element to show in list
 *                  elements:[
 *                      {
 *                          model: {{}},
 *                          option: {{}}
 *                      }
 *                  ]
 *              }
 *          }
 *      ]
*/

(function () {
    'use strict';
    angular
        .module('app.mainApp')
        .controller('CatalogSearchDialogController', CatalogSearchDialogController);

    function CatalogSearchDialogController(
        $mdDialog,
        provider,
        dialog
    ) {
        var vm = this;
        
        //Variables
        vm.selectedTab = 0;

    }

}) ();
