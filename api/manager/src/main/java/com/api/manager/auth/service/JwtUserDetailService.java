package com.api.manager.auth.service;

import com.api.manager.auth.RegAuth;
import com.api.manager.auth.UserDetailImpl;
import com.api.manager.common.BaseService;
import com.api.manager.exception_handler_contoller.NotSavedStoreUserException;
import com.api.manager.entity.UserDb;
import com.api.manager.repository.UserRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Objects;

@Service
public class JwtUserDetailService extends BaseService<UserRepository, UserDb, Long> implements UserDetailsService {
    private final PasswordEncoder passwordEncoder;

    JwtUserDetailService(UserRepository repository, PasswordEncoder passwordEncoder) {
        super(repository);
        this.passwordEncoder = passwordEncoder;
    }

    public void save(RegAuth regAuth) {
        UserDb userDb = new UserDb();
        userDb.setName(regAuth.getName());
        userDb.setLogin(regAuth.getLogin());
        userDb.setPassword(passwordEncoder.encode(regAuth.getPassword()));

        try {
            super.save(userDb);
        } catch (DataAccessException ex) {
            throw new NotSavedStoreUserException("Пользователь с таким логином уже есть в системе", ex);
        }
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            UserDb userDb = getRepository().getUserByLogin(username);
            Objects.requireNonNull(userDb);
            return new UserDetailImpl(userDb.getLogin(), userDb.getName(), userDb.getId(), userDb.getPassword(), new ArrayList<>());
        } catch (Exception ex) {
            throw new UsernameNotFoundException("Пользователь не найден");
        }
    }
}
