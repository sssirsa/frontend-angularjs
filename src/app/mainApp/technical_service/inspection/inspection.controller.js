/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('inspectionController', inspectionController);
    function inspectionController($scope, Translate, ErrorHandler, EnvironmentConfig, URLS, inspectionProvider) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id = ''; //asset identifier
        vm.title_info = Translate.translate('INSPECTION.CHECKLIST');
        vm.assets_info = Translate.translate('INSPECTION.MORE_INFO');
        vm.checklist = {};

        //Declaracion de Funciones como variables_______________________________________________________________________
        vm.sendPrecheck = sendPrecheck;
        vm.sendInspection = sendInspection;
        vm.sendCheckList = sendCheckList;
        vm.clear = clear;

        const stickersURL = (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base + '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.sticker);
        vm.catalogues = {
            sticker: {
                catalog: {
                    url: stickersURL,
                    name: Translate.translate('INSPECTION.CATALOGUES.STICKER'),
                    loadMoreButtonText: 'Cargar mas',
                    model: 'id',
                    option: 'descripcion'
                },
                pagination: {
                    total: 'count',
                    next: 'next'
                },
                required: true,
                elements: 'results',
                softDelete: {
                    hide: 'deleted',
                    reverse: false
                },
                noResults: Translate.translate('ERRORS.NO_RESULTS'),
                hint: Translate.translate('INSPECTION.CATALOGUES.ADD')
            }
        };

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral = infogral;
        vm.infoStep = infoStep;
        vm.getInsumosLote = getInsumosLote;
        vm.onStickerSelect = onStickerSelect;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla
        function sendInspection() {
            console.log(vm.checklist);
            var promiseSendInspection = inspectionProvider.makeInspection(vm.checklist);
            promiseSendInspection.then(function(response){
                ErrorHandler.successCreation();
            }).catch(function (errormsg) {
                console.log(errormsg);
                ErrorHandler.errorTranslate(errormsg);
            });

        }

        function sendCheckList() {
            console.log(vm.checklist);

        }

        function sendPrecheck() {
            console.log(vm.checklist);

        }

        function clear() {
            vm.checklist = undefined;
            vm.asset = undefined;
            vm.step = undefined;
        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset = cabinet;
            console.log(vm.asset);
            vm.checklist.cabinet_id = vm.asset.economico;

        }

        function infoStep(step) {
            vm.step = step;

        }

        function getInsumosLote(element) {
            console.log(element);
        }

        function onStickerSelect(value) {
            //console.log(value);
            vm.checklist.sticker_id = value;
        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
