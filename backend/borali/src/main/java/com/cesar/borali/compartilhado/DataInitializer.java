package com.cesar.borali.compartilhado;

import com.cesar.borali.usuario.UsuarioRepository;
import com.cesar.borali.usuario.domain.PerfilUsuario;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.count() == 0) {
            Usuario usuario = new Usuario(
                    "Usuário Padrão",
                    "usuario@borali.com",
                    "senha123",
                    PerfilUsuario.CIDADAO
            );
            usuarioRepository.save(usuario);
            System.out.println("[DataInitializer] Usuário padrão criado com ID: " + usuario.getId());
        }
    }
}
