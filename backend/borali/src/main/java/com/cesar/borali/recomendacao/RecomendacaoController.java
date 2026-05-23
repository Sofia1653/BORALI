package com.cesar.borali.recomendacao;

import com.cesar.borali.evento.dto.EventoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/eventos/recomendados")
public class RecomendacaoController {

    private final RecomendacaoService recomendacaoService;

    @Autowired
    public RecomendacaoController(RecomendacaoService recomendacaoService) {
        this.recomendacaoService = recomendacaoService;
    }

    @GetMapping
    public ResponseEntity<List<EventoResponse>> obterRecomendacoes(@RequestParam Long usuarioId) {
        List<EventoResponse> recomendacoes = recomendacaoService.obterRecomendacoes(usuarioId);
        return ResponseEntity.ok(recomendacoes);
    }
}
