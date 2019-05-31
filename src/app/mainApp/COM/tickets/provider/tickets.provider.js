/**
 * Created by franciscojaviercerdamartinez on 2/3/19.
 */

(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('TicketProvider',TicketProvider);

    function TicketProvider(
        API,
        URLS,
        COM
    ) {

        var baseCom = API.all(COM.base);

        return {
            getTicket_type:getTicket_type,
            getServiceDetails:getServiceDetails,
            listTicket:listTicket,
            getTicket_typeList:getTicket_typeList

        };


        function getTicket_typeList(){
            return baseCom.all(COM.catalogues.base).all(COM.catalogues.ticket_type).customGET();
        }
        function getTicket_type(idTipoTicket){
            return baseCom.all(COM.catalogues.base).all(COM.catalogues.ticket_type).all(idTipoTicket).customGET();
        }
        function getServiceDetails(mensaje_com){
            return baseCom.all(COM.actions.base).all(COM.actions.message.base).all('detail').all(mensaje_com).customGET();
        }
        function listTicket(limit, offset, querySet){
            if (!querySet) {
                return baseCom.all(COM.actions.base).all(COM.actions.ticket.base+'?limit=' + limit + '&offset=' + offset).customGET();
            } else {
                return baseCom.all(COM.actions.base).all(COM.actions.ticket.base+ '?limit=' + limit + '&offset=' + offset + '&' + querySet).customGET();
            }
        }





    }
})();
