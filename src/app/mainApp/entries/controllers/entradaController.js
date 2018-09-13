/**
 * Created by Emmanuel on 29/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.entries')
        .controller('entradaController', entradaController);

    function entradaController(
        EntradaSalida,
        toastr,
        $mdDialog,
        CabinetEntradaSalida,
        Translate,
        $scope,
        Cabinet,
        Persona,
        OPTIONS,
        URLS,
        CATALOG,
        ErrorHandler
    ) {

        //Variable definition
        var vm = this;
        vm.isGarantia = false;
        vm.isPedimento = false;
        vm.searchText = "";
        vm.isValid = false;
        vm.selectedTab = 0;
        vm.idEntrada = null;
        vm.sucursal = null;
        vm.ife_chofer = null;
        vm.multipleInput = false;

        vm.options = OPTIONS.input_types;
        vm.selectedEntrada = null;

        vm.catalogues = {
            sucursal: {
                catalog: {
                    url: URLS.sucursal,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Subsidiary'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'nombre'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            linea_transporte: {
                catalog: {
                    url: URLS.linea_transporte,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Transport.Line'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'razon_social'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            tipo_transporte: {
                catalog: {
                    url: URLS.tipo_transporte,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Transport.Kind'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            udn: {
                catalog: {
                    url: URLS.udn,
                    kind: 'Web',
                    name: Translate.translate('INPUT.UDN'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'agencia'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            },
            proyecto: {
                catalog: {
                    url: URLS.proyecto,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Project'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                }
            }
        };

        //Function parsing
        vm.guardar = guardar;
        vm.limpiar = limpiar;
        vm.selectionFile = selectionFile;
        vm.selectionImage = selectionImage;
        vm.showMassiveUpload = showMassiveUpload;
        vm.showManualUpload = showManualUpload;
        vm.removeImage = removeImage;
        vm.nextTab = nextTab;
        vm.uploadFile = uploadFile;
        vm.showMarcaDialog = showMarcaDialog;
        vm.showModeloDialog = showModeloDialog;
        vm.showCabinetDialog = showCabinetDialog;
        vm.addCabinet = addCabinet;
        vm.removeNotFoundCabinet = removeNotFoundCabinet;
        vm.removeCabinet = removeCabinet;
        vm.onElementSelect = onElementSelect;

        //Visualizations
        vm.hideMassiveUpload = true;
        vm.hideManualUpload = true;
        vm.inputWasCorrect = false;


        vm.responseMassiveUpload = {
            "id": "",
            "creados": [],
            "no_creados": [],
            "modelos_no_existentes": []

        };

        var entrada = {
            "id": null,
            "fecha": "",
            "nombre_chofer": "",
            "ife_chofer": null,
            "pedimento": "",
            "accion": "entrada",
            "linea_transporte": null,
            "proyecto": null,
            "sucursal": null,
            "tipo_transporte": null,
            "udn": null,
            "file": null,
            "creados": [],
            "no_creados": [],
            "modelos_no_existentes": []

        };

        //Translates
        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.warningTitle = Translate.translate('MAIN.MSG.WARNING_TITLE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorGeneric = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');
        vm.sucessMassive = Translate.translate('INPUT.Messages.SuccessMassive');
        vm.successNormal = Translate.translate('INPUT.Messages.SuccessNormal');
        vm.warning = Translate.translate('INPUT.Messages.Warning');
        vm.errorMassive = Translate.translate('INPUT.Messages.ErrorMassive');
        vm.errorNormal = Translate.translate('INPUT.Messages.ErrorNormal');
        vm.errorCabinet = Translate.translate('INPUT.Messages.ErrorCabinet');
        vm.notFoundCabinet = Translate.translate('INPUT.Messages.NotFoundCabinet');
        vm.acceptButton = Translate.translate('MAIN.BUTTONS.ACCEPT');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
        vm.dialogTitle = Translate.translate('INPUT.Dialogs.Confirm.Title');
        vm.dialogMessage = Translate.translate('INPUT.Dialogs.Confirm.Message');
        vm.errorSize = Translate.translate('MAIN.MSG.FILE_SIZE');
        vm.errorQuantity = Translate.translate('INPUT.Messages.QuantityExceeded');

        activate();

        //Functions
        function activate() {
            vm.cabinets = [];
            vm.cabinetID = "";
            vm.notFoundCabinets = [];
            vm.entrada = angular.copy(entrada);

            Persona.listProfile().then(function (res) {
                if (res.sucursal != null) {
                    vm.sucursal = res.sucursal;
                    vm.entrada.sucursal = res.sucursal;
                }
            }).catch(function () {
                toastr.error(vm.errorMessage, vm.errorTitle);
            });
        }

        function guardar() {
            vm.entrada.fecha = getToday();

            var fd = new FormData();

            fd.append('accion', 'entrada');
            fd.append('fecha', vm.entrada.fecha);
            fd.append('tipo_entrada', vm.selectedEntrada.text);

            if (vm.entrada.pedimento != null)
                fd.append('pedimento', vm.entrada.pedimento);

            fd.append('nombre_chofer', vm.entrada.nombre_chofer);
            fd.append('linea_transporte', vm.entrada.linea_transporte);

            if (vm.entrada.proyecto != null)
                fd.append('proyecto', vm.entrada.proyecto);

            fd.append('sucursal', vm.entrada.sucursal);
            fd.append('tipo_transporte', vm.entrada.tipo_transporte);

            if (vm.entrada.udn != null)
                fd.append('udn', vm.entrada.udn);

            if (vm.entrada.id != null)
                fd.append("id", vm.entrada.id);

            if (vm.cabinets.length > 0)
                fd.append('cabinets', _.pluck(vm.cabinets, "economico"));

            if (vm.entrada.ife_chofer != null)
                fd.append('ife_chofer', vm.entrada.ife_chofer);
            //Is massive upload
            if (vm.entrada.file != null) {
                fd.append('file', vm.entrada.file);
                if (vm.entrada.id == null) {
                    vm.loadingPromiseInput = EntradaSalida.postEntradaMasiva(fd).then(function (res) {
                        vm.entrada.id = res.id;
                        vm.entrada.creados = res.creados;
                        vm.entrada.no_creados = _.map(res.no_creados, function (id) {
                            return { "economico": id, "motivo": "Marca o modelo no existentes" };
                        });
                        vm.entrada.modelos_no_existentes = _.map(res.modelos_no_existentes, function (id) {
                            return { "denominacion": id };
                        });
                        vm.entrada.file = null;
                        if (vm.entrada.no_creados.length > 0) {
                            //Input has Cabinets that couldn´t be created
                            toastr.warning(vm.warning, vm.warningTitle);
                            vm.entrada.file = null;
                        }
                        else {
                            //Completely Succesful Input
                            toastr.success(vm.sucessMassive, vm.successTitle);
                            //vm.inputWasCorrect = true;
                            vm.selectedEntrada.text = null;
                            limpiar();
                        }
                    }).catch(function (err) {
                        vm.entrada.file = null;

                        if (err.data.message != null || err.data.message != undefined) {
                            toastr.error(vm.errorQuantity, vm.errorTitle);
                        }
                        else {
                            toastr.error(vm.errorMassive, vm.errorTitle);
                            if (err.data.no_creados.length > 0) {
                                vm.entrada.no_creados = err.data.no_creados;
                            }
                        }
                    });
                }
                else {
                    fd.append('id', vm.entrada.id);
                    vm.loadingPromiseInput = EntradaSalida.putEntradaMasiva(fd, vm.entrada.id).then(function (res) {
                        vm.entrada.id = res.id;
                        vm.entrada.creados = res.creados;
                        vm.entrada.no_creados = res.no_creados;
                        vm.entrada.modelos_no_existentes = _.map(res.modelos_no_existentes, function (id) {
                            return { "denominacion": id };
                        });
                        if (vm.entrada.no_creados.length > 0) {
                            toastr.warning(vm.warning, vm.warningTitle);
                            vm.entrada.file = null;
                        }
                        else {
                            toastr.success(vm.sucessMassive, vm.successTitle);
                            //vm.inputWasCorrect = true;
                            vm.selectedEntrada.text = null;
                            limpiar();
                        }
                    }).catch(function (err) {
                        if (err.data.no_creados.length > 0) {
                            vm.entrada.no_creados = err.data.no_creados;
                        }
                        vm.entrada.file = null;
                        toastr.error(vm.errorMassive, vm.errorTitle);
                    });
                }
            }
            //Is manual upload
            else {
                if (vm.notFoundCabinets.length > 0) {
                    var confirm = $mdDialog.confirm()
                        .title(vm.dialogTitle)
                        .textContent(vm.dialogMessage)
                        .ariaLabel('Confirmar guardado')
                        .ok(vm.acceptButton)
                        .cancel(vm.cancelButton);
                    $mdDialog.show(confirm).then(function () {
                        postManual(fd);
                    }, function () {
                        //Cancelled
                    });
                }
                else {
                    postManual(fd);
                }

            }

        }

        function postManual(fd) {
            EntradaSalida.postEntrada(fd).then(function (res) {
                var request = {
                    "entrada_salida": res.id,
                    "economico": _.map(vm.cabinets, function (element) {
                        return { "economico": element.economico };
                    }
                    )
                };
                CabinetEntradaSalida.create(request).then(function () {
                    toastr.success(vm.successNormal, vm.successTitle);
                    limpiar();
                    vm.selectedEntrada.text = null;
                }).catch(function (err) {
                    vm.entrada.no_creados = err.data.cabinet;
                    toastr.error(vm.errorNormal, vm.errorTitle);
                });

            }).catch(function (err) {
                toastr.error(vm.errorNormal, vm.errorTitle);
            });
        }

        function limpiar() {
            vm.entrada = angular.copy(entrada);
            vm.entrada.sucursal = vm.sucursal;
            vm.hideMassiveUpload = true;
            vm.hideManualUpload = true;
            $scope.entradaForm.$setPristine();
            $scope.entradaForm.$setUntouched();
            $scope.entradaForm.$invalid = true;
            vm.selectedTab = 0;
            vm.inputWasCorrect = false;
            vm.ife_chofer = null;
        }

        function partialClean() {
            //vm.entrada.id = null;
            vm.cabinets = [];
            vm.entrada.creados = [];
            vm.entrada.no_creados = [];
            vm.notFoundCabinets = [];
            vm.entrada.file = null;
        }

        function selectionImage($file) {
            if ($file.size > 1000000) {
                toastr.warning(vm.errorSize, vm.errorTitle);
                vm.entrada.ife_chofer = null;
            }
            else {
                vm.entrada.ife_chofer = $file;
                vm.ife_chofer = $file;
            }
        }

        function selectionFile($file) {
            partialClean();
            vm.entrada.file = $file;
        }

        function getToday() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            return yyyy + '/' + mm + '/' + dd;
        }

        function showMassiveUpload() {
            vm.hideManualUpload = true;
            vm.hideMassiveUpload = false;
            partialClean();
        }

        function showManualUpload() {
            vm.hideManualUpload = false;
            vm.hideMassiveUpload = true;
            partialClean();
        }

        function removeImage() {
            vm.entrada.ife_chofer = null;
        }

        function nextTab() {
            vm.selectedTab = vm.selectedTab + 1;
        }

        function uploadFile() {
            EntradaSalida.postEntradaMasiva(vm.entrada).then(function (res) {
                vm.responseMassiveUpload = res;
            }).catch(function (err) {

            });
        }

        function showMarcaDialog() {
            let brandProvider = CATALOG.web;
            brandProvider.url = URLS.marca;

            let brandCreate = {
                fields: [
                    {
                        type: 'text',
                        model: 'categoria',
                        label: 'Categoría',
                        hint: 'Cabinet, carrito, etc.',
                        required: true,
                        validations: {
                            regex: '[A-Za-z]{0,20}',
                            errors: {
                                regex: 'La longitud máxima es de 20 letras',
                                required: 'La categoría es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: 'Nombre de la marca',
                        required: true,
                        validations: {
                            regex: '[A-Za-zÁ-Úá-ú0-9 ]{0,25}',
                            errors: {
                                regex: 'La longitud máxima es de 25 caracteres (solo letras y números)',
                                required: 'El nombre de la marca es obligatorio'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('INPUT.Create Brand'),
                    okButton: Translate.translate('INPUT.Save'),
                    cancelButton: Translate.translate('INPUT.Cancel'),
                    loading: 'Creando marca'
                }
            };

            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    dialog: brandCreate.dialog,
                    provider: brandProvider,
                    fields: brandCreate.fields
                }
            }).then(function () {
                ErrorHandler.successCreation();
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errortranslate(err);
                }
            });
        }

        function showModeloDialog(ev) {
            let cabinetModelProvider = CATALOG.web;
            cabinetModelProvider.url = URLS.modelo_cabinet;

            let cabinetModelCreate = {
                fields: [
                    {
                        type: 'text',
                        model: 'nombre',
                        label: Translate.translate('INPUT.Dialogs.Model.Name'),
                        hint: 'Nombre del modelo',
                        required: true,
                        validations: {
                            errors: {
                                required: 'El nombre del modelo es obligatorio'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'descripcion',
                        label: Translate.translate('INPUT.Dialogs.Model.Description'),
                        hint: 'Información adicional del modelo',
                        required: true,
                        validations: {
                            regex: '[A-Za-zÁ-Úá-ú0-9 ]{0,100}',
                            errors: {
                                regex: 'La longitud máxima es de 100 caracteres (solo letras y números)',
                                required: 'La descripción del modelo es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'text',
                        model: 'palabra_clave',
                        label: Translate.translate('INPUT.Dialogs.Model.Keyword'),
                        hint: 'Palabra clave para búsqueda del modelo',
                        required: true,
                        validations: {
                            regex: '[A-Za-zÁ-Úá-ú0-9 ]{0,25}',
                            errors: {
                                regex: 'La longitud máxima es de 25 caracteres (solo letras y números)',
                                required: 'La descripción del modelo es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'tipo',
                        //label: Translate.translate('INPUT.Dialogs.Model.Type'),
                        hint: 'Seleccione el tipo del cabinet',
                        catalog: {
                            url: URLS.tipo_equipo,
                            name: Translate.translate('INPUT.Dialogs.Model.Type'),
                            kind: 'Web',
                            model: 'id',
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
                        },
                        validations: {
                            errors: {
                                required: 'La marca del modelo es obligatoria'
                            }
                        }
                    },
                    {
                        type: 'catalog',
                        model: 'marca',
                        //label: Translate.translate('INPUT.Dialogs.Model.Type'),
                        hint: 'Seleccione la marca del cabinet',
                        catalog: {
                            url: URLS.marca,
                            name: Translate.translate('INPUT.Dialogs.Model.Brand'),
                            kind: 'Web',
                            model: 'id',
                            option: 'descripcion',
                            loadMoreButtonText: 'Cargar mas...'
                        },
                        pagination: {
                            total: 'count'
                        },
                        elements: 'results',
                        softDelete: {
                            hide: 'deleted',
                            reverse: false
                        },
                        validations: {
                            errors: {
                                required: 'La marca del modelo es obligatoria'
                            }
                        }
                    }
                ],
                dialog: {
                    title: Translate.translate('INPUT.Create Model'),
                    okButton: Translate.translate('INPUT.Save'),
                    cancelButton: Translate.translate('INPUT.Cancel'),
                    loading: 'Creando modelo de cabinet'
                }
            };

            $mdDialog.show({
                controller: 'CatalogCreateDialogController',
                templateUrl: 'app/mainApp/components/catalogManager/dialogs/createDialog/createDialog.tmpl.html',
                controllerAs: 'vm',
                fullscreen: true,
                clickOutsideToClose: true,
                locals: {
                    dialog: cabinetModelCreate.dialog,
                    provider: cabinetModelProvider,
                    fields: cabinetModelCreate.fields
                }
            }).then(function () {
                ErrorHandler.successCreation();
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errortranslate(err);
                }
            });
        }

        function addCabinet() {
            if (vm.cabinetID.length > 0) {
                var index = vm.cabinets.map(function (elem) {
                    return elem.economico;
                }).indexOf(vm.cabinetID);
                if (index != -1) {
                    toastr.warning(vm.errorCabinet, vm.warning);
                }
                else {
                    vm.searchCabinet = Cabinet
                        .get(vm.cabinetID)
                        .then(function (cabinetInfo) {
                            if (!cabinetInfo.sucursal) {
                                //Cabinet can enter in this WareHouse
                                let tempCabinet = angular.copy(cabinetInfo);
                                tempCabinet.modelo = cabinetInfo.modelo.nombre;
                                tempCabinet.marca = cabinetInfo.marca;
                                vm.cabinets.push(tempCabinet);
                                vm.cabinetID = "";
                            }
                            else {
                                //Cabinet is in a subsidiary WareHouse
                                toastr.error(Translate.translate('INPUT.Messages.CabinetInSubsidiary'));
                            }
                        })
                        .catch(function (cabinetInfoError) {
                            console.error(cabinetInfoError);
                            if (vm.notFoundCabinets.indexOf(vm.cabinetID) != -1) {
                                toastr.warning(vm.errorCabinet, vm.warning);
                            }
                            else {
                                toastr.warning(vm.notFoundCabinet, vm.warning);
                                vm.notFoundCabinets.push(vm.cabinetID);
                            }
                            vm.cabinetID = "";
                        });
                }
            }
            else
                vm.cabinetID = "";
        }

        function removeNotFoundCabinet(id) {
            var index = vm.notFoundCabinets.indexOf(id);
            if (index > -1) {
                vm.notFoundCabinets.splice(index, 1);
            }
        }

        function removeCabinet(id) {
            var index = vm.cabinets.indexOf(id);
            if (index > -1) {
                vm.cabinets.splice(index, 1);
            }
        }

        function showCabinetDialog(economico) {
            $mdDialog.show({
                controller: 'CabinetDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/mainApp/entries/dialogs/cabinet.tmpl.html',
                fullscreen: true,
                clickOutsideToClose: true,
                focusOnOpen: true,
                locals: {
                    cabinetID: economico
                }
            }).then(function (res) {
                removeNotFoundCabinet(res);
                vm.cabinetID = res;
                addCabinet();
            }).catch(function (err) {
                if (err) {
                    ErrorHandler.errortranslate(err);
                }
            });
        }

        function onElementSelect(element, field) {
            vm.entrada[field] = element;
        }
    }

})();
