package com.api.manager.auth;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UserDetailImpl extends User {

    @Getter
    private final Long id;
    @Getter
    private final String name;

    public UserDetailImpl(String login, String name, Long ID, String password, Collection<? extends GrantedAuthority> authorities) {
        super(login, password, authorities);
        this.id = ID;
        this.name = name;
    }
}
