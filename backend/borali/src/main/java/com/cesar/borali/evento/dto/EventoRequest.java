package com.cesar.borali.evento.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoRequest {

    @NotBlank(message = "O nome do evento é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "A data e hora do evento são obrigatórias")
    private LocalDateTime dataHora;

    private Double preco;

    private String linkExterno;

    @NotNull(message = "O ID do organizador é obrigatório")
    private Long organizadorId;

    @NotNull(message = "A latitude é obrigatória")
    private Double latitude;

    @NotNull(message = "A longitude é obrigatória")
    private Double longitude;

    @NotBlank(message = "O endereço é obrigatório")
    private String endereco;

    private String bairro;

    private List<Long> categoriaIds = new ArrayList<>();

    private List<Long> infraestruturaIds = new ArrayList<>();
}
