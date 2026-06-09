package com.cesar.borali.compartilhado;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.categoria.CategoriaRepository;
import com.cesar.borali.evento.EventoRepository;
import com.cesar.borali.evento.domain.Evento;
import com.cesar.borali.evento.domain.Localizacao;
import com.cesar.borali.usuario.UsuarioRepository;
import com.cesar.borali.usuario.domain.PerfilUsuario;
import com.cesar.borali.usuario.domain.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;

    @Autowired
    public DatabaseSeeder(
            CategoriaRepository categoriaRepository,
            UsuarioRepository usuarioRepository,
            EventoRepository eventoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() == 0) {
            seedCategorias();
        }
        if (usuarioRepository.count() == 0) {
            seedUsuarios();
        }
        if (eventoRepository.count() == 0) {
            seedEventos();
        }
    }

    private void seedCategorias() {
        List<Categoria> categorias = Arrays.asList(
                new Categoria("Música"),
                new Categoria("Teatro"),
                new Categoria("Arte"),
                new Categoria("Cinema"),
                new Categoria("Dança")
        );
        categoriaRepository.saveAll(categorias);
    }

    private void seedUsuarios() {
        Usuario sofia = new Usuario("Sofia", "sofia@borali.com", "admin", PerfilUsuario.CIDADAO);
        usuarioRepository.save(sofia);
    }

    private void seedEventos() {
        Usuario organizador = usuarioRepository.findAll().stream()
                .filter(u -> u.getNome().equals("Sofia"))
                .findFirst()
                .orElse(null);

        if (organizador == null) {
            return;
        }

        Categoria musica = categoriaRepository.findByNome("Música").orElse(null);
        Categoria teatro = categoriaRepository.findByNome("Teatro").orElse(null);
        Categoria arte = categoriaRepository.findByNome("Arte").orElse(null);
        Categoria cinema = categoriaRepository.findByNome("Cinema").orElse(null);

        // Evento 1: Marco Zero
        Evento e1 = new Evento(
                "Festival de Jazz do Recife",
                "Um festival incrível com grandes nomes da música instrumental e do jazz, aberto ao público no coração do Recife Antigo.",
                LocalDateTime.now().plusDays(5).withHour(18).withMinute(0),
                0.0,
                organizador,
                new Localizacao(-8.0631, -34.8711, "Praça Rio Branco (Marco Zero), s/n", "Recife Antigo")
        );
        if (musica != null) e1.getCategorias().add(musica);

        // Evento 2: Parque da Jaqueira
        Evento e2 = new Evento(
                "Teatro Infantil no Parque",
                "Uma tarde mágica de contação de histórias e teatro de fantoches para as crianças no Parque da Jaqueira.",
                LocalDateTime.now().plusDays(2).withHour(16).withMinute(0),
                0.0,
                organizador,
                new Localizacao(-8.0351, -34.9001, "Parque da Jaqueira, s/n", "Jaqueira")
        );
        if (teatro != null) e2.getCategorias().add(teatro);

        // Evento 3: Cinema da Fundação Derby
        Evento e3 = new Evento(
                "Mostra de Cinema Francês",
                "Exibição especial de clássicos do cinema francês contemporâneo com debates pós-sessão.",
                LocalDateTime.now().plusDays(3).withHour(19).withMinute(30),
                10.0,
                organizador,
                new Localizacao(-8.0577, -34.8981, "Rua Henrique Dias, 609", "Derby")
        );
        if (cinema != null) e3.getCategorias().add(cinema);

        // Evento 4: Teatro de Santa Isabel
        Evento e4 = new Evento(
                "Concerto Sinfônico",
                "Apresentação da Orquestra Sinfônica do Recife executando a Nona Sinfonia de Beethoven no histórico Teatro de Santa Isabel.",
                LocalDateTime.now().plusDays(10).withHour(20).withMinute(0),
                0.0,
                organizador,
                new Localizacao(-8.0608, -34.8778, "Praça da República, s/n", "Santo Antônio")
        );
        if (musica != null) e4.getCategorias().add(musica);
        if (arte != null) e4.getCategorias().add(arte);

        eventoRepository.saveAll(Arrays.asList(e1, e2, e3, e4));
    }
}
