package com.cesar.borali.usuario;

import com.cesar.borali.usuario.dto.UsuarioRequest;
import com.cesar.borali.usuario.dto.UsuarioResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@Valid @RequestBody UsuarioRequest request) {
        UsuarioResponse response = usuarioService.criar(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        UsuarioResponse response = usuarioService.buscarDTOPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        List<UsuarioResponse> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/amigos/{amigoId}")
    public ResponseEntity<Void> adicionarAmigo(@PathVariable Long id, @PathVariable Long amigoId) {
        usuarioService.adicionarAmigo(id, amigoId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/interesses/{categoriaId}")
    public ResponseEntity<Void> adicionarInteresse(@PathVariable Long id, @PathVariable Long categoriaId) {
        usuarioService.adicionarInteresse(id, categoriaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/interesses/{categoriaId}")
    public ResponseEntity<Void> removerInteresse(@PathVariable Long id, @PathVariable Long categoriaId) {
        usuarioService.removerInteresse(id, categoriaId);
        return ResponseEntity.ok().build();
    }
}
