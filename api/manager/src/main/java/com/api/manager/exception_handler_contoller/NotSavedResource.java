package com.api.manager.exception_handler_contoller;

import org.springframework.dao.DataAccessException;

import java.util.Objects;

public class NotSavedResource extends DataAccessException {
    public NotSavedResource(String message, Throwable throwable) {
        super(message, Objects.requireNonNull(throwable));
    }
}
