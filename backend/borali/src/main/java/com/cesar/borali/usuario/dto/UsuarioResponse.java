package com.cesar.borali.usuario.dto;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.usuario.domain.PerfilUsuario;
import com.cesar.borali.usuario.domain.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nome;
    private String email;
    private PerfilUsuario tipo;
    private List<Categoria> interesses;

    public static UsuarioResponse de(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipo(),
                usuario.getInteresses()
        );
    }
}
