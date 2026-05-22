package com.cesar.borali.repositories;

import com.cesar.borali.models.Infraestrutura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InfraestruturaRepository extends JpaRepository<Infraestrutura, Long> {
}
