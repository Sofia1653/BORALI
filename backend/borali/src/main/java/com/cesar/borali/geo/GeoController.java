package com.cesar.borali.geo;

import com.cesar.borali.evento.dto.EventoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/eventos/proximos")
public class GeoController {

    private final GeoService geoService;

    @Autowired
    public GeoController(GeoService geoService) {
        this.geoService = geoService;
    }

    @GetMapping
    public ResponseEntity<List<EventoResponse>> buscarEventosProximos(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10.0") Double raio) {
        
        List<EventoResponse> proximos = geoService.buscarEventosProximos(latitude, longitude, raio);
        return ResponseEntity.ok(proximos);
    }
}
