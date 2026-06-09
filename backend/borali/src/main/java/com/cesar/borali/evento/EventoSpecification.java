package com.cesar.borali.evento;

import com.cesar.borali.categoria.Categoria;
import com.cesar.borali.evento.domain.Evento;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class EventoSpecification {

    public static Specification<Evento> distinct() {
        return (root, query, cb) -> {
            query.distinct(true);
            return null;
        };
    }

    public static Specification<Evento> nomeOuDescricaoContem(String palavraChave) {
        return (root, query, cb) -> {
            if (palavraChave == null || palavraChave.isBlank()) {
                return null;
            }
            String likePattern = "%" + palavraChave.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("nome")), likePattern),
                    cb.like(cb.lower(root.get("descricao")), likePattern));
        };
    }

    public static Specification<Evento> temCategoria(Long categoriaId) {
        return (root, query, cb) -> {
            if (categoriaId == null) {
                return null;
            }
            Join<Evento, Categoria> join = root.join("categorias");
            return cb.equal(join.get("id"), categoriaId);
        };
    }

    public static Specification<Evento> temCategoriaNome(String categoriaNome) {
        return (root, query, cb) -> {
            if (categoriaNome == null || categoriaNome.isBlank()) {
                return null;
            }
            Join<Evento, Categoria> join = root.join("categorias");
            return cb.equal(cb.lower(join.get("nome")), categoriaNome.trim().toLowerCase());
        };
    }

    public static Specification<Evento> noIntervaloDeDatas(LocalDateTime dataInicio, LocalDateTime dataFim) {
        return (root, query, cb) -> {
            if (dataInicio == null && dataFim == null) {
                return null;
            }
            if (dataInicio != null && dataFim != null) {
                return cb.between(root.get("dataHora"), dataInicio, dataFim);
            } else if (dataInicio != null) {
                return cb.greaterThanOrEqualTo(root.get("dataHora"), dataInicio);
            } else {
                return cb.lessThanOrEqualTo(root.get("dataHora"), dataFim);
            }
        };
    }
}
