/* 
 *      dialog:{              //Labels to use in the creation dialog
 *          title: string,          (Optional) Title for the creation dialog, default is 'Search element'
 *          searchButton: string,   (Optional) Label for the Search button, default is 'Search'
 *          loadingText: string     (Optional) Text to show in the Loading, default is "Please wait..."
 *      },
 *      filters:[
 *          {
 *              type: string,            Valid types are ['equals', 'not', 'contains', 'startswith', 'icontains', 'istartswith'] Default is equals
 *              model: string,           Is the exact name of the field that will be used for searching
 *              header: string,          (Optional) Header to show in the tab, default is "Search by {{label}}" or "Search by {{model}}" if no label is given either
 *              label: string,           (Optional) Label to show in the search-bar or selector. Default is model
 *              field:{
 *                  type: string,        Valid types are html5 types plus catalog and options
 *                  catalog:{                (Optional) Just used when the type of the field is catalog, in this case the component handles itself the loading of the catalog
 *                      lazy: boolean,       (Optional) Determines if the load is lazy or initial
 *                      url: string,         Full or partial URL depending on the kind
 *                      kind: string,        (Optional) Mobile, Web, Generic. Default is 'Generic'
 *                      model: string,       From the catalog object, which element will be sent (aka: id, name, etc.)
 *                      option: string       (Optional) From the catalog object, which element will be shown in the list (ake: name, description, etc)
 *                                           If not given, then the model will be used
 *                  },
 *                  options:{              // (Optional) Just used when the field is options, in this case, the possible options are passed to the component since the beginning
 *                      model: string,            Field of the element to be used in the model
 *                      option: string,           Field of the element to show in list
 *                      elements:[
 *                          {
 *                              model: {{}},
 *                              option: {{}}
 *                          }
 *                      ]
 *                  }
 *              }
 *          }
 *      ],
 *      provider: CATALOG provider object,
 *
*      PROVIDER = {        //Every function must return a promise, the URL must be defined when the provider object is given
 *                         //The Search dialog just uses the "search" function of the provider
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
    'use strict';
    angular
        .module('app.mainApp')
        .controller('CatalogSearchDialogController', CatalogSearchDialogController);

    function CatalogSearchDialogController(
        $mdDialog,
        provider,
        dialog,
        filters
    ) {
        var vm = this;

        //Variables
        vm.selectedTab = 0;
        vm.CatalogProvider = provider;
        vm.dialog = dialog;
        vm.filters = filters;
        vm.searchAuxVar = null;

        //Functions
        vm.search = search;
        vm.changeTab = changeTab;
        vm.cancel = cancel;

        function search(filter) {
            let query = filter.model;
            if (filter.type !== 'equals') {
                query = query + "__" + filter.type + "=";
            }
            else {
                query = query + "=";
            }
            query = query + vm.searchAuxVar;
            vm.searchingPromise = vm.CatalogProvider
                .search(query)
                .then(function (response) {
                    filter.search = vm.searchAuxVar;
                    $mdDialog.hide({ response: response, filter: filter });
                })
                .catch(function (errorSearch) {
                    $mdDialog(errorSearch);
                });
        }

        function changeTab() {
            vm.searchAuxVar = null;
        }

        function cancel() {
            $mdDialog.cancel(null);
        }

    }

})();
