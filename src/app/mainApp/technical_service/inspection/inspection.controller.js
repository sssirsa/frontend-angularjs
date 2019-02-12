/**
 * Created by franciscojaviercerdamartinez on 1/8/19.
 */
(function () {
    'use strict';

    angular
        .module('app.mainApp.service')
        .controller('inspectionController', inspectionController);
    function inspectionController($scope, Translate, ErrorHandler,EnvironmentConfig,URLS) {
        var vm = this;
        vm.asset = undefined;//objeto contenedor del cabinet
        vm.asset_id=''; //asset identifier
        vm.title_info=Translate.translate('INSPECTION.CHECKLIST');
        vm.assets_info=Translate.translate('INSPECTION.MORE_INFO');
        vm.checklist={};

        const stickersURL =  (EnvironmentConfig.site.rest.api)
            .concat('/' + URLS.entries_departures.base+ '/' + URLS.entries_departures.catalogues.base + '/' + URLS.entries_departures.catalogues.sticker);
        vm.catalogues = {
            sticker: {
                catalog: {
                    url:stickersURL,
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
                hint:Translate.translate('SYMTOMPS_COMPONENT.ADD')
            }
        };

        //Declaración de Funciones como variable  de Componentes________________________________________________________
        vm.infogral=infogral;
        vm.infoStep=infoStep;
        vm.getInsumosLote=getInsumosLote;
        vm.buildObject=buildObject;
        //--------------------------------------------------------------------------------------------------------------
        //Funciones Propias de la Pantalla
        function buildObject() {
            console.log(vm.checklist);

        }

        //  Funciones para Componentes _________________________________________________________________________________

        function infogral(cabinet) {
            vm.asset=cabinet;

        }
        function infoStep(step) {
            vm.step=step;

        }
        function getInsumosLote(element){
            console.log(element);
        }

        //--------------------------------------------------------------------------------------------------------------


    }


})();
