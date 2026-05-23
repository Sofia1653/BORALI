package com.cesar.borali.favorito;

import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.usuario.domain.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_favorito")
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    public Favorito(Usuario usuario, Evento evento) {
        this.usuario = usuario;
        this.evento = evento;
    }
}
