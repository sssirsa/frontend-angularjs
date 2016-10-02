/**
 * Created by Emmanuel on 12/09/2016.
 */
/**
 * Created by Emmanuel on 11/09/2016.
 */
(function () {
    'use_strict';

    angular
        .module('app.mainApp.catalogos')
        .controller('clienteController', clienteController);

    function clienteController(Clientes, toastr, $scope, Translate, $mdDialog) {
        var vm = this;


        //Functions
        vm.create = create;
        vm.update = update;
        vm.remove = remove;
        vm.search = search;
        vm.clear = clear;
        vm.selectedItemChange=selectedItemChange;

        activate();

        function activate() {
            vm.successTitle=Translate.translate('Clients.Notify.Success');
            vm.errorTitle=Translate.translate('Clients.Notify.Error');
            vm.warningTitle=Translate.translate('Clients.Notify.Warning');
            vm.listErrorMessage=Translate.translate('Clients.Notify.Messages.ERROR_GETTING_CLIENTS');
            vm.errorCreate=Translate.translate('Clients.Notify.Messages.ERROR_CREATING_CLIENT');
            vm.succesCreate=Translate.translate('Clients.Notify.Messages.SUCCESS_CREATING_CLIENT');
            vm.errorRemove=Translate.translate('Clients.Notify.Messages.ERROR_REMOVING_CLIENT');
            vm.successRemove=Translate.translate('Clients.Notify.Messages.SUCCESS_REMOVING_CLIENT');
            vm.errorUpdate=Translate.translate('Clients.Notify.Messages.ERROR_UPDATING_CLIENT');
            vm.successUpdate=Translate.translate('Clients.Notify.Messages.SUCCESS_UPDATING_CLIENT');
            vm.deleteButton=Translate.translate('MAIN.BUTTONS.DELETE');
            vm.cancelButton=Translate.translate('MAIN.BUTTONS.CANCEL');
            vm.dialogTitle=Translate.translate('MAIN.DIALOG.DELETE_TITLE');
            vm.dialogMessage=Translate.translate('MAIN.DIALOG.DELETE_MESSAGE');

            vm.searchParameter='';
            vm.clients=Clientes.list();
            vm.filteredClients=vm.clients;
            vm.client={
                "nombre": "",
                "apellido_paterno": "",
                "apellido_materno": "",
                "direccion": "",
                "telefono": "",
                "user": {}
            };
            //vm.selectedClient=null;
            Clientes.getClienteId().then(function(res){
                vm.role=res[0].id;
            });

        }

        function create() {
            vm.client.user.role=vm.role;
            Clientes.create(vm.client).then(function(res){
                toastr.success(vm.succesCreate,vm.successTitle);
                vm.clear();
                activate();
            }).catch(function(err){
                toastr.error(vm.errorCreate,vm.errorTitle);
                console.log(err);
            });
        }

        function update() {
            vm.client.user.role=vm.role;
            Clientes.modify(vm.client).then(function(res){
                toastr.success(vm.successUpdate,vm.successTitle);
                vm.clear();
                activate();
            }).catch(function(err){
                toastr.error(vm.errorUpdate,vm.errorTitle);
                console.log(err);
            });
        }

        function remove() {
            var confirm = $mdDialog.confirm()
                .title(vm.dialogTitle)
                .textContent(vm.dialogMessage)
                .ariaLabel('Confirmar eliminación')
                .ok(vm.deleteButton)
                .cancel(vm.cancelButton);
            $mdDialog.show(confirm).then(function() {
                Clientes.remove(vm.client).then(function (res) {
                    toastr.success(vm.successRemove, vm.successTitle);
                    vm.clear();
                    activate();
                }).catch(function (err) {
                    toastr.error(vm.errorRemove, vm.errorTitle);
                    console.log(err);
                });
            },function(){
                //Cancelled
            });
        }

        function search(text) {
            vm.filteredClients = _.filter(vm.clients, function (item) {
                return item.nombre.toLowerCase().includes(text.toLowerCase());
            });
            return vm.filteredClients;
        }

        function clear() {
            $scope.formClient.$invalid=true;
            $scope.formClient.$setPristine();
            $scope.formClient.$setUntouched();
            vm.searchParameter='';
            vm.filteredClients=vm.clients;
            vm.client={
                "nombre": "",
                "apellido_paterno": "",
                "apellido_materno": "",
                "direccion": "",
                "telefono": "",
                "user": {}
            };
        }

        function selectedItemChange(item) {
            //vm.selectedClient = item;
            //vm.client=angular.copy(vm.selectedClient);
            vm.searchParameter='';
            vm.client=angular.copy(item);
            $scope.formClient.$invalid=true;
        }

        
    }

})();