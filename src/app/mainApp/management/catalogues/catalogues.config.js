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
                // set the url of this page
                url: '/catalogo/proveedor',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/proveedor/proveedor.tmpl.html',
                // set the controller to load for this page
                controller: 'ProveedorController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.linea-transporte', {
                // set the url of this page
                url: '/catalogo/linea_transporte',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/lineaTransporte/lineaTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'LineaTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.tipo-transporte', {
                // set the url of this page
                url: '/catalogo/tipo_transporte',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/tipoTransporte/tipoTransporte.tmpl.html',
                // set the controller to load for this page
                controller: 'TipoTransporteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.udn-catalog', {
                // set the url of this page
                url: '/catalogo/udn',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/udn/udn.tmpl.html',
                // set the controller to load for this page
                controller: 'UDNController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.sucursal', {
                // set the url of this page
                url: '/catalogo/sucursal',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/sucursal/sucursal.tmpl.html',
                // set the controller to load for this page
                controller: 'SucursalController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.model-cabinet', {
                // set the url of this page
                url: '/catalogo/modelo_cabinet',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/modeloCabinet/modeloCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'ModeloCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.marca-cabinet', {
                // set the url of this page
                url: '/catalogo/marca_cabinet',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                // set the html template to show on this page
                templateUrl: 'app/mainApp/management/catalogues/marcaCabinet/marcaCabinet.tmpl.html',
                // set the controller to load for this page
                controller: 'MarcaCabinetController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.proyectos', {
                url: '/catalogo/proyectos',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/proyectos/proyectos.tmpl.html',
                controller: 'proyectosController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.categoria', {
                url: '/catalogo/categoria',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'CAPTURISTA']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/categoria/categoria.tmpl.html',
                controller: 'CategoriaController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-insumo', {
                url: '/catalogo/insumo',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/catalogo_insumo/catalogo_insumo.tmpl.html',
                controller: 'CatalogoInsumoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-tipo-equipo', {
                url: '/catalogo/tipo_equipo',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/tipoEquipo/tipoEquipo.tmpl.html',
                controller: 'TipoEquipoController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-etapas', {
                url: '/catalogo/etapas',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/etapas/etapas.tmpl.html',
                controller: 'EtapasController',
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
                controller: 'localitiesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogo-establecimientos', {
                url: '/catalogo/establecimientos',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/stores/stores.tmpl.html',
                controller: 'storesController',
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
                controller: 'statesController',
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
                controller: 'citiesController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-segmentation', {
                url: '/catalogo/segmentacion',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/segmentation/segmentation.tmpl.html',
                controller: 'segmentationController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.generic-catalogue', {
                url: '/catalogo/DEMO',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/DEMO/generic.tmpl.html',
                controller: 'GenericCatalogueController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-condicion', {
                url: '/catalogo/condicion',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/sticker/sticker.tmpl.html',
                controller: 'stickerController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.catalogue-pediment', {
                url: '/catalogo/pedimento',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/pediments/pediment.tmpl.html',
                controller: 'pedimentController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.consumable-category', {
                url: '/catalogo/categoria_insumo',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/warehouse/warehouse.tmpl.html',
                controller: 'warehouseController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.reason-not-capitalized', {
                url: '/catalogo/motivo_no_capitalizado',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/action/action.tmpl.html',
                controller: 'actionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.symptom', {
                url: '/catalogo/sintoma',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/symptom/symptom.tmpl.html',
                controller: 'symptomController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.failure-type', {
                url: '/catalogo/tipo_falla',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
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
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/comIncidence/comIncidence.tmpl.html',
                controller: 'comIncidenceController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu(
            {
                name: 'MAIN.MENU.CATALOGS.TITLE',
                icon: 'fa fa-book',
                type: 'dropdown',
                permission: ['ADMINISTRADOR', 'CAPTURISTA', 'TECNICO E'],
                priority: 3,
                children: [
                    // {
                    //     name: 'DEMO Generic Catalog',
                    //     state: 'triangular.admin-default.generic-catalogue',
                    //     permission: ['ADMINISTRADOR'],
                    //     type: 'link'
                    // },
                    //{
                    //    name: 'MAIN.MENU.CATALOGS.STAGE',
                    //    state: 'triangular.admin-default.catalogo-etapas',
                    //    permission: ['ADMINISTRADOR'],
                    //     type: 'link'
                    //},
                    //{
                    //    name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATALOG',
                    //    state: 'triangular.admin-default.catalogo-insumo',
                    //    permission: ['ADMINISTRADOR'],
                    //    type: 'link'
                    //},
                    // {
                    //     name: 'MAIN.MENU.CATALOGS.STATES',
                    //     state: 'triangular.admin-default.catalogo-estados',
                    //     permission: ['ADMINISTRADOR', 'TECNICO E'],
                    //     type: 'link'
                    // }, {
                    //     name: 'MAIN.MENU.CATALOGS.CITIES',
                    //     state: 'triangular.admin-default.catalogo-municipios',
                    //     permission: ['ADMINISTRADOR', 'TECNICO E'],
                    //     type: 'link'
                    // }, {
                    //     name: 'MAIN.MENU.CATALOGS.LOCALITIES',
                    //     state: 'triangular.admin-default.catalogo-localidades',
                    //     permission: ['ADMINISTRADOR', 'TECNICO E'],
                    //     type: 'link'
                    // },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.ENTRIES_DEPARTURES',
                        type: 'dropdown',
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.TRANSPORT_LINE',
                                state: 'triangular.admin-default.linea-transporte',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.PEDIMENT',
                                state: 'triangular.admin-default.catalogue-pediment',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.PROJECTS',
                                state: 'triangular.admin-default.proyectos',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.TRANSPORT_TYPE',
                                state: 'triangular.admin-default.tipo-transporte',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.UDN',
                                state: 'triangular.admin-default.udn-catalog',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.INVENTORY',
                        type: 'dropdown',
                        children:[
                            {
                                name: 'MAIN.MENU.CATALOGS.WEREHOUSE',
                                state: 'triangular.admin-default.warehouse',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATEGORY',
                                state: 'triangular.admin-default.consumable-category',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CABINET_BRAND',
                                state: 'triangular.admin-default.marca-cabinet',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CABINET_MODEL',
                                state: 'triangular.admin-default.model-cabinet',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_BRAND',
                                state: 'triangular.admin-default.consumable-brand',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_MODEL',
                                state: 'triangular.admin-default.consumable-model',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.PROVIDER',
                                state: 'triangular.admin-default.proveedor',
                                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.COMPONENT_TYPE',
                                state: 'triangular.admin-default.component-type',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.EQUIPMENT_TYPE',
                                state: 'triangular.admin-default.catalogo-tipo-equipo',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.MANAGEMENT',
                        type: 'dropdown',
                        children:[
                            {
                                name: 'MAIN.MENU.CATALOGS.CATEGORY',
                                state: 'triangular.admin-default.categoria',
                                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONDITION',
                                state: 'triangular.admin-default.catalogue-condicion',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_COM',
                                state: 'triangular.admin-default.catalogue-status-com',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_NOT_LABELED',
                                state: 'triangular.admin-default.status-not-capitalized',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_UNILEVER',
                                state: 'triangular.admin-default.catalogue-status-unilever',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.REASON_NOT_LABELED',
                                state: 'triangular.admin-default.reason-not-capitalized',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SUBSIDIARY',
                                state: 'triangular.admin-default.sucursal',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'MAIN.MENU.CATALOGS.LABELS.TECHNICAL_SERVICE',
                        type: 'dropdown',
                        children:[
                            {
                                name: 'MAIN.MENU.CATALOGS.ACTION',
                                state: 'triangular.admin-default.action',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.FAILURE_TYPE',
                                state: 'triangular.admin-default.failure-type',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STORES',
                                state: 'triangular.admin-default.catalogo-establecimientos',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.COM_INCIDENCE',
                                state: 'triangular.admin-default.com-incidence',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SEGMENTATION',
                                state: 'triangular.admin-default.catalogue-segmentation',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.SYMPTOM',
                                state: 'triangular.admin-default.symptom',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.NEXT_STEP',
                                state: 'triangular.admin-default.next-step',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STICKER',
                                state: 'triangular.admin-default.catalogue-sticker',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            }
                        ]
                    }
                ]
            }
        );

    }
})();

