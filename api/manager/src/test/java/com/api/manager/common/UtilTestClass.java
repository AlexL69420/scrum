package com.api.manager.common;

import com.api.manager.auth.RegAuth;
import org.springframework.stereotype.Component;


public class UtilTestClass {


    public static   RegAuth userAuthDefaultValidT() {
        RegAuth regAuthDefaultValid = new RegAuth();
        regAuthDefaultValid.setPassword("12345678");
        regAuthDefaultValid.setName("test423");
        regAuthDefaultValid.setLogin("test3422");
        return regAuthDefaultValid;
    }

}
