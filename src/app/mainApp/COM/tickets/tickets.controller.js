/** Created by Alejandro Noriega on 29/01/19 */
/** Modified by Francisco Cerda on 03/02/19 */
/** Modified by Christian Amezcua*/
(function () {
    'use strict';

    angular
        .module('app.mainApp.com.tickets')
        .controller('TicketsController', ticketsController);

    function ticketsController(API,
                               $mdDialog,
                               toastr,
                               EnvironmentConfig,
                               URLS,
                               COM,
                               TicketProvider,
                               ErrorHandler,
                               $log,
                               _,
                               Translate) {
        var vm = this;

        vm.tickets = {};
        vm.loadingPromise = {};
        vm.selectedKind = '';
        vm.searchText = '';
        vm.searchTicketText = '';
        vm.tipolist = 0;
        vm.searchBool = false;
        vm.tipo = undefined;

        vm.sig = sigPage;
        vm.prev = prevPage;
        vm.goToNumberPage = goToNumberPage;
        vm.searchCabinet = searchCabinet;
        vm.showTicket = showTicket;
        vm.changeSelected = changeSelected;
        vm.removeFilter = removeFilter;
        vm.getTicketInfo = getTicketInfo;
        vm.openDialogCreate = openDialogCreate;
        vm.listTickets = listTickets;
        vm.listAll=listAll;

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

        vm.categories = [
            {
                icon: 'fas fa-play',
                label: 'Inicio',
                value: 'Acknowledge'
            }, {
                icon: 'fas fa-info',
                label: 'Información',
                value: 'Information'
            }, {
                icon: 'fas fa-exclamation-triangle',
                label: 'Incidencia',
                value: 'Issue'
            }, {
                icon: 'fas fa-times-circle',
                label: 'Cerrar',
                value: 'Closure'
            }
        ];


        init();

        function init() {
            listTickets();
            listTicketsType();
        }

        function listAll() {
            vm.querySet='';
            vm.offset = 0;
            vm.limit = 20;
            vm.tipo=undefined;
            listTickets();


        }

        function listTickets() {
            vm.tickets = {};
            searchByTipoCom();
            $log.log(vm.querySet);
            vm.loadingPromise = TicketProvider.listTicket(vm.limit, vm.offset, vm.querySet)
                .then(function listT(list) {
                    vm.tickets = list.results;
                    vm.objectPaginado = list;
                    vm.refreshPaginationButtonsComponent = true;
                })
                .catch(function ListError(error) {
                    $log.error(error);
                });
        }

        function listTicketsType() {
            vm.promiseTicketTypeList = TicketProvider.getTicket_typeList()
                .then(function (listType) {
                    vm.tickets_type = listType.results;
                }).catch(function (errormsg) {
                    ErrorHandler.errorTranslate(errormsg);
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

        function searchByTipoCom() {
            if (vm.tipo) {
                vm.querySet = '';
                vm.querySet = 'tipo__com_ticket_code=' + vm.tipo;
                $log.log(vm.querySet);
            }

        }

        vm.searchByTicketNumber = function searchByTicketNumber(id) {
            vm.querySet = 'folio=' + id;
            vm.tickets = null;
            vm.searchBool = true;
            listTickets();
        };

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
            // $log.log(item);
            vm.identificador = item.identificador;
            var TicketProviderPromise = TicketProvider.getServiceDetails(item.mensaje_com);
            TicketProviderPromise.then(function (serviceDetails) {
                vm.serviceDetails = serviceDetails.service_details;
                //  $log.log(vm.serviceDetails);
                if (vm.serviceDetails.length == 1) {
                    getPossibleMessages(vm.serviceDetails[0].service_task_type, activity);
                } else {
                    getPossibleMessages('291110003', activity);
                }
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });

        }

        function getPossibleMessages(service_task_type, activity) {
            var messages_statusPromise = TicketProvider.getTicket_type(service_task_type);
            messages_statusPromise.then(function (message_status) {
                vm.messageStatusCatalog = _.where(message_status.messages_status, {categoria: activity});
                $log.log(vm.messageStatusCatalog);
                $log.log(vm.messageStatusCatalog.length);
                //$log.log(message_status);
                //$log.log(activity);
                // $log.log(vm.messageStatusCatalog);
                //createMeta(activity);
            }).catch(function (error) {
                ErrorHandler.errorTranslate(error);
            });
        }


        function createMeta(sendServiceDetails) {
            vm.object = {
                identificador: vm.identificador,
                service_details: [],
                repairs: [],
                faults: [],
                notifications: []
            };
            if (sendServiceDetails) {
                vm.object.notifications.push({
                    notification_status_code: vm.notification_code.com_code,
                    notification_extra_notes: ''
                });
                vm.object.service_details = vm.serviceDetails;
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
                                        url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.com.base
                                        + '/' + URLS.com.catalogues.base
                                        + '/' + URLS.com.catalogues.ticket_type,
                                        name: Translate.translate('COM.FIELDS.SERVICE_TASK_TYPE'),
                                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                                        model: 'com_ticket_code',//campo a pasar
                                        option: 'descripcion',//campo a mostrar
                                        elements: 'results', //elementos del promise donde iterar
                                        showModel: true,//mostrar model y option
                                        pagination: {}//manejo de Paginado
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
                                    required: false,
                                    hint: Translate.translate('COM.FIELDS.SERIAL_NUMBER'),
                                    label: Translate.translate('COM.FIELDS.SERIAL_NUMBER'),
                                    lock: true
                                }, {
                                    type: 'string',
                                    model: 'bar_code',
                                    required: false,
                                    hint: Translate.translate('COM.FIELDS.BAR_CODE'),
                                    label: Translate.translate('COM.FIELDS.BAR_CODE')
                                }, {
                                    type: 'string',
                                    model: 'product_description',
                                    required: false,
                                    hint: Translate.translate('COM.FIELDS.PRODUCT_DESCRIPTION'),
                                    label: Translate.translate('COM.FIELDS.PRODUCT_DESCRIPTION'),
                                    lock: true
                                }, {
                                    type: 'string',
                                    model: 'product_variant_code',
                                    required: false,
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
                                        url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.management.base
                                        + '/' + URLS.management.catalogues.base
                                        + '/' + URLS.management.catalogues.condition,
                                        name: Translate.translate('COM.FIELDS.ASSET_CONDITION'),
                                        loadMoreButtonText: Translate.translate('COM.ADDITIONAL_TEXTS.LOAD_MORE'),
                                        model: 'com_code',//campo a pasar
                                        option: 'descripcion',//campo a mostrar
                                        elements: 'results',//elementos del promise donde iterar
                                        showModel: true,//mostrar model y option
                                        pagination: {}//manejo de Paginado

                                    }

                                },
                                {
                                    type: 'array_object',
                                    model: 'service_dates',
                                    label: Translate.translate('COM.FIELDS.ASSET_CONDITION'),
                                    hint: Translate.translate('COM.FIELDS.ASSET_CONDITION'),
                                    fields: [
                                        {
                                            type: 'catalog',
                                            model: 'date_type',
                                            label: '',
                                            required: true,
                                            catalog: {
                                                url: EnvironmentConfig.site.rest.api
                                                + '/' + URLS.com.base
                                                + '/' + URLS.com.catalogues.base
                                                + '/' + URLS.com.catalogues.date_type,
                                                name: Translate.translate('COM.FIELDS.DATE_TYPE'),
                                                model: 'com_code',
                                                option: 'nombre',
                                                elements: 'results',//elementos del promise donde iterar
                                                showModel: true,//mostrar model y option
                                                pagination: {}//manejo de Paginado
                                            }
                                        },
                                        {
                                            type: 'text',
                                            model: 'date',
                                            label: Translate.translate('COM.FIELDS.DATE')
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
                                                url: EnvironmentConfig.site.rest.api
                                                + '/' + URLS.inventory.base
                                                + '/' + URLS.inventory.catalogues.base
                                                + '/' + URLS.inventory.catalogues.component_type,
                                                name: Translate.translate('COM.FIELDS.COMPONENT_TYPE'),
                                                model: 'com_code',
                                                option: 'descripcion',
                                                elements: 'results',//elementos del promise donde iterar
                                                showModel: true,//mostrar model y option
                                                pagination: {}//manejo de Paginado
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
                                                url: EnvironmentConfig.site.rest.api
                                                + '/' + URLS.inventory.base
                                                + '/' + URLS.inventory.catalogues.base
                                                + '/' + URLS.inventory.catalogues.consumable_category,
                                                name: Translate.translate('COM.FIELDS.ASSET_TYPE'),
                                                model: 'com_code',
                                                option: 'descripcion',
                                                elements: 'results',//elementos del promise donde iterar
                                                showModel: true,//mostrar model y option
                                                pagination: {}//manejo de Paginado
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
                                                url: EnvironmentConfig.site.rest.api
                                                + '/' + URLS.com.base
                                                + '/' + URLS.com.catalogues.base
                                                + '/' + URLS.com.catalogues.process_instructions,
                                                name: Translate.translate('COM.FIELDS.PROCESS_INSTRUCTION_CODE'),
                                                model: 'com_code',
                                                option: 'descripcion',
                                                elements: 'results',//elementos del promise donde iterar
                                                showModel: true,//mostrar model y option
                                                pagination: {}//manejo de Paginado
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
                                    required: false,
                                    catalog: {
                                        url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.technical_service.base
                                        + '/' + URLS.technical_service.catalogues.base
                                        + '/' + URLS.technical_service.catalogues.action,
                                        name: Translate.translate('COM.FIELDS.REPAIR_ACTION_CODE'),
                                        model: 'com_code',
                                        option: 'descripcion',
                                        elements: 'results',//elementos del promise donde iterar
                                        showModel: true,//mostrar model y option
                                        pagination: {}//manejo de Paginado
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
                                    required: false,
                                    catalog: {
                                        url: EnvironmentConfig.site.rest.api
                                        + '/' + URLS.technical_service.base
                                        + '/' + URLS.technical_service.catalogues.base
                                        + '/' + URLS.technical_service.catalogues.failure,
                                        name: Translate.translate('COM.FIELDS.FAULT_CODE'),
                                        model: 'com_code',
                                        option: 'nombre',
                                        elements: 'results',//elementos del promise donde iterar
                                        showModel: true,//mostrar model y option
                                        pagination: {}//manejo de Paginado
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
                                        option: "nombre_com",
                                        showModel: true,
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
            } else {
                vm.object.notifications.push({
                    notification_status_code: vm.notification_code.com_code,
                    notification_extra_notes: ''
                });
                //$log.log(vm.serviceDetails);
                vm.meta_incidences = {

                    fields: [
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
                                        option: "nombre_com",
                                        elements: vm.messageStatusCatalog,
                                        showModel: true
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
            vm.url = EnvironmentConfig.site.rest.api
                + '/' + COM.base
                + '/' + COM.actions.base
                + '/' + COM.actions.message.base
                + '/' + COM.actions.message.send;
            vm.actions = {
                PUT: {
                    id: 'identificador',
                    object: vm.object,
                    fields: vm.meta_incidences.fields,
                    dialog: {
                        title: Translate.translate('COM.ADDITIONAL_TEXTS.NOTIFICATION'),
                        okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                        cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                        loading: 'Guardando Acción'
                    },
                    url: vm.url
                }
            };


            $log.log(vm.actions);
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
                    element: vm.actions['PUT'].object,
                    url: vm.actions['PUT'].url
                }
            }).then(function () {
                ErrorHandler.successUpdate();
                vm.notification_code = undefined;
                vm.messageStatusCatalog = undefined;
                listTickets();

            }).catch(function (errorDelete) {
                if (errorDelete) {
                    ErrorHandler.errorTranslate(errorDelete);
                }
                vm.notification_code = undefined;
                vm.messageStatusCatalog = undefined;
                listTickets();
            });
        }

        function openDialogCreate(ticket, messageStatus) {
            $log.log(ticket);
            $log.log(messageStatus);
            var sendServiceDetails = messageStatus.asset;
            createMeta(sendServiceDetails);
        }


    }


})();
