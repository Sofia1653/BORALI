package com.cesar.borali.evento;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.categoria.CategoriaRepository;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.domain.Infraestrutura;
import com.cesar.borali.evento.domain.Localizacao;
import com.cesar.borali.evento.dto.EventoRequest;
import com.cesar.borali.evento.dto.EventoResponse;
import com.cesar.borali.usuario.UsuarioService;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class EventoService {

    private final EventoRepository eventoRepository;
    private final InfraestruturaRepository infraestruturaRepository;
    private final CategoriaRepository categoriaRepository;
    private final UsuarioService usuarioService;

    @Autowired
    public EventoService(
            EventoRepository eventoRepository,
            InfraestruturaRepository infraestruturaRepository,
            CategoriaRepository categoriaRepository,
            UsuarioService usuarioService) {
        this.eventoRepository = eventoRepository;
        this.infraestruturaRepository = infraestruturaRepository;
        this.categoriaRepository = categoriaRepository;
        this.usuarioService = usuarioService;
    }

    public EventoResponse criar(EventoRequest request) {
        Usuario organizador = usuarioService.buscarPorId(request.getOrganizadorId());

        Localizacao loc = new Localizacao(
                request.getLatitude(),
                request.getLongitude(),
                request.getEndereco(),
                request.getBairro()
        );

        Evento evento = new Evento(
                request.getNome(),
                request.getDescricao(),
                request.getDataHora(),
                request.getPreco(),
                organizador,
                loc
        );
        evento.setLinkExterno(request.getLinkExterno());

        if (request.getCategoriaIds() != null) {
            for (Long catId : request.getCategoriaIds()) {
                Categoria cat = categoriaRepository.findById(catId)
                        .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada com o ID: " + catId));
                evento.getCategorias().add(cat);
            }
        }

        if (request.getInfraestruturaIds() != null) {
            for (Long infraId : request.getInfraestruturaIds()) {
                Infraestrutura infra = infraestruturaRepository.findById(infraId)
                        .orElseThrow(() -> new IllegalArgumentException("Infraestrutura não encontrada com o ID: " + infraId));
                evento.getInfraestruturas().add(infra);
            }
        }

        Evento salvo = eventoRepository.save(evento);
        return EventoResponse.de(salvo);
    }

    @Transactional(readOnly = true)
    public Evento buscarPorId(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado com o ID: " + id));
    }

    @Transactional(readOnly = true)
    public EventoResponse buscarDTOPorId(Long id) {
        return EventoResponse.de(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<EventoResponse> listarTodos() {
        return eventoRepository.findAll().stream()
                .map(EventoResponse::de)
                .collect(Collectors.toList());
    }

    public void deletar(Long id) {
        Evento evento = buscarPorId(id);
        eventoRepository.delete(evento);
    }
}
