package com.api.manager.controller;

import com.api.manager.dto.AnalyticsDTO;
import com.api.manager.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics/{project_id}")
@Tag(name = "AnalyticsController", description = "Контреллер отвечает за работу с аналитикой. Требуется аутентификациия")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/get")
    @PreAuthorize("@inspectGrantedRole.hasSuperUserOrSubSuperUser(#projectId)")
    @ResponseBody
    @Tag(name = "/create", description = "Доступен всем Adm. Получить аналтику.")
    AnalyticsDTO getAnalytics(@PathVariable("project_id") Long projectId) {
        return analyticsService.getAnalytics(projectId);
    }


}
