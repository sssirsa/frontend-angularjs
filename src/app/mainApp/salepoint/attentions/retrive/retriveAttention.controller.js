(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint')
        .controller('retriveAttentionController', retriveAttentionController);

    /* @ngInject */
    function retriveAttentionController(
        User,
        REQUESTS,
        ATTENTIONS,
        toastr,
        $log,
        $state,
        $stateParams,
        Translate,
        Stores,
        Persona_Admin,
        Geolocation,
        SCORES,
        cabinetUC,
        ErrorHandler,
        Helper,
        $scope,
        $mdDialog) {

        var vm = this;

        //Variable declaration
        vm.user = User.getUser();
        vm.id = $stateParams.id;

        vm.statusNew = 'Atendida';
        vm.user = null;
        vm.request = null;
        vm.solicitudDetalles = null;
        vm.store = null;
        vm.km = null;
        vm.insumos = null;
        vm.improductivo = !null;
        vm.visible = !null;
        vm.insumosUsados = [];
        vm.evidenciaNueva = [];
        vm.firmaC = [];
        vm.firmaT = [];
        vm.fileValidations = {
            size: {
                max: '5MB',
                min: '10B'
            }
        };

        vm.todosprev = vm.todosprev2;
        vm.todos = vm.todosex;
        vm.loadingPromise = null;
        vm.toModel = null;
        vm.searchText = '';
        vm.searchBool = false;

        vm.promiseLoader = null;

        //Constants declaration
        vm.storeSegmentation = []; //TODO: Update with API callback
        vm.scores = SCORES;
        vm.aceptButton = Translate.translate('MAIN.BUTTONS.ACCEPT');
        vm.cancelButton = Translate.translate('MAIN.BUTTONS.CANCEL');
        vm.dialogRestoreTitle = Translate.translate('MAIN.DIALOG.ATTENTION_TITLE');
        vm.dialogRestoreMessage = Translate.translate('MAIN.DIALOG.ATTENTION_MESSAGE');

        //Declaración de funciones
        vm.filesSelected = filesSelected;
        vm.enviar = enviar;

        activate();

        function activate() {
            vm.visible = false;

            vm.loadingPromise = ATTENTIONS.getAttention(vm.id)
                .then(function (requestSuccess) {
                    vm.request = requestSuccess;
                    vm.user = vm.request.solicitud.persona;
                    vm.store = vm.request.solicitud.establecimiento;
                    vm.km = vm.request.km;
                    vm.solicitudDetalles = vm.request.solicitud;

                    switch (vm.request.status) {
                        case 'Abierta':
                            vm.visible = true;
                            break;

                        case 'En_proceso':
                            vm.visible = true;
                            break;                            

                        case 'Asignada':
                            vm.visible = true;
                            break;

                        default:
                            vm.visible = false;
                            break;
                    }
                    if(vm.visible &&!vm.user.sucursal && !vm.user.udn){
                        toastr.warning(Translate.translate('ATTENTION.DETAIL.ERRORS.ADMIN_USER'));
                    }
                    urlEvidencia();
                    convertImages();
                    convertFirm();

                })
                .catch(function (errorRequest) {
                    $log.error(errorRequest);
                    ErrorHandler.errorTranslate(errorRequest);
                });
        }


        function urlEvidencia() {
            if(vm.solicitudDetalles.evidencia){
                angular.forEach(vm.solicitudDetalles.evidencia, function (evidence) {
                    evidence.url = evidence.foto;
                });
            }
        }

        function convertFirm() {
            if(vm.request.firma_cliente){
                var firmClient = [{url: vm.request.firma_cliente, foto: vm.request.firma_cliente}];
                vm.request.firma_cliente = firmClient;
            }

            if(vm.request.firma_tecnico){
                var firmTec = [{url: vm.request.firma_tecnico, foto: vm.request.firma_tecnico}];
                vm.request.firma_tecnico = firmTec;
            }
        }


        function convertImages() {
            var evidences = vm.request.evidencia;
            angular.forEach(evidences, function (evidence) {
                evidence.url = evidence.foto;
            });
            vm.request.evidencia = evidences;
        }

        function enviar(){
            if(!vm.user.sucursal && !vm.user.udn){
                toastr.error(Translate.translate('ATTENTION.DETAIL.ERRORS.ADMIN_USER'));
            }

            if(validar()){
                vm.insumosUsados = [];

                if (vm.improductivo === true) {
                    var economico = [];

                    if(!vm.request.observaciones_cliente){
                        vm.request.observaciones_cliente = "Sin observaciones";
                    }

                    if(!vm.request.observaciones_tecnico){
                        vm.request.observaciones_tecnico = "Sin observaciones";
                    }

                    if(!vm.request.calificacion){
                        vm.request.calificacion = 0;
                    }                    

                    vm.objetoAtencion = {
                        cabinets: economico,
                        descripcion_trabajo: vm.request.tipo,
                        observaciones_cliente: vm.request.observaciones_cliente,
                        observaciones_tecnico: vm.request.observaciones_tecnico,
                        km: vm.km,
                        firma_cliente: vm.firmaC,
                        firma_tecnico: vm.firmaT,
                        evidencia: vm.evidenciaNueva,
                        calificacion: vm.request.calificacion,
                        cancelacion: false,
                        status:'Atendida'
                    };

                    confirmacion(vm.objetoAtencion);
                }else{
                    vm.objetoAtencion = {
                        cancelacion: true,
                        km: vm.km
                    };

                    confirmacion(vm.objetoAtencion);
                }
            }
        }

        function validar(){
            var cont = 0;

            if(vm.evidenciaNueva.length === 0){
                toastr.error(Translate.translate('Se requiere de al menos una evidencia'));
                cont++;
            }

            if(!vm.km){
                toastr.error(Translate.translate('El campo de km es requerido'));
                cont++;
            }

            if(cont === 0){
                return true;
            }else{
                return false;
            }
        }

        function confirmacion(data) {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogRestoreTitle)
                .textContent(vm.dialogRestoreMessage)
                .ariaLabel('Confirmar')
                .ok(vm.aceptButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function () {
                vm.promiseLoader = ATTENTIONS.performRetrieveAttention(vm.request.folio, data)
                    .then(function (result) {
                        $log.debug(result);
                        toastr.success(Translate.translate('SUCCESS.UPDATE'));
                        $state.go('triangular.admin-default.serviceList', {runListPendientes:true});
                    })
                    .catch(function (resultError) {
                        ErrorHandler.errorTranslate(resultError);
                    });
            }, function () {

            });
        }

        function filesSelected(files, num) {
            if(num === 1){
                vm.evidenciaNueva = [];
            }

            angular.forEach(files, function (image) {
                var base64Image = null;
                var fileReader = new FileReader();
                fileReader.readAsDataURL(image);
                fileReader.onloadend = function () {
                    base64Image = fileReader.result;

                    switch (num){
                        case 1:
                            vm.evidenciaNueva.push({foto: base64Image});
                            break;

                        case 2:
                            vm.firmaC = null;
                            vm.firmaC = base64Image.toString();
                            break;

                        case 3:
                            vm.firmaT = null;
                            vm.firmaT = base64Image;
                            break;
                    }
                };
            });
        }
    }
})();
