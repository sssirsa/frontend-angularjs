(function () {
    'use strict';

    angular
        .module('app.mainApp.salepoint.attention')
        .factory('ATTENTIONS', attentionProvider);

    function attentionProvider(
        API,
        URLS,
        PAGINATION,
        QUERIES,
        PERMISSION,
        User
    ) {
        var attentionsUrl = API
            .all(URLS.salepoint.base)
            .all(URLS.salepoint.attention.base);

        //Attention Kind must be one pf the following
        //open, in-process, closed, cancelled, unproductive
        //Otherwise, all requests are returned
        //Page parameter is used for pagination,
        //without it, just the first page is provided
        //
        //Proveder determines if all the requests are returned
        //or just the ones the user have created given their permissions
        function listAttentions(attentionKind, page) {
            var url = attentionsUrl.all(URLS.salepoint.attention.list);
            var params = {};
            //Adding ordering parameter
            params[QUERIES.ordering] = '-folio';
            var canGetAll;
            var canGetJustOwn;
            //Permission retrieving
            if (PERMISSION.hasPermission('sale_point__attentions__attention_all__get')) {
                canGetAll = true;
            }
            else {
                if (PERMISSION.hasPermission('sale_point__attentions__attention_own__get')) {
                    canGetJustOwn = true;
                    params[QUERIES.salepoint.by_user] = User.getUser().id;
                }
            }
            if (canGetAll || canGetJustOwn) {
                //Pagination params building
                if (page) {
                    params[PAGINATION.limit] = PAGINATION.pageSize;
                    params[PAGINATION.offset] = PAGINATION.pageSize * (page - 1);
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
            else {
                //User does not have the required permissions to retrive attentions
                throw new Error('@ATTENTIONS provider, @listAttentions function: User does not have the required permission for retriving the attentions list');
            }
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
