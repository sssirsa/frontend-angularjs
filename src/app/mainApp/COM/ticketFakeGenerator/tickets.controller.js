/** Created by Alejandro Noriega on 29/01/19 */
/** Modified by Francisco Cerda on 03/02/19 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.com.ticketFakerGenerator')
        .controller('ticketFakerController', ticketsController);

    function ticketsController(API, $mdDialog, toastr, COM, MANAGEMENT,EnvironmentConfig, URLS, TicketProvider, ErrorHandler, Translate) {
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
        vm.createTicket = createTicket;

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

        vm.categories = {
            start: 'Acknowledge',
            info: 'Information',
            error: 'Issue',
            close: 'Closure'
        };


        function list(limit, offset, querySet) {
            if (querySet === undefined) {
                return API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset).customGET();
            } else {
                return API.all("com_middleware/com/ticket" + '?limit=' + vm.limit + '&offset=' + vm.offset + '&' + querySet).customGET();
            }
        }


        init();

        function init() {
            listTickets();
        }


        function listTickets() {
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

        function showTicket(item) {
            vm.toModel = angular.copy(item);
            $mdDialog.show({
                controller: 'detailTicketController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/COM/tickets/modal/showTicket.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    data: vm.toModel
                }
            })
                .then(function () {
                })
                .catch(function () {
                });

        }

        function changeSelected() {
            vm.tipolist = 1;
            vm.querySet = '';
        }

        function searchCabinet() {
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

        function removeFilter() {
            vm.searchBool = false;
            vm.querySet = '';
            vm.tickets = null;
            vm.selectedKind = '';
            vm.searchText = '';
            listTickets();
        }

        //Aquí empieza lo de Paco
        function createTicket() {
            createMeta();

        }


        function createMeta() {
            vm.fields = [
                {
                    type: 'catalog',
                    model: 'service_task_type',
                    required: true,
                    label: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + COM.base
                            + '/' + COM.catalogues.base
                            + '/' + COM.catalogues.ticket_type,
                        name: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                        model: 'com_ticket_code',//campo a pasar
                        option: 'descripcion',//campo a mostrar
                        elements: 'results',
                        showModel: true,
                        pagination: {}
                    }
                },
                {
                    type: 'catalog',
                    model: 'cabinet',
                    required: true,
                    label: Translate.translate('COM.FIELDS.CABINET'),
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + MANAGEMENT.base
                            + '/' + MANAGEMENT.inventory.base
                            + '/' + MANAGEMENT.inventory.cabinet,
                        name: Translate.translate('COM.FIELDS.CABINET'),
                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                        model: 'economico',//campo a pasar
                        option: 'economico',//campo a mostrar
                        elements: 'results',
                        showModel: false,
                        pagination: {}
                    }
                },
                {
                    type: 'catalog',
                    model: 'cabinet_replace',
                    required: true,
                    label: Translate.translate('COM.FIELDS.REPLACE_CABINET'),
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + MANAGEMENT.base
                            + '/' + MANAGEMENT.inventory.base
                            + '/' + MANAGEMENT.inventory.cabinet,
                        name: Translate.translate('COM.FIELDS.REPLACE_CABINET'),
                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                        model: 'economico',//campo a pasar
                        option: 'economico',//campo a mostrar
                        elements: 'results',
                        showModel: false,
                        pagination: {}
                    }
                },
                {
                    type: 'catalog',
                    model: 'ticket',
                    required: true,
                    label: Translate.translate('COM.FIELDS.TICKET'),
                    catalog: {
                        url: EnvironmentConfig.site.rest.api
                            + '/' + COM.base
                            + '/' + COM.actions.base
                            + '/' + COM.actions.ticket.base,
                        name: Translate.translate('COM.FIELDS.TICKET'),
                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                        model: 'identificador',//campo a pasar
                        option: 'folio',//campo a mostrar
                        elements: 'results',
                        showModel: false,
                        pagination: {}
                    }
                }
            ];
            openDialog();
        }

        function openDialog() {
            console.log(COM);
            vm.dialog = {
                title: Translate.translate('COM.ADDITIONAL_TEXTS.NOTIFICATION'),
                okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                loading: 'Guardando Acción'
            };
            vm.url = EnvironmentConfig.site.rest.api
                + '/' + COM.base
                + '/' + COM.actions.base
                + '/' + COM.actions.message.base
                + '/' + COM.actions.message.send;

            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: vm.dialog,
                    fields: vm.fields,
                    url: vm.url
                }
            }).then(function () {
                ErrorHandler.successUpdate();
            }).catch(function (errorDelete) {
                if (errorDelete) {
                    ErrorHandler.errorTranslate(errorDelete);
                }
            });
        }


    }


})
();
