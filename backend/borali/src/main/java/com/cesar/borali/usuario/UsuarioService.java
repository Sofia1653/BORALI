package com.cesar.borali.usuario;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.categoria.CategoriaService;
import com.cesar.borali.usuario.domain.Usuario;
import com.cesar.borali.usuario.dto.UsuarioRequest;
import com.cesar.borali.usuario.dto.UsuarioResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaService categoriaService;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, CategoriaService categoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.categoriaService = categoriaService;
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("O email informado já está em uso.");
        }

        Usuario usuario = new Usuario(
                request.getNome(),
                request.getEmail(),
                request.getSenha(),
                request.getTipo()
        );

        Usuario salvo = usuarioRepository.save(usuario);
        return UsuarioResponse.de(salvo);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com o ID: " + id));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarDTOPorId(Long id) {
        return UsuarioResponse.de(buscarPorId(id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::de)
                .collect(Collectors.toList());
    }

    public void deletar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }

    public void adicionarAmigo(Long usuarioId, Long amigoId) {
        if (usuarioId.equals(amigoId)) {
            throw new IllegalArgumentException("Um usuário não pode adicionar a si mesmo como amigo.");
        }
        Usuario usuario = buscarPorId(usuarioId);
        Usuario amigo = buscarPorId(amigoId);

        if (!usuario.getAmigos().contains(amigo)) {
            usuario.getAmigos().add(amigo);
            usuarioRepository.save(usuario);
        }
    }

    public void adicionarInteresse(Long usuarioId, Long categoriaId) {
        Usuario usuario = buscarPorId(usuarioId);
        Categoria categoria = categoriaService.buscarPorId(categoriaId);

        if (!usuario.getInteresses().contains(categoria)) {
            usuario.getInteresses().add(categoria);
            usuarioRepository.save(usuario);
        }
    }

    public void removerInteresse(Long usuarioId, Long categoriaId) {
        Usuario usuario = buscarPorId(usuarioId);
        Categoria categoria = categoriaService.buscarPorId(categoriaId);

        if (usuario.getInteresses().contains(categoria)) {
            usuario.getInteresses().remove(categoria);
            usuarioRepository.save(usuario);
        }
    }
}
