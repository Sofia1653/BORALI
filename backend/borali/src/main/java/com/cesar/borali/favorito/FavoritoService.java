package com.cesar.borali.favorito;

import com.cesar.borali.evento.EventoService;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.dto.EventoResponse;
import com.cesar.borali.usuario.UsuarioService;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioService usuarioService;
    private final EventoService eventoService;

    @Autowired
    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioService usuarioService,
            EventoService eventoService) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioService = usuarioService;
        this.eventoService = eventoService;
    }

    public void favoritar(Long usuarioId, Long eventoId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        Evento evento = eventoService.buscarPorId(eventoId);

        Optional<Favorito> existente = favoritoRepository.findByUsuarioAndEvento(usuario, evento);
        if (existente.isEmpty()) {
            Favorito favorito = new Favorito(usuario, evento);
            favoritoRepository.save(favorito);

            // Sincroniza a lista bidirecional legada/paralela
            if (!usuario.getEventosFavoritos().contains(evento)) {
                usuario.getEventosFavoritos().add(evento);
            }
        }
    }

    public void desfavoritar(Long usuarioId, Long eventoId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        Evento evento = eventoService.buscarPorId(eventoId);

        Favorito favorito = favoritoRepository.findByUsuarioAndEvento(usuario, evento)
                .orElseThrow(() -> new IllegalArgumentException("Favorito não encontrado para esta relação."));
        
        favoritoRepository.delete(favorito);

        // Remove da lista paralela do usuário
        usuario.getEventosFavoritos().remove(evento);
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarFavoritosUsuario(Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        List<Favorito> favoritos = favoritoRepository.findAllByUsuario(usuario);
        return favoritos.stream()
                .map(f -> EventoResponse.de(f.getEvento()))
                .collect(Collectors.toList());
    }
}
