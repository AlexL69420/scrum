package com.api.manager.common;

import com.api.manager.common.GrantedRole;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class GrantedRoleConverter implements AttributeConverter<GrantedRole, String> {


    @Override
    public String convertToDatabaseColumn(GrantedRole grantedRole) {
        return grantedRole.name();
    }

    @Override
    public GrantedRole convertToEntityAttribute(String s) {
        return GrantedRole.valueOf(s);
    }
}
