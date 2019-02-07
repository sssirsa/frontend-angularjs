/**
 * Created by franciscojaviercerdamartinez on 2/3/19.
 */

(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('TicketFakerProvider',TicketFakerProvider);

    function TicketFakerProvider(
        API,
        URLS,
        COM
    ) {

        var baseCom = API.all(COM.base);

        return {
            getTicket_type:getTicket_type,
            getServiceDetails:getServiceDetails

        };


        function getTicket_type(idTipoTicket){
            return baseCom.all(COM.catalogues.base).all(COM.catalogues.ticket_type).all(idTipoTicket).customGET();
        }
        ///com/message/detail/
        function getServiceDetails(mensaje_com){
            return baseCom.all(COM.actions.base).all(COM.actions.message.base).all('detail').all(mensaje_com).customGET();
        }





    }
})();
