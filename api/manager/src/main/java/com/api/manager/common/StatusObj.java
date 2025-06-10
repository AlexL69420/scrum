package com.api.manager.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum StatusObj {
    @JsonProperty("TO_DO")
    TO_DO,
    @JsonProperty("COMPLETE")
    COMPLETE,
    @JsonProperty("EXPIRED")
    EXPIRED

}