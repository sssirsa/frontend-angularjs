(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.request')
        .controller('listRequestController', ListRequestController);

    /* @ngInject */
    function ListRequestController(
        REQUESTS,
        PAGINATION,
        ErrorHandler,
        $state,
        $mdDialog
    ) {
        var vm = this;

        //Variables
        vm.requestKindFilter;
        vm.requestKindList;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        vm.requests = [];

        function init() {
            vm.requestsKindFilter = 'all-requests';
            loadRequests(vm.requestKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.requestKindFilter = filter;
            loadRequests(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreRequests = REQUESTS
                .listRequests(vm.requestKindList, vm.paginationHelper.page + 1)
                .then(function (requestsList) {
                    vm.paginationHelper.page++;
                    vm.requests = vm.requests.concat(requestsList[PAGINATION.elements]);
                })
                .catch(function (requestsListError) {
                    ErrorHandler.errorTranslate(requestsListError);
                });
        };

        vm.generatePDF = function () {
            //TODO:Create functionality for PDF
        };

        vm.navigateToDetail = function (request) {
            $state.go('triangular.admin-default.detail-request', {
                id: request.id,
                request: request
            });
        };

        vm.assignTechnician = function (attention) {
            $mdDialog.show({
                controller: 'dialogAsignationTechnicianController',
                templateUrl: 'app/mainApp/salepoint/attentions/assignment/dialogAssignationTechnician.tmpl.html',
                controllerAs: 'vm',
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    attention: attention
                }
            })
                .then(function () {
                    vm.listAttentions();
                });
        };

        //Internal functions
        function loadRequests(filter, page) {
            vm.requests = [];
            page ? null : page = 1;
            switch (filter) {
                case 'all-requests':
                    vm.requestKindList = null;
                    break;
                case 'open-requests':
                    vm.requestKindList = 'open';
                    break;
                case 'assigned-requests':
                    vm.requestKindList = 'assigned';
                    break;
                case 'in-process-requests':
                    vm.requestKindList = 'in-process';
                    break;
                case 'closed-requests':
                    vm.requestKindList = 'closed';
                    break;
                case 'cancelled-requests':
                    vm.requestKindList = 'cancelled';
                    break;
            }

            vm.loadingRequests = REQUESTS
                .listRequests(vm.requestKindList, 1)
                .then(function (requestsList) {
                    vm.requests = requestsList[PAGINATION.elements];
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        requestsList[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (requestsListError) {
                    ErrorHandler.errorTranslate(requestsListError);
                });
        }

    }
})();
