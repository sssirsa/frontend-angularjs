(function () {
    'use strict';

    angular
        .module('app.mainApp.inventory.assets')
        .controller('bulkAssetStageController', BulkAssetStageController);

    function BulkAssetStageController(
        URLS,
        Translate,
        EnvironmentConfig,
        PAGINATION
    ) {

        var vm = this;
        vm.url = EnvironmentConfig.site.rest.api
            + '/' + URLS.inventory.base
            + '/' + URLS.inventory.asset.base
            + '/' + URLS.inventory.asset.bulk_asset_stage;

        vm.name = Translate.translate('BULK_ASSET_STAGE.LABELS.TITLE');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        //vm.searchButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.SEARCH');
        vm.createButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.CREATE');
        vm.deleteButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.DELETE');
        //vm.modifyButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.MODIFY');
        vm.updateButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.UPDATE');
        vm.nextButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.NEXT');
        vm.previousButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.PREVIOUS');
        vm.loadMoreButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.LOAD_MORE');
        vm.removeFilterButtonText = Translate.translate('BULK_ASSET_STAGE.LABELS.REMOVE_FILTER');

        //Messages
        vm.loadingMessage = Translate.translate('BULK_ASSET_STAGE.LABELS.LOADING_MESSAGE');

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'cantidad',
                        label: 'Cantidad',
                        hint: 'Cantidad a utilizar del insumo',
                        required: true,
                        validations: {
                            regex: '([1-9]{1})\d*',
                            errors: {
                                regex: 'Cantidad debe estar entre 1 y 99',
                                required: 'La cantidad es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'catalogo_insumo_lote_id',
                        label: 'Insumo',
                        hint: 'Insumo a utilizar',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El insumo es obligatorio'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.inventory.base
                                + '/' + URLS.inventory.catalogues.base
                                + '/' + URLS.inventory.catalogues.bulk_asset,
                            model: 'id',
                            option: 'descripcion',
                            name: 'Insumo',
                            elements: 'results',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo_equipo_id',
                        label: 'Tipo de Equipo',
                        hint: 'Tipo de equipo en el que se usará el insumo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El tipo de insumo es obligatorio'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.management.base
                                + '/' + URLS.management.catalogues.base
                                + '/' + URLS.management.catalogues.equipment_type,
                            model: 'id',
                            option: 'descripcion',
                            name: 'Tipo de Equipo',
                            elements: 'results',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'catalogo_etapa_id',
                        label: 'Etapa',
                        hint: 'Etapa en la que se usará el insumo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'La etapa es obligatoria'
                            }
                        },
                        catalog: {
                            lazy: false,
                            url: EnvironmentConfig.site.rest.api
                                + '/' + URLS.technical_service.base
                                + '/' + URLS.technical_service.catalogues.base
                                + '/' + URLS.technical_service.catalogues.stage,
                            model: 'id',
                            option: 'nombre',
                            name: 'Etapa',
                            elements: 'results',
                            pagination: {
                                total: PAGINATION.total,
                                limit: PAGINATION.limit,
                                offset: PAGINATION.offset,
                                pageSize: PAGINATION.pageSize
                            },
                            softDelete: {
                                hide: 'deleted',
                                reverse: false
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('BULK_ASSET_STAGE.LABELS.CREATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET_STAGE.LABELS.CREATING')
                }
            },
            PATCH: {
                id: 'id',
                fields: [
                    {
                        type: 'text',
                        model: 'cantidad',
                        label: 'Cantidad',
                        required: true,
                        hint: 'Cantidad del insumo a usar',
                        validations: {
                            errors: {
                                required: 'La cantidad es requerida'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('BULK_ASSET_STAGE.LABELS.UPDATE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET_STAGE.LABELS.UPDATING')
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: Translate.translate('BULK_ASSET_STAGE.LABELS.DELETE'),
                    message: Translate.translate('BULK_ASSET_STAGE.LABELS.CONFIRM_DELETE'),
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: Translate.translate('BULK_ASSET_STAGE.LABELS.DELETING')
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {
                    total: PAGINATION.total,
                    limit: PAGINATION.limit,
                    offset: PAGINATION.offset,
                    pageSize: PAGINATION.pageSize
                },
                fields: [
                    {
                        type: 'text',
                        model: 'cantidad',
                        label: 'Cantidad a utilizar'
                    },
                    {
                        type: 'object_property',
                        model: 'catalogo_insumo_lote__descripcion',
                        label: 'Insumo'
                    },
                    {
                        type: 'object_property',
                        model: 'tipo_equipo__nombre',
                        label: 'Tipo de Equipo'
                    },
                    {
                        type: 'object_property',
                        model: 'catalogo_etapa__nombre',
                        label: 'Etapa'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        vm.onElementSelect = function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        };
    }

})();
