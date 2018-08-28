(function () {
    angular
        .module('app.mainApp')
        .controller('GenericCatalogueController', GenericCatalogController);

    function GenericCatalogController() {
        var vm = this;

        vm.url = 'estado';
        vm.kind = 'Mobile';
        vm.name = 'Catálogo de Estados';

        //Labels
        vm.name = 'Estado';
        vm.namePlural = 'Estados';
        vm.totalText = 'Elementos encontrados';

        //Button labels
        vm.searchButtonText = 'Buscar Estados';
        vm.createButtonText = 'Crear Estado';
        vm.deleteButtonText = 'Borrar Estado';
        vm.modifyButtonText = 'Editar Estado';
        vm.nextButtonText = 'Siguiente';
        vm.previousButtonText = 'Anterior';
        vm.loadMoreButtonText = 'Cargar mas estados';

        //Messages
        vm.loadingMessage = 'Cargando Estados';

        //Functions
        vm.onElementSelect = onElementSelect;

        //Actions meta
        vm.actions = {
            POST: {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: 'Nombre',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El nombre del estado es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'codigo_estado',
                        label: 'Código Estado',
                        required: true,
                        validations: {
                            regex: "[A-Z]{3,3}",
                            errors: {
                                regex: 'El código de estado deben ser 3 letras en MAYÚSCULAS',
                                required: 'El código de estado es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'fileUploader',
                        model: 'file',
                        fileUploader: {
                            filesSelected: function fileProcessing(files) {
                                let processedFiles = [];
                                angular.forEach(files, function (image) {
                                    var base64Image = null;
                                    var fileReader = new FileReader();
                                    fileReader.readAsDataURL(image);
                                    fileReader.onloadend = function () {
                                        base64Image = fileReader.result;
                                        processedFiles.push({ foto: base64Image });
                                    };
                                });
                                return processedFiles;
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'catalog_id',
                        label: 'Sub catálogo estados',
                        catalog: {
                            url: 'estado',
                            name: 'Estado',
                            kind: 'Mobile',
                            model: 'codigo_estado',
                            option: 'nombre',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        }
                    }
                ],
                dialog: {
                    title: 'Crear estado',
                    okButton: 'Guardar',
                    cancelButton: 'Cancelar',
                    loading: 'Creando estado'
                }
            },
            PUT: {
                fields: [],
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
                    title: 'Busqueda de estados',
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
            console.debug('Element selected');
            console.debug(element);
        }

    }

})();
