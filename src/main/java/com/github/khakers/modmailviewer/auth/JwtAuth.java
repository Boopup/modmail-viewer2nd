package com.github.khakers.modmailviewer.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Base64;

public class JwtAuth {

    private static final Logger logger = LogManager.getLogger();

    private final Algorithm algorithm;

    private static JWTVerifier jwtVerifier;

    public JwtAuth(String secret) {
        this.algorithm = Algorithm.HMAC256(secret);
        jwtVerifier = JWT
                .require(algorithm)
                .build();

    }

    public String generateJWT(UserToken user, long[] roles) {
        return JWT.create()
                .withClaim("username", user.username)
                .withClaim("id", user.id)
                .withClaim("discriminator", user.discriminator)
                .withClaim("avatar", user.getAvatar().orElse(null))
                .withArrayClaim("roles", Arrays.stream(roles).boxed().toArray(Long[]::new))
                .withIssuedAt(Instant.now())
                .withExpiresAt(Instant.now().plus(3, ChronoUnit.HOURS))
                .sign(algorithm);
    }

    public static String verifyJWT(String jwt) throws JWTVerificationException {
        var decodedJWT = jwtVerifier.verify(jwt);
        return new String(Base64.getDecoder().decode(decodedJWT.getPayload()));
    }

    public static UserToken decodeAndVerifyJWT(String jwt, ObjectMapper objectMapper) throws JsonProcessingException, JWTVerificationException {
        var decodedJWT = jwtVerifier.verify(jwt);
        var string = new String(Base64.getDecoder().decode(decodedJWT.getPayload()));
        logger.trace("jwt decoded as {}", string);
        return objectMapper.readValue(string, UserToken.class);
    }


}
