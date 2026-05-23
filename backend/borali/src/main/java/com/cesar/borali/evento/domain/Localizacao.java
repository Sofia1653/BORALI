package com.cesar.borali.evento.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Embeddable
public class Localizacao {

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String endereco;

    private String bairro;

    public Localizacao(Double latitude, Double longitude, String endereco, String bairro) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.endereco = endereco;
        this.bairro = bairro;
    }
}
