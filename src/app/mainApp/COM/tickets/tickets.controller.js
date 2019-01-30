/** Created by Alejandro Noriega on 29/01/19 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.com.tickets')
        .controller('ticketsController', ticketsController);

    function ticketsController(API) {
        var vm = this;

        vm.tickets = {};
        vm.querySet = '';
        vm.loadingPromise = {};

        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        //vm.searchCabinet = searchCabinet;
        vm.showTicket = showTicket;

        //datos para paginado
        vm.objectPaginado = null;
        vm.offset = 0;
        vm.limit = 20;
        vm.refreshPaginationButtonsComponent = false;
        vm.objectPaginado = null;

        vm.OPTIONS = [
            {
                text: 'Recibido',
                id: 1
            },
            {
                text: 'Enviado',
                id: 2
            },
            {
                text: 'Confirmado',
                id: 3
            },
            {
                text: 'Error',
                id: 4
            },
            {
                text: 'Cancelado',
                id: 5
            },
            {
                text: 'Abierto',
                id: 6
            },
            {
                text: 'Empezado',
                id: 7
            }
        ];

        function list(limit, offset, querySet) {
            if (querySet === undefined) {
                return API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset).customGET();
            }
            else {
                API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset + '&' + querySet).customGET();
            }
        }


        init();

        function init(){
            listTickets();
        }

        function listTickets(){
            vm.loadingPromise = list(vm.limit, vm.offset)
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
    }


})();
