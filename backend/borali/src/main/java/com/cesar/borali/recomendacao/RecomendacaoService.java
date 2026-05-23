package com.cesar.borali.recomendacao;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.evento.EventoRepository;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.dto.EventoResponse;
import com.cesar.borali.usuario.UsuarioService;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecomendacaoService {

    private final UsuarioService usuarioService;
    private final EventoRepository eventoRepository;

    @Autowired
    public RecomendacaoService(UsuarioService usuarioService, EventoRepository eventoRepository) {
        this.usuarioService = usuarioService;
        this.eventoRepository = eventoRepository;
    }

    public List<EventoResponse> obterRecomendacoes(Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        List<Categoria> interesses = usuario.getInteresses();

        List<Evento> todosEventos = eventoRepository.findAll();

        if (interesses.isEmpty()) {
            // Se o usuário não tiver interesses explícitos, recomendamos os eventos mais recentes/todos
            return todosEventos.stream()
                    .limit(10)
                    .map(EventoResponse::de)
                    .collect(Collectors.toList());
        }

        // Filtra eventos que compartilham de pelo menos uma categoria de interesse do usuário
        List<Long> interesseIds = interesses.stream().map(Categoria::getId).collect(Collectors.toList());

        return todosEventos.stream()
                .filter(evento -> evento.getCategorias().stream()
                        .anyMatch(cat -> interesseIds.contains(cat.getId())))
                .map(EventoResponse::de)
                .collect(Collectors.toList());
    }
}
