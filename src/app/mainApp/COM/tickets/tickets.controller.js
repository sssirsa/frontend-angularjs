/** Created by Alejandro Noriega on 29/01/19 */
/** Modified by Francisco Cerda on 03/02/19 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.com.tickets')
        .controller('ticketsController', ticketsController);

    function ticketsController(API, $mdDialog, toastr,TicketProvider,ErrorHandler) {
        var vm = this;

        vm.tickets = {};
        vm.loadingPromise = {};
        vm.selectedKind = '';
        vm.searchText = '';
        vm.tipolist = 0;
        vm.searchBool = false;

        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.searchCabinet = searchCabinet;
        vm.showTicket = showTicket;
        vm.changeSelected = changeSelected;
        vm.removeFilter = removeFilter;
        vm.getTicketInfo=getTicketInfo;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.objectPaginado = null;

        vm.OPTIONS = [
            {
                text: 'Recibido'
            },
            {
                text: 'Confirmado'
            },
            {
                text: 'Error'
            },
            {
                text: 'Empezado'
            },
            {
                text: 'Cerrado'
            },
            {
                text: 'Cancelado'
            }
        ];

        vm.categories={
            start:'Acknowledge',
            info:'Information',
            error:'Issue',
            close:'Closure'
        };

        function list(limit, offset, querySet) {
            if (querySet === undefined) {
                return API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset).customGET();
            }
            else {
                return API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset + '&' + querySet).customGET();
            }
        }


        init();

        function init(){
            listTickets();
        }


        function listTickets(){
            vm.tickets = {};
            vm.loadingPromise = list(vm.limit, vm.offset, vm.querySet)
                .then(function listT(list) {
                    vm.tickets = list.results;
                    vm.objectPaginado = list;
                    vm.refreshPaginationButtonsComponent = true;
                })
                .catch(function ListError(error) {
                    console.error(error);
                });
        }

        function showTicket(item){
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'detailTicketController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/COM/tickets/modal/showTicket.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals:{
                    data: vm.toModel
                }
            })
                .then(function () {
                })
                .catch(function(){
                });

        }

        function changeSelected(){
            vm.tipolist = 1;
            vm.querySet = '';
        }

        function searchCabinet(){
            vm.querySet = '';
            vm.querySet = 'cabinet__icontains=' + vm.searchText + '&estatus__icontains=' + vm.selectedKind;
            vm.tickets = null;
            vm.searchBool = true;
            listTickets();
        }

        function sigPage() {
            vm.offset += vm.limit;
            paginadoRefresh();
        }

        function prevPage() {
            vm.offset -= vm.limit;
            paginadoRefresh();
        }

        function goToNumberPage(number) {
            vm.offset = number * vm.limit;
            paginadoRefresh();
        }

        function paginadoRefresh() {
            vm.tickets = {};
            vm.objectPaginado = null;
            listTickets();
        }

        function removeFilter(){
            vm.searchBool = false;
            vm.querySet = '';
            vm.tickets = null;
            vm.selectedKind = '';
            vm.searchText = '';
            listTickets();
        }

        //Aquí empieza lo de Paco
        function getTicketInfo(item, activity) {
            console.log(item);
            var TicketProviderPromise=TicketProvider.getServiceDetails(item.mensaje_com);
            TicketProviderPromise.then(function (serviceDetails) {
                vm.serviceDetails=serviceDetails.service_details;
                console.log(vm.serviceDetails);
                getPossibleMessages(vm.serviceDetails[0].service_task_type, activity);
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });

        }
        function getPossibleMessages(service_task_type, activity){
            var messages_statusPromise=TicketProvider.getTicket_type(service_task_type);
            messages_statusPromise.then(function (message_status) {
                vm.messageStatusCatalog=_.where(message_status.messages_status,{categoria:activity});
                console.log(vm.messageStatusCatalog);
            }).catch(function(error){
                ErrorHandler.errorTranslate(error);
            });
        }
        function openDialog(){

        }


    }


})();
