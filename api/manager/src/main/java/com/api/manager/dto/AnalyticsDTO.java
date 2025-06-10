package com.api.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsDTO {
    @NonNull
    private Integer countTask;
    @NonNull
    private Integer countTaskInToDo;
    @NonNull
    private Integer countTaskCompleted;
    @NonNull
    private String sprintCompletedPer;
}
