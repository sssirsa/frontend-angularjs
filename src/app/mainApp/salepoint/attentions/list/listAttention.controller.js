(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.attention')
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
        vm.attentionKindFilter;
        vm.attentionKindList;
        vm.paginationHelper = {
            page: 0,
            totalPages: 0
        };

        vm.attentions = [];

        function init() {
            vm.attentionsKindFilter = 'all-attentions';
            loadAttentions(vm.attentionKindFilter);
        }
        init();

        //Functions
        vm.filterChange = function (filter) {
            vm.attentionKindFilter = filter;
            loadAttentions(filter);
        };

        vm.loadMore = function () {
            vm.loadingMoreAttentions = ATTENTIONS
                .listAttentions(vm.attentionKindList, vm.paginationHelper.page + 1)
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

        vm.navigateToDetail = function (attention) {
            switch (attention.tipo) {
                case 'Alta':
                    $state.go('triangular.admin-default.new-attention', { id: attention.folio });
                    break;

                case 'Cambio':
                    $state.go('triangular.admin-default.change-attention', { id: attention.folio });
                    break;

                case 'Reparacion':
                    $state.go('triangular.admin-default.service-attention', { id: attention.folio });
                    break;

                case 'Retiro':
                    $state.go('triangular.admin-default.retrieve-attention', { id: attention.folio });
                    break;

                default:
                    throw new Error('@ListAttentionController,  @navigateToDetail function, "attention.tipo field is not a valid choice"');
            }
            //$state.go('triangular.admin-default.detail-attention', {
            //    id: attention.id,
            //    attention: attention
            //});
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
                    vm.loadAttentions();
                });
        };

        //Internal functions
        function loadAttentions(filter, page) {
            vm.attentions = [];
            page ? null : page = 1;
            switch (filter) {
                case 'all-attentions':
                    vm.attentionKindList = null;
                    break;
                case 'open-attentions':
                    vm.attentionKindList = 'open';
                    break;
                case 'assigned-attentions':
                    vm.attentionKindList = 'assigned';
                    break;
                case 'in-process-attentions':
                    vm.attentionKindList = 'in-process';
                    break;
                case 'closed-attentions':
                    vm.attentionKindList = 'closed';
                    break;
                case 'cancelled-attentions':
                    vm.attentionKindList = 'cancelled';
                    break;
            }

            vm.loadingAttentions = ATTENTIONS
                .listAttentions(vm.attentionKindList, 1)
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
