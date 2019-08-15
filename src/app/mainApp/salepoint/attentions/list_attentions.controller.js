(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .controller('listAttentionController', listAttentionController);

    function listAttentionController(ATTENTIONS, ErrorHandler, $document, $mdDialog) {
        var vm = this;

        //Listado de Variables

        vm.list=[];
        vm.offset = 0;
        vm.filteredActivated = false;
        vm.limit = 20;
        vm.lastFilter = 'Abierta';
        vm.lastKindFilter = 'Abierta';
        vm.refreshPaginationButtonsComponent = false;

        //Listado de funciones

        vm.listAttentions = listAttentions;
        vm.listFilteredAttentions = listFilteredAttentions;
        vm.AssignationTechnician = AssignationTechnician;

        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        //vm.statusDetail = statusDetail;

        listFilteredAttentions('Todo');

        function listFilteredAttentions(requestKind) {
            vm.filteredActivated = true;
            vm.refreshPaginationButtonsComponent = false;
            vm.lastFilter = requestKind;
            if (vm.lastKindFilter !== requestKind){
                vm.offset = 0;
                vm.lastKindFilter = requestKind;
            }
            if (requestKind === 'Todo') {
                listAttentions();
            }
            else {
                var filterSTR = {status: requestKind};
                vm.loadingPromise = ATTENTIONS.listAttentions(vm.limit, vm.offset, filterSTR)
                    .then(function(listprerequestelements){
                        vm.list=listprerequestelements;
                        prepareDataFunction();
                    })
                    .catch(function (errCarga) {
                        ErrorHandler.errorTranslate(errCarga);
                    });
            }
        }

        function listAttentions() {
            vm.loadingPromise = ATTENTIONS.listAttentions(vm.limit, vm.offset)
                .then(function(listprerequestelements){
                    vm.list=listprerequestelements;
                    prepareDataFunction();
                })
                .catch(function (errCarga) {
                    ErrorHandler.errorTranslate(errCarga);
                });

        }

        function prepareDataFunction() {
            vm.requests = vm.list.results;
            if (vm.list.count > vm.limit) {
                vm.refreshPaginationButtonsComponent = true;
            }
            vm.filteredActivated = false;
        }

        function sigPage() {
            vm.offset += vm.limit;
            listFilteredAttentions(vm.lastFilter);
        }

        function prevPage() {
            vm.offset -= vm.limit;
            listFilteredAttentions(vm.lastFilter);
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            listFilteredAttentions(vm.lastFilter);
        }

        //funcion para asignar
        function AssignationTechnician(attention) {
            $mdDialog.show({
                controller: 'dialogAsignationTechnicianController',
                templateUrl: 'app/mainApp/salepoint/attentions/assignment/dialogAssignationTechnician.tmpl.html',
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

        /*function selectRequest(request) {
            $state.go('triangular.admin-default.attentionDetail', {id: request, tipo: vm.selectedKind});
        }*/

    }

})();
