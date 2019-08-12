/**
 * Created by franciscojaviercerdamartinez on 8/11/19.
 */
(function(){
    'use_strict';

    angular
        .module('app.mainApp')
        .factory('TicketProvider',TicketProvider);

    function TicketProvider(
        API,
        MASSIVE_CHARGE
    ) {

        var baseMassiveCharge = API.all(MASSIVE_CHARGE.base);

        return {
            getMassiveLoadType:getMassiveLoadType,
            getMassiveLoadHistory:getMassiveLoadHistory,
            getMassiveLoad:getMassiveLoad,
            cancelMassiveLoad:cancelMassiveLoad,
            createMassiveLoad:createMassiveLoad

        };



        function createMassiveLoad(){
            return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk).customPOST();
        }
        function getMassiveLoadType(){
            return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk).customGET();
        }
        function cancelMassiveLoad(id){
            return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk).all(id).customPATCH();
        }
        function getMassiveLoad(id){
            return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk).all(id).customGET();
        }
        function getMassiveLoadHistory(limit, offset, querySet){
            if (!querySet) {
                return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk_load_history+'?limit=' + limit + '&offset=' + offset).customGET();
            } else {
                return baseMassiveCharge.all(MASSIVE_CHARGE.actions.bulk_load_history+ '?limit=' + limit + '&offset=' + offset + '&' + querySet).customGET();
            }
        }





    }
})();
