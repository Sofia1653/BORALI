package com.cesar.borali.evento.dto;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.domain.Infraestrutura;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoResponse {
    private Long id;
    private String nome;
    private String descricao;
    private LocalDateTime dataHora;
    private Double preco;
    private String linkExterno;
    private String organizadorNome;
    private String endereco;
    private String bairro;
    private Double latitude;
    private Double longitude;
    private List<String> categorias;
    private List<String> infraestruturas;

    public static EventoResponse de(Evento evento) {
        return new EventoResponse(
                evento.getId(),
                evento.getNome(),
                evento.getDescricao(),
                evento.getDataHora(),
                evento.getPreco(),
                evento.getLinkExterno(),
                evento.getOrganizador() != null ? evento.getOrganizador().getNome() : null,
                evento.getLocalizacao() != null ? evento.getLocalizacao().getEndereco() : null,
                evento.getLocalizacao() != null ? evento.getLocalizacao().getBairro() : null,
                evento.getLocalizacao() != null ? evento.getLocalizacao().getLatitude() : null,
                evento.getLocalizacao() != null ? evento.getLocalizacao().getLongitude() : null,
                evento.getCategorias().stream().map(Categoria::getNome).collect(Collectors.toList()),
                evento.getInfraestruturas().stream().map(Infraestrutura::getNome).collect(Collectors.toList())
        );
    }
}
