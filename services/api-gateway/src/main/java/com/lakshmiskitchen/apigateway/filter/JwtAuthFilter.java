package com.lakshmiskitchen.apigateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final String secret;

    public JwtAuthFilter(@Value("${jwt.secret}") String secret) {
        this.secret = secret;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        ServerHttpResponse response = exchange.getResponse();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // ---- Browser preflight: let CorsConfig handle it ----
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // ---- PUBLIC routes: no badge needed ----
        boolean isPublic =
                (path.equals("/api/users/register") && method == HttpMethod.POST) ||
                (path.equals("/api/users/login") && method == HttpMethod.POST) ||
                (path.startsWith("/api/menu") && method == HttpMethod.GET);

        if (isPublic) {
            return chain.filter(exchange);
        }

        // ---- Everything else: badge required ----
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        String token = authHeader.substring(7);
        Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        String role = claims.get("role", String.class);

        // ---- ADMIN-only routes ----
        boolean isAdminRoute =
                (path.startsWith("/api/menu") && method != HttpMethod.GET) ||
                (path.contains("/status") && method == HttpMethod.PUT);

        if (isAdminRoute && !"ADMIN".equals(role)) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return response.setComplete();
        }

        // ---- Badge valid: pass identity to services ----
        ServerHttpRequest mutated = request.mutate()
                .header("X-User-Id", claims.getSubject())
                .header("X-User-Role", role)
                .build();

        return chain.filter(exchange.mutate().request(mutated).build());
    }

    @Override
    public int getOrder() {
        return -1;
    }
}