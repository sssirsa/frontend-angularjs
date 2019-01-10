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
                url: '/proveedor',
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
                url: '/lineaTransporte',
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
                url: '/tipoTransporte',
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
                url: '/udn',
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
                url: '/sucursal',
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
                url: '/modelCabinet',
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
                url: '/marcaCabinet',
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
                url: '/proyectos',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/proyectos/proyectos.tmpl.html',
                controller: 'proyectosController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.clientes', {
                url: '/clientes',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/clientes/cliente.tmpl.html',
                controller: 'clienteController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.categoria', {
                url: '/categoria',
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
                url: '/catalogo-insumo',
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
                url: '/catalogo-tipo-equipo',
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
                url: '/catalogo-etapas',
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
                url: '/localidades',
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
                url: '/establecimientos',
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
                url: '/estados',
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
                url: '/municipios',
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
                url: '/catalogue/segmentation',
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
                url: '/catalogue/DEMO',
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
                url: '/catalogue/condicion',
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
                url: '/catalogue/status_unilever',
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
                url: '/catalogue/status_com',
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
                url: '/catalogue/sticker',
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
                url: '/catalogue/pediments',
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
                url: '/catalogue/categoria_insumo',
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
                url: '/catalogue/tipo_componente',
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
                url: '/catalogue/marca_insumo',
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
                url: '/catalogue/modelo_insumo',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/consumableModel/consumableModel.tmpl.html',
                controller: 'consumableModelController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.werehouse', {
                url: '/catalogue/werehouse',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/werehouse/werehouse.tmpl.html',
                controller: 'werehouseController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.position', {
                url: '/catalogue/position',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/position/position.tmpl.html',
                controller: 'positionController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.reason-not-capitalized', {
                url: '/catalogue/reason_not_labeled',
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
                url: '/catalogue/status_not_labeled',
                data: {
                    permissions: {
                        only: ['ADMINISTRADOR', 'TECNICO E']
                    }
                },
                templateUrl: 'app/mainApp/management/catalogues/statusNotLabeled/statusNotLabeled.tmpl.html',
                controller: 'statusNotLabeledController',
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
                        name: 'Entradas y Salidas',
                        type: 'dropdown',
                        children: [
                            {
                                name: 'MAIN.MENU.CATALOGS.UDN',
                                state: 'triangular.admin-default.udn-catalog',
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
                                name: 'MAIN.MENU.CATALOGS.TRANSPORT_LINE',
                                state: 'triangular.admin-default.linea-transporte',
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
                                name: 'MAIN.MENU.CATALOGS.STICKER',
                                state: 'triangular.admin-default.catalogue-sticker',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            }
                        ]
                    },
                    {
                        name: 'Inventario',
                        type: 'dropdown',
                        children:[
                            {
                                name: 'MAIN.MENU.CATALOGS.PROVIDER',
                                state: 'triangular.admin-default.proveedor',
                                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                                type: 'link'
                            },{
                                name: 'MAIN.MENU.CATALOGS.CONSUMABLE_CATEGORY',
                                state: 'triangular.admin-default.consumable-category',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.COMPONENT_TYPE',
                                state: 'triangular.admin-default.component-type',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
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
                            }
                        ]
                    },
                    {
                        name: 'Management',
                        type: 'dropdown',
                        children:[
                            {
                                name: 'MAIN.MENU.CATALOGS.STATUS_UNILEVER',
                                state: 'triangular.admin-default.catalogue-status-unilever',
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
                                name: 'MAIN.MENU.CATALOGS.EQUIPMENT_TYPE',
                                state: 'triangular.admin-default.catalogo-tipo-equipo',
                                permission: ['ADMINISTRADOR'],
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
                                name: 'MAIN.MENU.CATALOGS.SUBSIDIARY',
                                state: 'triangular.admin-default.sucursal',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.WEREHOUSE',
                                state: 'triangular.admin-default.werehouse',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CATEGORY',
                                state: 'triangular.admin-default.categoria',
                                permission: ['ADMINISTRADOR', 'CAPTURISTA'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.POSITION',
                                state: 'triangular.admin-default.position',
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
                                name: 'MAIN.MENU.CATALOGS.STATUS_NOT_LABELED',
                                state: 'triangular.admin-default.status-not-capitalized',
                                permission: ['ADMINISTRADOR', 'TECNICO E'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.CONDITION',
                                state: 'triangular.admin-default.catalogue-condicion',
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
                                name: 'MAIN.MENU.CATALOGS.CLIENT',
                                state: 'triangular.admin-default.clientes',
                                permission: ['ADMINISTRADOR'],
                                type: 'link'
                            },
                            {
                                name: 'MAIN.MENU.CATALOGS.STORES',
                                state: 'triangular.admin-default.catalogo-establecimientos',
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

