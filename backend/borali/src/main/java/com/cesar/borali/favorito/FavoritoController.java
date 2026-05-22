package com.cesar.borali.favorito;

import com.cesar.borali.evento.dto.EventoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    @Autowired
    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @PostMapping
    public ResponseEntity<Void> favoritar(@RequestParam Long usuarioId, @RequestParam Long eventoId) {
        favoritoService.favoritar(usuarioId, eventoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> desfavoritar(@RequestParam Long usuarioId, @RequestParam Long eventoId) {
        favoritoService.desfavoritar(usuarioId, eventoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<EventoResponse>> listarFavoritosUsuario(@PathVariable Long usuarioId) {
        List<EventoResponse> favoritos = favoritoService.listarFavoritosUsuario(usuarioId);
        return ResponseEntity.ok(favoritos);
    }
}
