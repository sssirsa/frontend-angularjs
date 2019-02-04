/** Created by Alejandro Noriega on 29/01/19 */
/** Modified by Francisco Cerda on 03/02/19 */

(function () {
    'use strict';

    angular
        .module('app.mainApp.com.tickets')
        .controller('ticketsController', ticketsController);

    function ticketsController(API, $mdDialog, toastr, TicketProvider, ErrorHandler, Translate) {
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
        vm.getTicketInfo = getTicketInfo;

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
            }
            else {
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
        function getTicketInfo(item, activity) {
            console.log(item);
            var TicketProviderPromise = TicketProvider.getServiceDetails(item.mensaje_com);
            TicketProviderPromise.then(function (serviceDetails) {
                vm.serviceDetails = serviceDetails.service_details;
                console.log(vm.serviceDetails);
                getPossibleMessages(vm.serviceDetails[0].service_task_type, activity);
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });

        }

        function getPossibleMessages(service_task_type, activity) {
            var messages_statusPromise = TicketProvider.getTicket_type(service_task_type);
            messages_statusPromise.then(function (message_status) {
                vm.messageStatusCatalog = _.where(message_status.messages_status, {categoria: activity});
                console.log(vm.messageStatusCatalog);
                createMeta(activity);
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });
        }

        function createMeta(activity) {
            if (activity === vm.categories.close) {

                vm.meta_incidences = {
                    fields: [
                        {
                            type: 'array_object',
                            model: 'service_details',
                            label: 'Detalle del servicio',
                            fields: [
                                {
                                    type: 'catalog',
                                    model: 'service_task_type',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                                    label: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                                    lock: true,
                                    catalog: {
                                        url: Translate.translate('COM.URLS.SERVICE_TASK_TYPE'),
                                        name: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                                        model: 'com_ticket_code',//campo a pasar
                                        option: 'descripcion'//campo a mostrar
                                    }
                                }, {
                                    type: 'string',
                                    model: 'asset_type_code',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.ASSET_TYPE_CODE'),
                                    label: Translate.translate('COM.FIELDS.ASSET_TYPE_CODE'),
                                    lock: true

                                }, {
                                    type: 'string',
                                    model: 'asset_global_code',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.ASSET_GLOBAL_CODE'),
                                    label: Translate.translate('COM.FIELDS.ASSET_GLOBAL_CODE'),
                                    lock: true

                                }, {
                                    type: 'string',
                                    model: 'serial_number',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.SERIAL_NUMBER'),
                                    label: Translate.translate('COM.FIELDS.SERIAL_NUMBER'),
                                    lock: true
                                }, {
                                    type: 'string',
                                    model: 'bar_code',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.BAR_CODE'),
                                    label: Translate.translate('COM.FIELDS.BAR_CODE'),
                                    lock: true
                                }, {
                                    type: 'string',
                                    model: 'product_description',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.PRODUCT_DESCRIPTION'),
                                    label: Translate.translate('COM.FIELDS.PRODUCT_DESCRIPTION'),
                                    lock: true
                                }, {
                                    type: 'string',
                                    model: 'product_variant_code',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.PRODUCT_VARIANT_CODE'),
                                    label: Translate.translate('COM.FIELDS.PRODUCT_VARIANT_CODE'),
                                    lock: false
                                }, {
                                    type: 'catalog',
                                    model: 'asset_condition',
                                    required: true,
                                    hint: Translate.translate('COM.FIELDS.ASSET_CONDITION'),
                                    label: Translate.translate('COM.FIELDS.ASSET_CONDITION'),
                                    lock: true,
                                    catalog: {
                                        url: Translate.translate('COM.URLS.ASSETCONDITION'),
                                        name: Translate.translate('COM.FIELDS.ASSETCONDITION'),
                                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                                        model: 'com_code',//campo a pasar
                                        option: 'descripcion'//campo a mostrar

                                    }

                                },
                                {
                                    type: 'array_object',
                                    model: 'service_dates',
                                    label: Translate.translate('COM.FIELDS.ASSETCONDITION'),
                                    hint: Translate.translate('COM.FIELDS.ASSETCONDITION'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'date_type',
                                            label: '',
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.DATE_TYPE'),
                                                name: Translate.translate('COM.FIELDS.DATE_TYPE'),
                                                model: 'com_code',
                                                option: 'nombre'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'date',
                                            label: Translate.translate('COM.FIELDS.DATE'),
                                            validations: {
                                                date_format: "YYYYMMDDhhmmss"//checar como es este formato con Plata
                                            }
                                        }
                                    ]
                                }, {
                                    type: 'array_object',
                                    model: 'asset_components',
                                    label: Translate.translate('COM.FIELDS.ASSET_COMPONENTS'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'component_type',
                                            label: Translate.translate('COM.FIELDS.ASSET_COMPONENTS'),
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.COMPONENT_TYPE'),
                                                name: Translate.translate('COM.FIELDS.COMPONENT_TYPE'),
                                                model: 'com_code',
                                                option: 'descripcion'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'component',
                                            label: Translate.translate('COM.FIELDS.COMPONENT')
                                        },
                                        {
                                            type: 'text',
                                            model: 'sku',
                                            label: Translate.translate('COM.FIELDS.SKU')
                                        },
                                        {
                                            type: 'text',
                                            model: 'serial_number',
                                            label: Translate.translate('COM.FIELDS.SERIAL_NUMBER')
                                        }
                                    ]
                                }, {
                                    type: 'array_object',
                                    model: 'asset_addons',
                                    label: Translate.translate('COM.FIELDS.ASSET_ADDONS'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'asset_type',
                                            label: Translate.translate('COM.FIELDS.ASSET_TYPE'),
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.ASSET_TYPE'),
                                                name: Translate.translate('COM.FIELDS.ASSET_TYPE'),
                                                model: 'com_code',
                                                option: 'descripcion'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'quantity',
                                            label: Translate.translate('COM.FIELDS.QUANTITY')
                                        },
                                        {
                                            type: 'text',
                                            model: 'product_category_code',
                                            label: Translate.translate('COM.FIELDS.PRODUCT_CATEGORY_CODE')
                                        },

                                        {
                                            type: 'text',
                                            model: 'product_code',
                                            label: Translate.translate('COM.FIELDS.PRODUCT_CODE')
                                        },
                                        {
                                            type: 'text',
                                            model: 'product_description',
                                            label: Translate.translate('COM.FIELDS.PRODUCT_DESCRIPTION')
                                        }
                                    ]
                                },
                                {
                                    type: 'array_object',
                                    model: 'process_instructions',
                                    label: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTIONS'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'process_instruction_code',
                                            label: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTION_CODE'),
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.PROCESS_INSTRUCTION_CODE'),
                                                name: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTION_CODE'),
                                                model: 'com_code',
                                                option: 'descripcion'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'process_instruction_value',
                                            label: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTION_VALUE')
                                        },
                                        {
                                            type: 'text',
                                            model: 'process_instruction_extra_notes',
                                            label: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTION_EXTRA_NOTES')
                                        }
                                    ]
                                },
                                {
                                    type: 'array_object',
                                    model: 'repairs',
                                    label: Translate.translate('COM.FIELDS.REPAIRS'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'repair_action_code',
                                            label: Translate.translate('COM.FIELDS.REPAIR_ACTION_CODE'),
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.REPAIR_ACTION_CODE'),
                                                name: Translate.translate('COM.FIELDS.REPAIR_ACTION_CODE'),
                                                model: 'com_code',
                                                option: 'descripcion'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'repair_action_notes',
                                            label: Translate.translate('COM.FIELDS.REPAIR_ACTION_NOTES')
                                        }
                                    ]
                                },
                                {
                                    type: 'array_object',
                                    model: 'faults',
                                    label: Translate.translate('COM.FIELDS.FAULTS'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'fault_code',
                                            label: Translate.translate('COM.FIELDS.FAULT_CODE'),
                                            required: true,
                                            catalog: {
                                                url: Translate.translate('COM.URLS.FAULT_CODE'),
                                                name: Translate.translate('COM.FIELDS.FAULT_CODE'),
                                                model: 'com_code',
                                                option: 'nombre'
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'fault_notes',
                                            label: Translate.translate('COM.FIELDS.FAULT_NOTES')
                                        }
                                    ]
                                },
                                {
                                    type: 'array_object',
                                    model: 'notifications',
                                    label: Translate.translate('COM.FIELDS.NOTIFICATIONS'),
                                    fields: [
                                        {
                                            type: 'options',
                                            model: 'notification_status_code',
                                            label: Translate.translate('COM.FIELDS.NOTIFICATION_STATUS_CODE'),
                                            required: true,
                                            options: {
                                                model: "com_code",
                                                option: "label",
                                                elements: vm.messageStatusCatalog
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'notification_extra_notes',
                                            label: Translate.translate('COM.FIELDS.NOTIFICATION_EXTRA_NOTES')
                                        }
                                    ]
                                }


                            ]

                        }

                    ]
                };
                openDialog();
            }
            else {
                vm.meta_incidences = {
                    fields: [
                        {
                            type: 'array_object',
                            model: 'service_details',
                            label: Translate.translate('COM.FIELDS.NOTIFICATIONS'),
                            fields: [],
                            validations:{
                                max:0
                            }
                        },
                        {
                            type: 'array_object',
                            model: 'repairs',
                            label: Translate.translate('COM.FIELDS.NOTIFICATIONS'),
                            fields: [],
                            validations:{
                                max:0
                            }
                        }, {
                            type: 'array_object',
                            model: 'faults',
                            label: Translate.translate('COM.FIELDS.NOTIFICATIONS'),
                            fields: [],
                            validations:{
                                max:0
                            }
                        },
                        {
                            type: 'array_object',
                            model: 'notifications',
                            label: Translate.translate('COM.FIELDS.NOTIFICATIONS'),
                            fields: [
                                {
                                    type: 'options',
                                    model: 'notification_status_code',
                                    label: Translate.translate('COM.FIELDS.NOTIFICATION_STATUS_CODE'),
                                    required: true,
                                    options: {
                                        model: "com_code",
                                        option: "label",
                                        elements: vm.messageStatusCatalog
                                    }
                                },
                                {
                                    type: 'text',
                                    model: 'notification_extra_notes',
                                    label: Translate.translate('COM.FIELDS.NOTIFICATION_EXTRA_NOTES')
                                }
                            ]
                        }
                    ]
                };
                openDialog();
            }
        }

        function openDialog() {

            vm.actions = {
                PUT: {
                    id: 'identificador',
                    fields: vm.meta_incidences,
                    dialog: {
                        title: Translate.translate('ACTION.LABELS.MODIFY'),
                        okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                        cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                        loading: 'Guardando Acción'
                    },
                    url:"http://api-gateway.sssirsa.com/dev/com_middleware/com/message/send/"
                }
            };



            $mdDialog.show({
                controller: 'CatalogModifyDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/modifyDialog/modifyDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: vm.actions['PUT'].dialog,
                    id: vm.actions['PUT'].id,
                    fields: vm.actions['PUT'].fields,
                    element: vm.serviceDetails,
                    url:vm.actions['PUT'].url
                }
            }).then(function () {
                activate();
                ErrorHandler.successUpdate();
                vm.onSuccessDelete();
            }).catch(function (errorDelete) {
                if (errorDelete) {
                    ErrorHandler.errorTranslate(errorDelete);
                    vm.onErrorDelete(errorDelete);
                }
            });
        }


    }


})();
