package com.cesar.borali.evento.domain;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.usuario.domain.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_evento")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private Double preco;

    private String linkExterno;

    @ManyToOne
    @JoinColumn(name = "organizador_id", nullable = false)
    private Usuario organizador;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "localizacao_id", nullable = false)
    private Localizacao localizacao;

    @ManyToMany
    @JoinTable(
        name = "tb_evento_categoria",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<Categoria> categorias = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "tb_evento_infra",
        joinColumns = @JoinColumn(name = "evento_id"),
        inverseJoinColumns = @JoinColumn(name = "infraestrutura_id")
    )
    private List<Infraestrutura> infraestruturas = new ArrayList<>();

    public Evento(String nome, String descricao, LocalDateTime dataHora, Double preco, Usuario organizador, Localizacao localizacao) {
        this.nome = nome;
        this.descricao = descricao;
        this.dataHora = dataHora;
        this.preco = preco;
        this.organizador = organizador;
        this.localizacao = localizacao;
    }

    public boolean isGratuito() {
        return this.preco == null || this.preco <= 0.0;
    }
}
