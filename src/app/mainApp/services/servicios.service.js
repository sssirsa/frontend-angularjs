/**
 * Created by franciscojaviercerdamartinez on 17/07/16.
 */
/**
 * Created by franciscojaviercerdamartinez on 16/07/16.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Servicios', Servicios);

    /* @ngInject */
    function Servicios($q, WebRestangular, URLS) {
        var service = {
            crearEtapaServicio: crearEtapaServicio,
            editarEtapaServicio: editarEtapaServicio,
            eliminarEtapaServicio: eliminarEtapaServicio,
            consultarAllEtapaServicioDiagnostico: consultarAllEtapaServicioDiagnostico,
            consultarEtapaServicioDiagnostico: consultarEtapaServicioDiagnostico,
            consultarInsumosEtapa: consultarInsumosEtapa,
            consultarAllInsumosCabinetEtapa: consultarAllInsumosCabinetEtapa,
            getEtapaValidable: getEtapaValidable,
            getDiagnosticoFromCabinet: getDiagnosticoFromCabinet,
            anadirInsumo: anadirInsumo,
            modificarInsumo: modificarInsumo,
            eliminarInsumo: eliminarInsumo,
            consultarInfoCabinet: consultarInfoCabinet,
            consultarInsumobyNombre: consultarInsumobyNombre,
            getCatalogoInsumoById: getCatalogoInsumoById,
            BusquedaCatalogoTypeStep: BusquedaCatalogoTypeStep,
            etapaList: etapaList,
            BusquedaInsumosTypeStep: BusquedaInsumosTypeStep,
            cabinetByEconomic: cabinetByEconomic,
            firstStepByDiagnostic: firstStepByDiagnostic,
            consultarSalidaServicioDiagnostico : consultarSalidaServicioDiagnostico

        };

        var baseModelo = WebRestangular.all(URLS.etapa_servicio);

        function crearEtapaServicio(etapa) {
            baseModelo.customPOST(etapa);
        }


        function editarEtapaServicio(etapa) {
            baseModelo.all(etapa.id).customPUT(etapa);
        }


        function eliminarEtapaServicio(object) {
            return baseModelo.customDELETE(object.id, null, {'content-type': 'application/json'});
        }

        function consultarAllEtapaServicioDiagnostico(etapa) {
            baseModelo.one('diagnostic', etapa.id).customGET();
        }

        function consultarEtapaServicioDiagnostico(diagnostico) {
            baseModelo.all('diagnostic').one('latest', diagnostico.id).customGET();
        }
        function consultarSalidaServicioDiagnostico(diagnostico) {
            baseModelo.all('diagnostic').one('latest', diagnostico.id).customGET();
        }

        function consultarAllInsumosCabinetEtapa(etapa) {
            baseModelo.one('insumos', etapa.id).customGET();
        }


        function getEtapaValidable(idCabinet) {
            var defer = $q.defer();
            getDiagnosticoFromCabinet(idCabinet).then(function (resp) {
                baseModelo.all('diagnostic').all('latest').one('can_validate', resp.id).customGET().then(function (res) {
                    defer.resolve(res);
                }).catch(function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;

        }

        function getDiagnosticoFromCabinet(idCabinet) {
            WebRestangular.all(URLS.diagnostico).all('latest').one(idCabinet).customGET();
        }

        function anadirInsumo(insumo) {
            WebRestangular.all(URLS.insumo_usado).customPOST(insumo);
        }

        function modificarInsumo(insumo) {
            WebRestangular.all(URLS.insumo_usado).one('', insumo.id).customPUT(insumo);
        }

        function eliminarInsumo(insumo) {
            WebRestangular.all(URLS.insumo_usado).one('', insumo.id).customDELETE(insumo.id, null, {'content-type': 'application/json'});
        }

        function consultarInfoCabinet(idcabinet) {
            WebRestangular.one(URLS.cabinet, idcabinet).customGET();
        }

        function consultarInsumobyNombre(cadena) {
            WebRestangular.all(URLS.catalogo_insumos).one('lookup', cadena).customGET();

        }

        function getCatalogoInsumoById(catalogo) {
            WebRestangular.one(URLS.catalogo_insumos, catalogo.id).customGET();

        }

        function consultarInsumosEtapa(etapa) {
            WebRestangular.one('Insumos', etapa.actual_etapa).customGET(etapa);
        }

        //Nuevos Endpoints por nuevos requerimentos y reeconstruccion Etapa Servicio
        function BusquedaCatalogoTypeStep(data) {
            WebRestangular.all(URLS.catalogo_insumos).one('tipo', data.idTipo).all('etapa').customGET(data.idEtapa);
        }

        function BusquedaInsumosTypeStep(data) {
            WebRestangular.all(URLS.insumo).one('tipo', data.idTipo).one('etapa', data.idEtapa).customGET();

        }

        function etapaList() {
            WebRestangular.all(URLS.etapa).customGET();
        }

        function cabinetByEconomic(economico) {
            WebRestangular.all('model').one('cabinet', economico).customGET();

        }

        // /etapa_servicio/first/
        function firstStepByDiagnostic(diagnostico) {
            baseModelo.one('first', diagnostico.id).customGET();
        }


        return service;

    }


})();
