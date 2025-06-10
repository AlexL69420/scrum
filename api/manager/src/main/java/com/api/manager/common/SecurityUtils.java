package com.api.manager.common;

import com.api.manager.auth.UserDetailImpl;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Objects;

public class SecurityUtils {
    public static UserDetailImpl getCurrentUserDetail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (!Objects.isNull(authentication) && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                return (UserDetailImpl) principal;
            }
        }

        throw new AuthenticationCredentialsNotFoundException("Credentials not found");
    }
}
