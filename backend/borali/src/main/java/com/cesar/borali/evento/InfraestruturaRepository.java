package com.cesar.borali.evento;

import com.cesar.borali.evento.domain.Infraestrutura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InfraestruturaRepository extends JpaRepository<Infraestrutura, Long> {
    Optional<Infraestrutura> findByNome(String nome);
}
