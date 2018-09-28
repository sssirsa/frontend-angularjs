/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * /
* Autor: Erick Laureano Lechuga
* Fecha: 10/09/18
* Version: 1.5
* Requerimientos:
*
*   Variables necesarias:
*
*       vm.offset = 0;
*       vm.limit = 20;
*       vm.refreshPaginationButtonsComponent = true;
*       vm.next = {{url de siguiente pagina}}
*       vm.previous {{url de la pagina anterior}}
*
*   funciones necesarias:
*
*       vm.sig = sigPage;
*       vm.prev = prevPage;
*       vm.goToNumberPage = goToNumberPage;
*
*   Ejemplos de las funciones:
*
*       function sigPage() {
*           vm.offset += vm.limit;
*           {{Aqui va el llamado a la funcion que realiza las peticiones a back mandando los parametros de limit y offset}}
*       }
*
*       function prevPage() {
*           vm.offset -= vm.limit;
*           {{Aqui va el llamado a la funcion que realiza las peticiones a back mandando los parametros de limit y offset}}
*       }
*
*       function goToNumberPage(number) {
*           vm.offset = number * vm.limit;
*           {{Aqui va el llamado a la funcion que realiza las peticiones a back mandando los parametros de limit y offset}}
*       }
*
*   Consideraciones:
*
*       1.- Cada que se ejecute alguna de las funciones sigPage, prevPage o goToNumberPage se debe
*           setear la variable vm.refreshPaginationButtonsComponent en false, y al terminar de recibir la peticion
*           volver a setear dicha variable en true
*
*       2.- Si se aplicara algun tipo de filtrado mediante queryset en el listado es necesario realizar el seteo de la variable
*           offset en 0 y nuevamente repetir el procedimiento de la consideracion anterio para recargar el componente
*           estos seteos se realizaran en la funcion utilizada para invocar la peticion con queryset
*
*   Ejemplo de implementacion del componente:
*
*       <div ng-if="vm.refreshPaginationButtonsComponent">
*           <pagination-manager-buttons go-sig="vm.sig()"
*                                       go-prev="vm.prev()"
*                                       go-number="vm.goToNumberPage(number)"
*                                       limit-objects="vm.limit"
*                                       count-object="vm.object.count"
*                                       offset-object="vm.offset"
*                                       nex-object="vm.object.next"
*                                       prev-object="vm.object.previous">
*           </pagination-manager-buttons>
*       </div>
*
*   Nota: el objeto vm.object debe ser renombrado por el nombre de la variable usada para guardar el response
*         de la solicitud.
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
(function () {
    angular
        .module('app.mainApp')
        .component('paginationManagerButtons', {
            templateUrl: 'app/mainApp/components/paginationManagerButtons/paginationManagerButtons.tmpl.html',
            controller: PaginationManagerButtonsController,
            bindings: {
                goSig: '&',
                goPrev: '&',
                goNumber: '&',

                limitObjects: '<',
                countObject: '<',
                nexObject: '<',
                prevObject: '<',
                offsetObject: '<'
            }
        });

    function PaginationManagerButtonsController() {
        var vm = this;
        vm.arrayButtonPage = [];
        vm.correctUse = true;
        vm.numberPage = 1;
        vm.totalPages = 1;

        vm.goToNumberPage = goToNumberPage;
        vm.moveSlide = moveSlide;
        vm.changeNumber = changeNumber;

        init ();

        function init() {
            if (vm.goSig == null) {
                vm.correctUse = false;
                console.debug('La funcion Sig() es requerida');
            }
            if (vm.goPrev == null) {
                vm.correctUse = false;
                console.debug('La funcion Prev() es requerida');
            }
            if (vm.goNumber == null) {
                vm.correctUse = false;
                console.debug('La funcion goNumberPage(number) es requerida');
            }
            if (vm.limitObjects == null) {
                vm.correctUse = false;
                console.debug('El parametro limit es requerido');
            }
            if (vm.countObject == null) {
                vm.correctUse = false;
                console.debug('El parametro count es requerido');
            }
            if (vm.offsetObject == null) {
                vm.correctUse = false;
                console.debug('El parametro offset es requerido');
            }
            if(vm.correctUse){
                setNumberButtons();
            }
        }

        function setNumberButtons() {
            var pages = Math.ceil(vm.countObject/vm.limitObjects);
            if (pages >= 2) {
                vm.totalPages = pages;
                vm.numberPage = (vm.offsetObject/vm.limitObjects) + 1;
            }
        }

        function goToNumberPage() {
            vm.goNumber({number: vm.numberPage-1});
        }

        function moveSlide() {
            goToNumberPage();
        }

        function changeNumber(event) {
            if(!vm.numberPage){
                vm.numberPage = 1;
            }
            if(vm.numberPage > vm.totalPages) {
                vm.numberPage = vm.totalPages;
            }
            if(vm.numberPage < 1) {
                vm.numberPage = 1;
            }
            if(event.keyCode === 13) {
                goToNumberPage();
            }
        }
    }
})();
