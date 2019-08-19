(function () {
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .config(cataloguesConfig);

    /* @ngInject */
    function cataloguesConfig($stateProvider, $translatePartialLoaderProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/mainApp/management/catalogues');
        $stateProvider
            .state('triangular.admin-default.proveedor', {
                url: '/catalogo/proveedor',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__proveedor']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/proveedor/proveedor.tmpl.html',
                controller: 'ProveedorController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.linea-transporte', {
                url: '/catalogo/linea_transporte',
                data: {
                    permissions: {
                        only: ['entries_departures__catalogues__transport_line']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/lineaTransporte/lineaTransporte.tmpl.html',
                controller: 'LineaTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.tipo-transporte', {
                url: '/catalogo/tipo_transporte',
                data: {
                    permissions: {
                        only: ['entries_departures__catalogues__transport_type']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/tipoTransporte/tipoTransporte.tmpl.html',
                controller: 'TipoTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.udn-catalog', {
                url: '/catalogo/udn',
                data: {
                    permissions: {
                        only: ['management__catalogues__udn']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/udn/udn.tmpl.html',
                controller: 'UDNController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.sucursal', {
                url: '/catalogo/sucursal',
                data: {
                    permissions: {
                        only: ['management__catalogues__subsidiary']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/sucursal/sucursal.tmpl.html',
                controller: 'SucursalController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.model-cabinet', {
                url: '/catalogo/modelo_cabinet',
                data: {
                    permissions: {
                        only: ['management__catalogues__modelo_cabinet']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/modeloCabinet/modeloCabinet.tmpl.html',
                controller: 'ModeloCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.marca-cabinet', {
                url: '/catalogo/marca_cabinet',
                data: {
                    permissions: {
                        only: ['management__catalogues__marca_cabinet']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/marcaCabinet/marcaCabinet.tmpl.html',
                controller: 'MarcaCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.categoria', {
                url: '/catalogo/categoria',
                data: {
                    permissions: {
                        only: ['management__catalogues__category']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/categoria/categoria.tmpl.html',
                controller: 'CategoriaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-tipo-equipo', {
                url: '/catalogo/tipo_equipo',
                data: {
                    permissions: {
                        only: ['management__catalogues__device_kind']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/tipoEquipo/tipoEquipo.tmpl.html',
                controller: 'TipoEquipoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-localidades', {
                url: '/catalogo/localidades',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/localities/localities.tmpl.html',
                controller: 'LocalitiesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-establecimientos', {
                url: '/catalogo/establecimientos',
                data: {
                    permissions: {
                        only: ['salepoint__catalogues__establecimientos']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/stores/stores.tmpl.html',
                controller: 'StoresController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-estados', {
                url: '/catalogo/estados',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/states/states.tmpl.html',
                controller: 'StatesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-municipios', {
                url: '/catalogo/municipios',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/cities/cities.tmpl.html',
                controller: 'CitiesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-segmentation', {
                url: '/catalogo/segmentacion',
                data: {
                    permissions: {
                        only: ['salepoint__catalogues__segmentacion']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/segmentation/segmentation.tmpl.html',
                controller: 'SegmentationController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-condicion', {
                url: '/catalogo/condicion',
                data: {
                    permissions: {
                        only: ['management__catalogues__condition']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/condicion/condicion.tmpl.html',
                controller: 'CondicionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-status-unilever', {
                url: '/catalogo/estatus_unilever',
                data: {
                    permissions: {
                        only: ['management__catalogues__unilever_status']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/estatusUnilever/estatusUnilever.tmpl.html',
                controller: 'estatusUnileverController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-status-com', {
                url: '/catalogo/estatus_com',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/estatusCom/estatusCom.tmpl.html',
                controller: 'estatusComController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-sticker', {
                url: '/catalogo/etiqueta',
                data: {
                    permissions: {
                        only: ['entries_departures__catalogues__sticker']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/sticker/sticker.tmpl.html',
                controller: 'StickerController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.consumable-category', {
                url: '/catalogo/categoria_insumo',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__categoria_insumo']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/consumableCategory/consumableCategory.tmpl.html',
                controller: 'consumableCategoryController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.component-type', {
                url: '/catalogo/tipo_componente',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__tipo_componente']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/componentType/componentType.tmpl.html',
                controller: 'componentTypeController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.consumable-brand', {
                url: '/catalogo/marca_insumo',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__marca_insumo']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/consumableBrand/consumableBrand.tmpl.html',
                controller: 'consumableBrandController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.consumable-model', {
                url: '/catalogo/modelo_insumo',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__modelo_insumo']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/consumableModel/consumableModel.tmpl.html',
                controller: 'consumableModelController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.warehouse', {
                url: '/catalogo/bodega',
                data: {
                    permissions: {
                        only: ['management__catalogues__warehouse']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/warehouse/warehouse.tmpl.html',
                controller: 'WarehouseController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.reason-not-capitalized', {
                url: '/catalogo/motivo_no_capitalizado',
                data: {
                    permissions: {
                        only: ['management__catalogues__reason_no_labeled']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/reasonNotLabeled/reasonNotLabeled.tmpl.html',
                controller: 'reasonNotLabeledController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.status-not-capitalized', {
                url: '/catalogo/estatus_no_capitalizado',
                data: {
                    permissions: {
                        only: ['management__catalogues__status_no_labeled']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/statusNotLabeled/statusNotLabeled.tmpl.html',
                controller: 'statusNotLabeledController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.action', {
                url: '/catalogo/accion',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__action']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/action/action.tmpl.html',
                controller: 'ActionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.symptom', {
                url: '/catalogo/sintoma',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__symptom']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/symptom/symptom.tmpl.html',
                controller: 'SymptomController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.failure-type', {
                url: '/catalogo/tipo_falla',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__failure_kind']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/failureType/failureType.tmpl.html',
                controller: 'failureTypeController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.next-step', {
                url: '/catalogo/siguiente_paso',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__next_step']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/nextStep/nextStep.tmpl.html',
                controller: 'nextStepController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.com-incidence', {
                url: '/catalogo/incidencia_com',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__com_incidence']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/comIncidence/comIncidence.tmpl.html',
                controller: 'comIncidenceController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.impediment-reason', {
                url: '/catalogo/motivo_impedimento_salida',
                data: {
                    permissions: {
                        only: ['management__catalogues__reason_impeded']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/impediment/impedimentReason.tmpl.html',
                controller: 'impedimentReasonController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.failures', {
                url: '/catalogo/falla',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__diagnose_failure']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/failure/failure.tmpl.html',
                controller: 'failureCatalogController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.stages', {
                url: '/catalogo/etapas',
                data: {
                    permissions: {
                        only: ['technical_services__catalogues__stage']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/stages/stages.tmpl.html',
                controller: 'StagesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.bulk-asset', {
                url: '/catalogo/insumo_lote',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__bulk_asset']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/bulk_asset/bulk_asset.tmpl.html',
                controller: 'bulkAssetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.unique-asset', {
                url: '/catalogo/insumo_unico',
                data: {
                    permissions: {
                        only: ['inventory__catalogues__unique_asset']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/unique_asset/unique_asset.tmpl.html',
                controller: 'uniqueAssetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.permission-templates', {
                url: '/catalogo/plantillas_permisos',
                data: {
                    permissions: {
                        only: ['management__manage_system__persona']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/templates/templates.tmpl.html',
                controller: 'TemplatesController',
                controllerAs: 'vm'
            });


        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.CATALOGS.TITLE',
                icon: 'fa fa-book',
                type: 'dropdown',
                permission: [
                    //Entries Departures
                    'entries_departures__catalogues__transport_line',
                    'entries_departures__catalogues__transport_type',
                    //Inventory
                    'inventory__catalogues__bulk_asset',
                    'inventory__catalogues__categoria_insumo',
                    'management__catalogues__device_kind',
                    'management__catalogues__marca_cabinet',
                    'inventory__catalogues__marca_insumo',
                    'management__catalogues__modelo_cabinet',
                    'inventory__catalogues__modelo_insumo',
                    'inventory__catalogues__proveedor',
                    'inventory__catalogues__tipo_componente',
                    'inventory__catalogues__unique_asset',
                    'management__catalogues__warehouse',
                    //Management
                    'management__catalogues__category',
                    'management__catalogues__condition',
                    'management__catalogues__reason_impeded',
                    'management__catalogues__reason_no_labeled',
                    'management__catalogues__status_no_labeled',
                    'management__catalogues__unilever_status',
                    'management__catalogues__subsidiary',
                    'management__catalogues__udn',
                    //Salepoint
                    //Technical service
                    'technical_services__catalogues__action',
                    'technical_services__catalogues__com_incidence',
                    'technical_services__catalogues__diagnose_failure',
                    'technical_services__catalogues__failure_kind',
                    'technical_services__catalogues__next_step',
                    'technical_services__catalogues__stage',
                    'entries_departures__catalogues__sticker',
                    'technical_services__catalogues__symptom'
                ],
                priority: 3,
                children: [
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.ENTRIES_DEPARTURES',
                        type: 'dropdown',
                        permission: [
                            'entries_departures__catalogues__transport_line',
                            'entries_departures__catalogues__transport_type'
                        ],
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.TRANSPORT_LINE',
                                state: 'triangular.admin-default.linea-transporte',
                                permission: ['entries_departures__catalogues__transport_line'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.TRANSPORT_TYPE',
                                state: 'triangular.admin-default.tipo-transporte',
                                permission: ['entries_departures__catalogues__transport_type'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.INVENTORY',
                        type: 'dropdown',
                        permission: [
                            'inventory__catalogues__bulk_asset',
                            'inventory__catalogues__categoria_insumo',
                            'management__catalogues__device_kind',
                            'management__catalogues__marca_cabinet',
                            'inventory__catalogues__marca_insumo',
                            'management__catalogues__modelo_cabinet',
                            'inventory__catalogues__modelo_insumo',
                            'inventory__catalogues__proveedor',
                            'inventory__catalogues__tipo_componente',
                            'inventory__catalogues__unique_asset',
                            'management__catalogues__warehouse'
                        ],
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.WEREHOUSE',
                                state: 'triangular.admin-default.warehouse',
                                permission: ['management__catalogues__warehouse'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATEGORY',
                                state: 'triangular.admin-default.consumable-category',
                                permission: ['inventory__catalogues__categoria_insumo'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.BULK_ASSET',
                                state: 'triangular.admin-default.bulk-asset',
                                permission: ['inventory__catalogues__bulk_asset'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.UNIQUE_ASSET',
                                state: 'triangular.admin-default.unique-asset',
                                permission: ['inventory__catalogues__unique_asset'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CABINET_BRAND',
                                state: 'triangular.admin-default.marca-cabinet',
                                permission: ['management__catalogues__marca_cabinet'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CABINET_MODEL',
                                state: 'triangular.admin-default.model-cabinet',
                                permission: ['management__catalogues__modelo_cabinet'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_BRAND',
                                state: 'triangular.admin-default.consumable-brand',
                                permission: ['inventory__catalogues__marca_insumo'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_MODEL',
                                state: 'triangular.admin-default.consumable-model',
                                permission: ['inventory__catalogues__modelo_insumo'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.PROVIDER',
                                state: 'triangular.admin-default.proveedor',
                                permission: ['inventory__catalogues__proveedor'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.COMPONENT_TYPE',
                                state: 'triangular.admin-default.component-type',
                                permission: ['inventory__catalogues__tipo_componente'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.EQUIPMENT_TYPE',
                                state: 'triangular.admin-default.catalogo-tipo-equipo',
                                permission: ['management__catalogues__device_kind'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.MANAGEMENT',
                        type: 'dropdown',
                        permission: [
                            'management__catalogues__category',
                            'management__catalogues__condition',
                            'management__manage_system__persona',
                            'management__catalogues__reason_impeded',
                            'management__catalogues__reason_no_labeled',
                            'management__catalogues__status_no_labeled',
                            'management__catalogues__unilever_status',
                            'management__catalogues__subsidiary',
                            'management__catalogues__udn'
                        ],
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.CATEGORY',
                                state: 'triangular.admin-default.categoria',
                                permission: ['management__catalogues__category'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONDITION',
                                state: 'triangular.admin-default.catalogue-condicion',
                                permission: ['management__catalogues__condition'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_COM',
                                state: 'triangular.admin-default.catalogue-status-com',
                                permission: ['com__catalogues__status'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_NOT_LABELED',
                                state: 'triangular.admin-default.status-not-capitalized',
                                permission: ['management__catalogues__status_no_labeled'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_UNILEVER',
                                state: 'triangular.admin-default.catalogue-status-unilever',
                                permission: ['management__catalogues__unilever_status'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.IMPEDIMENT_REASON',
                                state: 'triangular.admin-default.impediment-reason',
                                permission: ['management__catalogues__reason_impeded'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.REASON_NOT_LABELED',
                                state: 'triangular.admin-default.reason-not-capitalized',
                                permission: ['management__catalogues__reason_no_labeled'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.MANAGEMENT.TEMPLATES.TITLE',
                                state: 'triangular.admin-default.permission-templates',
                                permission: ['management__manage_system__persona'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SUBSIDIARY',
                                state: 'triangular.admin-default.sucursal',
                                permission: ['management__catalogues__subsidiary'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.UDN',
                                state: 'triangular.admin-default.udn-catalog',
                                permission: ['management__catalogues__udn'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.SALE_POINT',
                        type: 'dropdown',
                        permission: ['salepoint__catalogues__establecimiento', 'salepoint__catalogues__segmentacion'],
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.STORES',
                                state: 'triangular.admin-default.catalogo-establecimientos',
                                permission: ['salepoint__catalogues__establecimiento'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SEGMENTATION',
                                state: 'triangular.admin-default.catalogue-segmentation',
                                permission: ['salepoint__catalogues__segmentacion'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.TECHNICAL_SERVICE',
                        type: 'dropdown',
                        permission: [
                            'technical_services__catalogues__action',
                            'technical_services__catalogues__com_incidence',
                            'technical_services__catalogues__diagnose_failure',
                            'technical_services__catalogues__failure_kind',
                            'technical_services__catalogues__next_step',
                            'technical_services__catalogues__stage',
                            'entries_departures__catalogues__sticker',
                            'technical_services__catalogues__symptom'
                        ],
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.ACTION',
                                state: 'triangular.admin-default.action',
                                permission: ['technical_services__catalogues__action'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.FAILURE_TYPE',
                                state: 'triangular.admin-default.failure-type',
                                permission: ['technical_services__catalogues__failure_kind'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STAGES',
                                state: 'triangular.admin-default.stages',
                                permission: ['technical_services__catalogues__stage'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.FAILURE',
                                state: 'triangular.admin-default.failures',
                                permission: ['technical_services__catalogues__diagnose_failure'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.COM_INCIDENCE',
                                state: 'triangular.admin-default.com-incidence',
                                permission: ['technical_services__catalogues__com_incidence'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SYMPTOM',
                                state: 'triangular.admin-default.symptom',
                                permission: ['technical_services__catalogues__symptom'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.NEXT_STEP',
                                state: 'triangular.admin-default.next-step',
                                permission: ['technical_services__catalogues__next_step'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STICKER',
                                state: 'triangular.admin-default.catalogue-sticker',
                                permission: ['entries_departures__catalogues__sticker'],
                                type: 'link'
                            }
                        ]
                    }
                ]
            }
        );

    }
})();

