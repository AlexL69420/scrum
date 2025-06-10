package com.api.manager.exception_handler_contoller;

import jakarta.annotation.Nullable;
import org.springframework.dao.DataAccessException;

import java.util.Objects;

public class NotGetObjException extends DataAccessException {
    public NotGetObjException(String message,Throwable throwable) {
        super(message, Objects.requireNonNull(throwable));
    }
}
