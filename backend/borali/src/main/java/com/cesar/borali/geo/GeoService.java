package com.cesar.borali.geo;

import com.cesar.borali.evento.EventoRepository;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.dto.EventoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GeoService {

    private static final double RAIO_TERRA_KM = 6371.0;
    private final EventoRepository eventoRepository;

    @Autowired
    public GeoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    public List<EventoResponse> buscarEventosProximos(Double latitude, Double longitude, Double raioKm) {
        if (latitude == null || longitude == null || raioKm == null) {
            throw new IllegalArgumentException("Latitude, longitude e raio são obrigatórios.");
        }

        List<Evento> todosEventos = eventoRepository.findAll();

        return todosEventos.stream()
                .filter(evento -> evento.getLocalizacao() != null)
                .filter(evento -> {
                    double distancia = calcularDistanciaHaversine(
                            latitude, longitude,
                            evento.getLocalizacao().getLatitude(),
                            evento.getLocalizacao().getLongitude()
                    );
                    return distancia <= raioKm;
                })
                .map(EventoResponse::de)
                .collect(Collectors.toList());
    }

    public double calcularDistanciaHaversine(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return RAIO_TERRA_KM * c;
    }
}
