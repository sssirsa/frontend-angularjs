(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.service_assigment')
        .controller('serviceAssignmentController', serviceAssignmentController);

    function serviceAssignmentController(
        ATTENTIONS,
        $state,
        $mdDialog,
        $document,
        ErrorHandler,
        PAGINATION
    ) {
        var vm = this;

        // initial variables
        vm.selectedKind = 'unasigned';
        vm.attentions = null;
        vm.objectAttention = null;

        // pagination initial variables
        vm.offset = 0;
        vm.limit = PAGINATION.pageSize;
        vm.filerParams = {persona__nombre: 'null', ordering: 'fecha_creacion'};
        vm.refreshPaginationButtonsComponent = false;

        // binging functions
        vm.AssignationTechnician = AssignationTechnician;
        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.selectAttention = selectAttention;

        // control functions
        initialFunctionAttentions();
        function initialFunctionAttentions(){
            listAttentions();
        }

        function refreshListVariables() {
            vm.refreshPaginationButtonsComponent = false;
            vm.objectAttention = null;
            vm.attentions = null;
        }
        function listAttentions() {
            refreshListVariables();
            vm.attentionsPromise = ATTENTIONS
                .listAttentions(vm.limit, vm.offset, vm.filerParams)
                .then(function (attentionsSuccess) {
                    vm.objectAttention = attentionsSuccess;
                    prepareDataFunction();
                })
                .catch(function (attentionsError) {
                    ErrorHandler.error(attentionsError);
                });
        }

        function AssignationTechnician(attention) {
            $mdDialog.show({
                controller: '',
                templateUrl: 'app/mainApp/salepoint/service_assignment/dialog/dialogAssignationTechnician.tmpl.html',
                parent: angular.element($document.body),
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
        }

        // pagination functions
        function prepareDataFunction() {
            vm.attentions = vm.objectAttention.results;
            vm.refreshPaginationButtonsComponent = true;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listAttentions();
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listAttentions();
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            listAttentions();
        }

        function selectAttention(attention) {
            $state.go('triangular.admin-default.service-assignment-detail', {id: attention.folio, type: attention.tipo});
        }

    }
})();
