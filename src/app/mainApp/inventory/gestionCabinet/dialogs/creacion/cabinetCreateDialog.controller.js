/**
 * Created by Emmanuel on 15/10/2016.
 * Modified by Alex on 19/10/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.inventory')
        .controller('CabinetDialogController', CabinetDialogController);
    function CabinetDialogController(
        $mdDialog,
        Cabinet,
        //MarcaCabinet,
        URLS,
        cabinetID,
        Helper,
        Translate,
        toastr
    ) {
        var vm = this;

        //Functions
        vm.create = create;
        vm.cancel = cancelClick;
        vm.onBrandSelect = onBrandSelect;
        vm.onElementSelect = onElementSelect;


        //Blank variables templates
        vm.cabinet = {};
        vm.modelos = [];

        vm.catalogues = {
            marca: {
                catalog: {
                    url: URLS.marca,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Dialogs.Cabinet.Brand'),
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
            modelo_by_marca: {
                catalog: {
                    url: null,
                    kind: 'Web',
                    name: Translate.translate('INPUT.Dialogs.Cabinet.Model'),
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
            }
        };

        //Translates
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_CATALOG');

        activate();

        function activate() {
            vm.cabinet.economico = cabinetID;
        }

        function create() {
            //Filling up minimum required fields
            let cabinet = {
                "tipo_entrada": "",
            };
            vm.cabinet['status'] = 'N/A';
            vm.cabinet['linea_x'] = null;
            vm.cabinet['linea_y'] = null;
            vm.cabinet['linea_z'] = null;
            vm.cabinet['no_incidencias'] = 0;
            vm.cabinet['activo'] = true;
            if (vm.cabinet.id_unilever) {
                vm.cabinet['capitalizado'] = true;
            }
            else {
                vm.cabinet['capitalizado'] = false;
            }
            vm.cabinet['deleted'] = false;

            vm.createPromise = Cabinet.createClean(vm.cabinet).then(function (res) {
                $mdDialog.hide(vm.cabinet.economico);
            }).catch(function (err) {
                $mdDialog.cancel(err);
            });
        }

        function cancelClick() {
            $mdDialog.cancel(null);
        }

        function onBrandSelect(element) {
            vm.cabinet.modelo = null;
            vm.marca = element;
            vm.catalogues.modelo_by_marca.catalog.url = URLS.marca + '/models/' + element;
        }

        function onElementSelect(element, field) {
            vm.cabinet[field] = element;
        }
    }
})();
