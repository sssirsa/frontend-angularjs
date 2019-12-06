(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.attention')
        .factory('ATTENTIONS', attentionProvider);

    function attentionProvider(
        API,
        URLS,
        PAGINATION,
        QUERIES
    ) {
        var attentionsUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.attention.base);

        //Attention Kind must be one pf the following
        //open, in-process, closed, cancelled, unproductive
        //Otherwise, all requests are returned
        //Page parameter is used for pagination,
        //without it, just the first page is provided
        function listAttentions(attentionKind, page) {
            var url = attentionsUrl.all(URLS.salepoint.attention.list);
            var params;
            //Pagination params building
            if (page) {
                params = {
                    limit: PAGINATION.pageSize,
                    offset: PAGINATION.pageSize * (page - 1)
                };
                //Adding ordering parameter
                params[QUERIES.ordering] = '-folio';
            }
            if (attentionKind) {
                //A request kind has been provided
                switch (attentionKind) {
                    case 'open':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.open;
                        break;
                    case 'assigned':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.assigned;
                        break;
                    case 'unproductive':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.unproductive;
                        break;
                    case 'in-process':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.in_process;
                        break;
                    case 'closed':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.closed;
                        break;
                    case 'cancelled':
                        params[QUERIES.salepoint.by_status.base] = QUERIES.salepoint.by_status.cancelled;
                        break;
                }
            }
            return url.customGET(null, params);
        }

        function getAttention(attentionID) {
            return attentionsUrl
                .customGET(URLS.salepoint.attention.list + '/' + attentionID);
        }

        function performRegisterAttention(attentionId, attentionData) {
            return attentionsUrl
                .all(URLS.salepoint.attention.register_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performChangeAttention(attentionId, attentionData) {
            return attentionsUrl
                .all(URLS.salepoint.attention.change_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performRetrieveAttention(attentionId, attentionData) {
            return attentionsUrl
                .all(URLS.salepoint.attention.retrieve_attention)
                .all(attentionId)
                .patch(attentionData);
        }

        function performTechnicalServiceAttention(attentionId, attentionData) {
            return attentionsUrl
                .all(URLS.salepoint.attention.technical_service_attention)
                .all(attentionId)
                .patch(attentionData);
        }
        
        function assignationTechnician(serviceID, technicianData) {
            return attentionsUrl
                .all(URLS.salepoint.attention.assignation)
                .all(serviceID)
                .customPUT(technicianData);
        }

        return {
            listAttentions: listAttentions,
            getAttention: getAttention,
            performRegisterAttention: performRegisterAttention,
            performChangeAttention: performChangeAttention,
            performRetrieveAttention: performRetrieveAttention,
            performTechnicalServiceAttention: performTechnicalServiceAttention,
            assignationTechnician: assignationTechnician
        };

    }
})();
