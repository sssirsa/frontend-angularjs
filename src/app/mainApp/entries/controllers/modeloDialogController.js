(function () {
    'use_strict';

    angular
        .module('app.mainApp.entries')
        .controller('ModeloDialogController', ModeloDialogController);
    function ModeloDialogController(
        $mdDialog,
        //MarcaCabinet,
        ModeloCabinet,
        Helper,
        Translate,
        toastr
        //TipoEquipo
    ) {
        var vm = this;

        //Translates
        vm.succesTitle = Translate.translate('MAIN.MSG.SUCCESS_TITLE');
        vm.successMessage = Translate.translate('MAIN.MSG.GENERIC_SUCCESS_CREATE');
        vm.errorTitle = Translate.translate('MAIN.MSG.ERROR_TITLE');
        vm.errorMessage = Translate.translate('MAIN.MSG.ERROR_MESSAGE');
        vm.duplicateMessage=Translate.translate('INPUT.Dialogs.Model.Duplicate');

        //Functions
        vm.create = create;
        vm.cancel = cancelClick;

        var modelo = {};

        activate();

        function activate() {

            vm.modelo = {};
            //MarcaCabinet.listObject().then(function (res) {
            //    vm.marcas = Helper.filterDeleted(res, true);
            //    vm.marcas = Helper.sortByAttribute(vm.marcas, 'descripcion');

            //}).catch(function () {
            //    toastr.error(vm.errorMessage, vm.errorTitle);
            //    vm.marcas = [];
            //});
            //TipoEquipo.listWitout().then(function (res) {
            //    vm.tipos = Helper.filterDeleted(res, true);
            //    vm.tipos =_.sortBy(vm.tipos, 'nombre');
            //}).catch(function () {
            //    toastr.error(vm.errorMessage, vm.errorTitle);
            //    vm.tipos = [];
            //});
        }


        function create() {

            vm.modelo.nombre = vm.modelo.nombre.toUpperCase();
            vm.modelo.descripcion = vm.modelo.descripcion.toUpperCase();
            vm.modelo.palabra_clave = vm.modelo.palabra_clave.toUpperCase();
            ModeloCabinet.create(vm.modelo).then(function (res) {
                toastr.success(vm.successMessage, vm.succesTitle);
                $mdDialog.hide();
            }).catch(function (err) {
                if(err.status==400 && err.data.non_field_errors!=undefined)
                {
                    toastr.error(vm.duplicateMessage,vm.errorTitle);
                }else {
                    $mdDialog.cancel(err);
                }
            });
        }

        function cancelClick() {
            $mdDialog.cancel(null);
        }

    }
})();
