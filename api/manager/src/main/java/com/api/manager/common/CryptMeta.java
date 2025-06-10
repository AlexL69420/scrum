package com.api.manager.common;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class CryptMeta {
    private CryptMeta() {
    }

    /*
    private static String SEPARATOR = "/";
    private static StringBuilder stringBuilder = new StringBuilder();

    static public String encodeMap(Map<String, String> values) {
        values.forEach((key, value) -> {
            stringBuilder.append(key);
            stringBuilder.append("=");
            stringBuilder.append(value);
            stringBuilder.append(SEPARATOR);
        });
        String res = Base64.getEncoder().encodeToString(stringBuilder.toString().getBytes());
        stringBuilder.setLength(0);
        return res;
    }

    //ROLE:13/PROJECT:10
    static public Optional<Map<String, String>> decodeValueOfMap(String value) {
        try {
            String string = new String(Base64.getDecoder().decode(value));
            return Optional.of(stringToMap(string));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private static Map<String, String> stringToMap(String val) {
        Map<String, String> map = new HashMap<>();
        Pattern pattern = Pattern.compile("([^/=]+)=([^/=]+)"); // Регулярное выражение
        Matcher matcher = pattern.matcher(val);

        while (matcher.find()) {
            String key = matcher.group(1).trim();
            String value = matcher.group(2).trim();
            map.put(key, value);
        }
        return map;
    }
*/
    private static final String ALGORITHM = "AES";
    private static final byte[] keyBytes = "2257ea6b71e25174ecaf379a6ebfeb24".getBytes(StandardCharsets.UTF_8);
    private static final SecretKey SECRET_KEY = new SecretKeySpec(keyBytes, ALGORITHM);
    private static final StringBuilder stringBuilder = new StringBuilder();
    private static final String SEPARATOR = "/";

    @SneakyThrows
    public static String encryptMap(Map<String, String> values) {
        values.forEach((key, value) -> {
            stringBuilder.append(key);
            stringBuilder.append("=");
            stringBuilder.append(value);
            stringBuilder.append(SEPARATOR);
        });
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, SECRET_KEY);
        byte[] encryptedBytes = cipher.doFinal(stringBuilder.toString().getBytes(StandardCharsets.UTF_8));
        stringBuilder.setLength(0);

        return HexFormat.of().formatHex(encryptedBytes);
    }

    @SneakyThrows
    public static Optional<Map<String, String>> decryptMap(String strToDecrypt) {

        try {
            byte[] decodedBytes = HexFormat.of().parseHex(strToDecrypt);
            log.info(strToDecrypt);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, SECRET_KEY);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            Map<String, String> map = new HashMap<>();
            Pattern pattern = Pattern.compile("([^/=]+)=([^/=]+)"); // Регулярное выражение
            Matcher matcher = pattern.matcher(new String(decryptedBytes, StandardCharsets.UTF_8));
            while (matcher.find()) {
                String key = matcher.group(1).trim();
                String value = matcher.group(2).trim();
                map.put(key, value);
            }
            return Optional.of(map);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
