(function () {
    'use strict';

    angular
        .module('requests')
        .config(requestsModuleConfig);

    /* @ngInject */
    function requestsModuleConfig($stateProvider, triMenuProvider) {

        $stateProvider
            .state('triangular.newRequest', {
                url: '/request/new',
                templateUrl: 'app/requests/new/new-request-page.tmpl.html',
                // set the controller to load for this page
                controller: 'NewRequestPageController',
                controllerAs: 'vm',
                // layout-column class added to make footer move to
                // bottom of the page on short pages
                data: {
                    layout: {
                        contentClass: 'layout-column'
                    }
                }
            })
            .state('triangular.listRequest', {
                url: '/request/list',
                templateUrl: 'app/requests/list/list-requests-page.tmpl.html',
                // set the controller to load for this page
                controller: 'ListRequestPageController',
                controllerAs: 'vm',
                // layout-column class added to make footer move to
                // bottom of the page on short pages
                data: {
                    layout: {
                        contentClass: 'layout-column'
                    }
                }
            })
            .state('triangular.detailRequest', {
                url: '/request/detail/:id',
                templateUrl: 'app/requests/detail/detail-request-page.tmpl.html',
                // set the controller to load for this page
                controller: 'DetailRequestPageController',
                controllerAs: 'vm',
                params:{
                    id:null
                },
                // layout-column class added to make footer move to
                // bottom of the page on short pages
                data: {
                    layout: {
                        contentClass: 'layout-column'
                    }
                }
            });

        triMenuProvider.addMenu({
            name: 'Solicitudes',
            icon: 'fa fa-page',
            type: 'dropdown',
            priority: 2,
            children: [{
                name: 'Nueva',
                state: 'triangular.newRequest',
                type: 'link'
            },{
                name: 'Listado',
                state: 'triangular.listRequest',
                type: 'link'
            }]
        });

    }
})();
