(function()
{
    'use strict';

    angular
        .module('app.mainApp.management.catalogues')
        .controller('ProveedorController',ProveedorController);

    function ProveedorController(URLS, Translate, EnvironmentConfig) {
        var vm = this;

        var inventoryUrl =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.inventory.base + '/' + URLS.inventory.catalogues.base + '/' + URLS.inventory.catalogues.supplier);

        vm.url = inventoryUrl;
        vm.kind = 'inventory';
        vm.name = Translate.translate('Provider.title');

        //Labels
        vm.totalText = 'Total de elementos';
        vm.totalFilteredText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Proveedor';
        vm.createButtonText = 'Crear Proveedor';
        vm.deleteButtonText = 'Borrar Proveedor';
        vm.modifyButtonText = 'Editar Proveedor';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas Proveedores';
        vm.removeFilterButtonText = 'Quitar filtro';

        //Messages
        vm.loadingMessage = 'Cargando Proveedores';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'razon_social',
                        label: 'Razon social',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'rfc',
                        label: 'RFC',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'tel',
                        model: 'telefono',
                        label: 'Telefono',
                        required: true,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,10}",
                            errors: {
                                regex: 'El número no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'contacto',
                        label: 'Contacto',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'email',
                        model: 'correo_electronico',
                        label: 'Correo electronico',
                        required: true,
                        validations:{
                            regex: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$',
                            errors:{
                                regex: 'El correo no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'comentarios',
                        label: 'Comentarios',
                        required: true,
                        validations:{
                            errors:{
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Crear Proveedor',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Creando Proveedor'
                }
            },
            PUT: {
                id:'id',
                fields: [
                    {
                        type: 'text',
                        model: 'razon_social',
                        label: 'Razon social',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'rfc',
                        label: 'RFC',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'tel',
                        model: 'telefono',
                        label: 'Telefono',
                        required: true,
                        validations: {
                            max: 10,
                            regex: "[0-9]{7,10}",
                            errors: {
                                regex: 'El número no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'contacto',
                        label: 'Contacto',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'email',
                        model: 'correo_electronico',
                        label: 'Correo electronico',
                        required: true,
                        validations: {
                            regex: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$',
                            errors: {
                                regex: 'El correo no tiene un formato correcto',
                                required: 'El campo es requerido.'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'comentarios',
                        label: 'Comentarios',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El campo es requerido.'
                            }
                        }
                    }
                ],
                dialog: {
                    title: 'Editar Proveedor',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Guardando Proveedor'
                }
            },
            DELETE: {
                id: 'id',
                dialog: {
                    title: 'Eliminar Proveedor',
                    message: 'Confirme la eliminación de Proveedor',
                    okButton: Translate.translate('MAIN.BUTTONS.ACCEPT'),
                    cancelButton: Translate.translate('MAIN.BUTTONS.CANCEL'),
                    loading: 'Eliminando Proveedor'
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
                        model: 'razon_social',
                        label: 'Razon social'
                    },
                    {
                        type: 'text',
                        model: 'direccion',
                        label: 'Direccion'
                    },
                    {
                        type: 'text',
                        model: 'rfc',
                        label: 'RFC'
                    },
                    {
                        type: 'text',
                        model: 'telefono',
                        label: 'Telefono',
                        nullOrEmpty:'Sin teléfono'
                    },
                    {
                        type: 'text',
                        model: 'contacto',
                        label: 'Contacto'
                    },
                    {
                        type: 'email',
                        model: 'correo_electronico',
                        label: 'Correo electronico'
                    },
                    {
                        type: 'text',
                        model: 'comentarios',
                        label: 'Comentarios'
                    }
                ],
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            SEARCH: {
                dialog: {
                    title: 'Búsqueda de Proveedor',
                    searchButton: 'Buscar',
                    loadingText: 'Buscando Proveedor'
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
                    }
                ]
            }
        };

        function onElementSelect() {
            //Here goes the handling for element selection, such as detail page navigation
        }
    }

})();
