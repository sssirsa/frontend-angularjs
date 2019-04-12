(function () {
    angular
        .module('app.mainApp')
        .controller('GenericCatalogueController', GenericCatalogController);

    function GenericCatalogController(URLS, EnvironmentConfig) {
        var vm = this;

        vm.url = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.cabinet_brand);
        vm.name = 'Catálogo de DEMO';

        const brandUrl = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.management.base + '/' + URLS.management.catalogues.base + '/' + URLS.management.catalogues.cabinet_brand);

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estados';
        vm.createButtonText = 'Crear';
        vm.deleteButtonText = 'Borrar';
        vm.modifyButtonText = 'Editar';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando elementos';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Marca cabinet',
                        required: true
                    },
                    {
                        type: 'object_property',
                        model: 'test_object',
                        label: 'Test Object',
                        fields: [
                            {
                                type: 'catalog_array',
                                model: 'marcas_array',
                                label: 'Marca cabinet',
                                required: true,
                                catalog: {
                                    lazy: false,
                                    url: brandUrl,
                                    kind: 'management',
                                    model: 'id',
                                    option: 'nombre',
                                    name: 'Marca',
                                    elements: 'results',
                                    pagination: {
                                        total: 'count'
                                    }
                                },
                                softDelete: {
                                    hide: 'deleted',
                                    reverse: false
                                }
                            },
                            {
                                type: 'text',
                                model: 'modelo',
                                label: 'Modelo cabinet',
                                required: true
                            }
                        ]
                    },
                    {
                        type: 'array_object',
                        model: 'service_details',
                        label: 'Detalle del servicio',
                        fields: [
                            {
                                type: 'text',
                                model: 'service_task_type',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'asset_type_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'quantity',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'asset_global_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'serial_number',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'bar_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_category_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_description',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_variant_code',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'product_variant_description',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'brand_hierarchy_code',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'brand_hierarchy',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'asset_condition',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_height_front',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_height',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_width',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_length',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'weight',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'measure_unit',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'weight_unit',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'owner_ship',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_number',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_signatory',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_date_of_signature',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'documentation_link',
                                label: ''
                            }
                        ]
                    },
                    //{
                    //    type: 'fileUploader',
                    //    model: 'file',
                    //    fileUploader: {
                    //        filesSelected: function fileProcessing(files) {
                    //            let processedFiles = [];
                    //            angular.forEach(files, function (image) {
                    //                var base64Image = null;
                    //                var fileReader = new FileReader();
                    //                fileReader.readAsDataURL(image);
                    //                fileReader.onloadend = function () {
                    //                    base64Image = fileReader.result;
                    //                    processedFiles.push({ foto: base64Image });
                    //                };
                    //            });
                    //            return processedFiles;
                    //        }
                    //    }
                    //},
                    //{
                    //    type: 'catalog',
                    //    model: 'catalog_id',
                    //    label: 'Sub catálogo estados',
                    //    catalog: {
                    //        url: 'estado',
                    //        name: 'Estado',
                    //        kind: 'Mobile',
                    //        model: 'codigo_estado',
                    //        option: 'nombre',
                    //        loadMoreButtonText: 'Cargar mas...'
                    //    },
                    //    pagination: {
                    //        total: 'count'
                    //    },
                    //    elements: 'results',
                    //    softDelete: {
                    //        hide: 'deleted',
                    //        reverse: false
                    //    }
                    //}
                ],
                dialog: {
                    title: 'Crear estado',
                    okButton: 'Guardar',
                    cancelButton: 'Cancelar',
                    loading: 'Creando estado'
                }
            },
            PUT: {
                fields: [
                    {
                        type: 'array_object',
                        model: 'service_details',
                        label: 'Detalle del servicio',
                        fields: [
                            {
                                type: 'text',
                                model: 'service_task_type',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'asset_type_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'quantity',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'asset_global_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'serial_number',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'bar_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_category_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_code',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_description',
                                label: '',
                                required: true
                            },
                            {
                                type: 'text',
                                model: 'product_variant_code',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'product_variant_description',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'brand_hierarchy_code',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'brand_hierarchy',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'asset_condition',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_height_front',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_height',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_width',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'external_length',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'weight',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'measure_unit',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'weight_unit',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'owner_ship',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_number',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_signatory',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'contract_date_of_signature',
                                label: ''
                            },
                            {
                                type: 'text',
                                model: 'documentation_link',
                                label: ''
                            },
                            {
                                type: 'array_object',
                                model: 'service_dates',
                                label: '',
                                fields: [
                                    {
                                        type: 'catalog',
                                        model: 'date_type',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'date',
                                        label: ''
                                    }
                                ]
                            },
                            {
                                type: 'array_object',
                                model: 'asset_components',
                                label: '',
                                fields: [
                                    {
                                        type: 'catalog',
                                        model: 'component_type',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'component',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'sku',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'serial_number',
                                        label: ''
                                    }
                                ]
                            },
                            {
                                type: 'array_object',
                                model: 'asset_addons',
                                label: '',
                                fields: [
                                    {
                                        type: 'text',
                                        model: 'mandatory',
                                        label: ''
                                    },
                                    {
                                        type: 'catalog',
                                        model: 'asset_type',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'quantity',
                                        label: ''
                                    },
                                    {
                                        type: 'catalog',
                                        model: 'product_category_code',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'product_code',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'product_description',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'product_variant_code',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'product_variant_description',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'external_height_front',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'external_height',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'external_width',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'external_length',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'measure_unit',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'weight',
                                        label: ''
                                    },
                                    {
                                        type: 'text',
                                        model: 'weight_unit',
                                        label: ''
                                    }
                                ]
                            },
                            {
                                type: 'array_object',
                                model: 'process_instructions',
                                label: '',
                                fields: [
                                    {
                                        type: 'catalog',
                                        model: 'process_instruction_code',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'process_instruction_value',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'process_instruction_extra_notes',
                                        label: 'Notas'
                                    }
                                ]
                            },
                            {
                                type: 'array_object',
                                model: 'asset_locations',
                                label: '',
                                fields: [
                                    {
                                        type: 'text',
                                        model: 'qualifier',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'location_global_code',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'location_external_code',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'catalog',
                                        model: 'location_type',
                                        label: '',
                                        required: true,
                                        catalog: {
                                            url: '',
                                            name: '',
                                            model: '',
                                            option: ''
                                        }
                                    },
                                    {
                                        type: 'text',
                                        model: 'location_name',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'location_short_name',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'legal_code',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'primary_contact',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'primary_contact_business',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'primary_contact_mobile_phone',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'primary_contact_email',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'text',
                                        model: 'process_instructions',
                                        label: 'Notas'
                                    },
                                    {
                                        type: 'array_object',
                                        model: 'addresses',
                                        label: '',
                                        fields: [
                                            {
                                                type: 'catalog',
                                                model: 'address_type',
                                                label: '',
                                                required: true,
                                                catalog: {
                                                    url: '',
                                                    name: 'Código de notificación',
                                                    model: '',
                                                    option: ''
                                                }
                                            },
                                            {
                                                type: 'text',
                                                model: 'street_name',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'zip_postal_code',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'city',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'address_number',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'gpslat',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'gpslong',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_main_phone',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_phone_number',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_mobile_number',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_fax',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_email',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_alternate_area_code',
                                                label: ''
                                            },
                                            {
                                                type: 'text',
                                                model: 'location_alternate_phone',
                                                label: ''
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'array_object',
                        model: 'repairs',
                        label: 'Reparaciones',
                        fields: [
                            {
                                type: 'catalog',
                                model: 'repair_action_code',
                                label: 'Código de reparación',
                                required: true,
                                catalog: {
                                    url: '',
                                    name: 'Código de reparación',
                                    model: '',
                                    option: ''
                                }
                            },
                            {
                                type: 'text',
                                model: 'repair_action_notes',
                                label: 'Notas'
                            }
                        ]
                    },
                    {
                        type: 'array_object',
                        model: 'faults',
                        label: 'Fallas',
                        fields: [
                            {
                                type: 'catalog',
                                model: 'fault_code',
                                label: 'Código de falla',
                                required: true,
                                catalog: {
                                    url: '',
                                    name: 'Código de falla',
                                    model: '',
                                    option: ''
                                }
                            },
                            {
                                type: 'text',
                                model: 'fault_notes',
                                label: 'Notas'
                            }
                        ]
                    },
                    {
                        type: 'array_object',
                        model: 'notifications',
                        label: 'Notificaciones',
                        fields: [
                            {
                                type: 'catalog',
                                model: 'notification_status_code',
                                label: 'Código de notificación',
                                required: true,
                                catalog: {
                                    url: '',
                                    name: 'Código de notificación',
                                    model: '',
                                    option: ''
                                }
                            },
                            {
                                type: 'text',
                                model: 'notification_extra_notes',
                                label: 'Notas'
                            }
                        ]
                    }
                ],
                dialog: {
                    title: 'Editar estado',
                    okButton: 'Guardar',
                    cancelButton: 'Cancelar',
                    loading: 'Guardando estado'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar estado',
                    message: 'Confirme la eliminación del estado',
                    okButton: 'Aceptar',
                    cancelButton: 'Cancelar',
                    loading: 'Eliminando estado'
                }
            },
            LIST: {
                elements: 'results',
                mode: 'infinite',
                pagination: {
                    total: 'count'
                },
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre'
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Código Estado'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de estados',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando estados'
                },
                filters: [
                    {
                        type: 'istartswith',
                        model: 'nombre',
                        header: 'por Nombre',
                        label: 'Nombre',
                        field: {
                            type: 'text'
                        }
                    },
                    {
                        type: 'equals',
                        model: 'codigo_estado',
                        header: 'por Código de Estado',
                        label: 'Código de Estado',
                        field: {
                            type: 'text'
                        }
                    }
                ]
            }
        }

        function onElementSelect(element) {
            //Here goes the handling for element selection, such as detail page navigation
            console.debug('Element selected');
            console.debug(element);
        }

    }

})();
