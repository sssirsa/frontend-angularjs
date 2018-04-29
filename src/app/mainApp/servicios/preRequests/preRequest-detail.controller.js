(function(){
    'use strict';

    angular
        .module('app.mainApp.servicios')
        .controller('preRequestDetailController',preRequestDetailController);
    function preRequestDetailController(preRequests, $stateParams,cabinetPV,toastr,Translate,Geolocation,Helper) {

        var vm = this;
        //Listado de Variables

        vm.preRequest={};
        vm.photos=[];
        vm.images = [];
        vm.errorMessage='';
        vm.showCabinet=false;
        vm.cabinet=[];
        //listado de constantes

        vm.successTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.cabinetNotFound=Translate.translate('PREREQUEST_TRANSLATE.MSG.CABINET_NOT_FOUND');
        vm.unexpected=Translate.translate('PREREQUEST_TRANSLATE.MSG.UNEXPECTED');
        vm.creationsuccess=Translate.translate('PREREQUEST_TRANSLATE.MSG.CREATION_SUCCESFULL');
        vm.cancelationsuccess=Translate.translate('PREREQUEST_TRANSLATE.MSG.CANCELATION_SUCCESFULL');
        vm.preRequestnotFound=Translate.translate('PREREQUEST_TRANSLATE.MSG.PREREQUESTNOTFOUND');



        //Listado de funciones
        vm.getinfo=getinfo;
        vm.showStoreLocation=showStoreLocation;
        getinfo();
        //funciones para usar lo de alex
        vm.aRefresh = aRefresh;
        //Variables para usar lo de alex
        vm.todosprev = null;
        vm.loadingPromise = null;


        function aRefresh() {
            vm.todosprev = null;
            vm.cabinet = [];
            getinfoCabinet(vm.preRequest.cabinet);

        }
//aqui empieza lo mio
        function getinfo() {
            var promiseGetInfoPreRequest=preRequests.getByID($stateParams.idPreRequest);
            promiseGetInfoPreRequest.then(function(elementPreRequest){
                vm.preRequest=elementPreRequest;

                console.log(vm.preRequest);
                conditioninGallery();
                getinfoCabinet(vm.preRequest.cabinet);
            }).catch(function (errCarga) {
                console.log(errCarga);
                toastr.warning(vm.preRequestnotFound, vm.errorTitle);

            });

        }
        function getinfoCabinet(id){
            var promiseGetInfoPreRequestCabinet=cabinetPV.getByID(id);
            promiseGetInfoPreRequestCabinet.then(function(cabinetPrerequest){
                vm.cabinet.push(cabinetPrerequest);
                console.log(vm.cabinet);
                vm.todosprev = Helper.filterDeleted(vm.cabinet, true);
                vm.showCabinet=true;
            }).catch(function (err) {
                console.log(err);
                vm.showCabinet=false;
                toastr.warning(vm.cabinetNotFound, vm.errorTitle);

            });

        }

        //vm.photos=vm.preRequest.fotos;
        function conditioninGallery(){
            if(vm.preRequest.fotos.length>0){
            vm.preRequest.fotos.forEach(function (foto, index) {
                var fototmp={
                    id:index+1,
                    url:foto.foto
                };
                vm.photos.push(fototmp);
            });
            }
            console.log(vm.photos);

        }
        function showStoreLocation() {
            Geolocation.locate(vm.preRequest.establecimiento.latitud, vm.preRequest.establecimiento.longitud);
        }







    }
})();
