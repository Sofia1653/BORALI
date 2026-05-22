package com.cesar.borali.favorito;

import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    Optional<Favorito> findByUsuarioAndEvento(Usuario usuario, Evento evento);
    List<Favorito> findAllByUsuario(Usuario usuario);
}
