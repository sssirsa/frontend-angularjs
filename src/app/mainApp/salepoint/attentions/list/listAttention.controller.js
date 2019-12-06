(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.request')
        .controller('listAttentionController', ListAttentionController);

    /* @ngInject */
    function ListAttentionController(
        ATTENTIONS,
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

        vm.attentions = [];

        function init() {
            vm.attentionsKindFilter = 'all-attentions';
            loadAttentions(vm.requestKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.requestKindFilter = filter;
            loadAttentions(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreAttentions = ATTENTIONS
                .listAttentions(vm.requestKindList, vm.paginationHelper.page + 1)
                .then(function (attentionsList) {
                    vm.paginationHelper.page++;
                    vm.attentions = vm.attentions.concat(attentionsList[PAGINATION.elements]);
                })
                .catch(function (attentionsListError) {
                    ErrorHandler.errorTranslate(attentionsListError);
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
        function loadAttentions(filter, page) {
            vm.attentions = [];
            page ? null : page = 1;
            switch (filter) {
                case 'all-attentions':
                    vm.requestKindList = null;
                    break;
                case 'open-attentions':
                    vm.requestKindList = 'open';
                    break;
                case 'assigned-attentions':
                    vm.requestKindList = 'assigned';
                    break;
                case 'in-process-attentions':
                    vm.requestKindList = 'in-process';
                    break;
                case 'closed-attentions':
                    vm.requestKindList = 'closed';
                    break;
                case 'cancelled-attentions':
                    vm.requestKindList = 'cancelled';
                    break;
            }

            vm.loadingAttentions = ATTENTIONS
                .listAttentions(vm.requestKindList, 1)
                .then(function (attentionsList) {
                    vm.attentions = attentionsList[PAGINATION.elements];
                    vm.paginationHelper.page = page;
                    vm.paginationHelper.totalPages = Math.ceil(
                        attentionsList[PAGINATION.total] / PAGINATION.pageSize
                    );
                })
                .catch(function (attentionsListError) {
                    ErrorHandler.errorTranslate(attentionsListError);
                });
        }

    }
})();
