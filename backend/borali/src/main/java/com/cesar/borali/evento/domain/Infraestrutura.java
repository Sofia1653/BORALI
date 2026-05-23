package com.cesar.borali.evento.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_infraestrutura")
public class Infraestrutura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    private String iconeUrl;

    public Infraestrutura(String nome, String iconeUrl) {
        this.nome = nome;
        this.iconeUrl = iconeUrl;
    }
}
