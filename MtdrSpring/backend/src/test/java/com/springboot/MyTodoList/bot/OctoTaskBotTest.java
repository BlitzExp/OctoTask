package com.springboot.MyTodoList.bot;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

// Importing your actual architecture classes
import com.springboot.MyTodoList.services.BotOrchestratorService;
import com.springboot.MyTodoList.services.GeminiAiService;
import com.springboot.MyTodoList.services.TelegramService;
import com.springboot.MyTodoList.services.botTools.BotTool;

@ExtendWith(MockitoExtension.class)
public class OctoTaskBotTest {

    // 1. Mock the AI and Telegram APIs
    @Mock private GeminiAiService geminiAiService;
    @Mock private TelegramService telegramService;

    // 2. Mock the dynamic tools your orchestrator uses
    @Mock private BotTool createTaskTool;
    @Mock private BotTool getSprintTasksTool;
    @Mock private BotTool getUserSprintTasksTool;

    // We can use a real ObjectMapper since it's just a JSON utility
    private ObjectMapper objectMapper = new ObjectMapper();
    
    // The class we are actually testing
    private BotOrchestratorService orchestrator;

    @BeforeEach
    void setUp() {
        // Teach our mock tools what their names are so the Orchestrator can put them in the map
        when(createTaskTool.getToolName()).thenReturn("createTask");
        when(getSprintTasksTool.getToolName()).thenReturn("getSprintTasks");
        when(getUserSprintTasksTool.getToolName()).thenReturn("getUserSprintTasks");

        List<BotTool> mockTools = Arrays.asList(createTaskTool, getSprintTasksTool, getUserSprintTasksTool);

        // Inject the mocks into the orchestrator
        orchestrator = new BotOrchestratorService(geminiAiService, telegramService, mockTools, objectMapper);
    }

    @Test
    public void testCrearTarea() throws Exception {
        Long chatId = 12345L;
        String userMessage = "/creartarea Terminar el frontend";

        // MOCK THE AI: Force Gemini to decide it needs the "createTask" tool
        when(geminiAiService.askGemini(anyString()))
            .thenReturn("TOOL_REQUESTED|createTask|{\"name\": \"Terminar el frontend\"}");
            
        // MOCK THE AI SUMMARIZER: What Gemini says after the tool finishes
        when(geminiAiService.summarizeData(anyString(), anyString()))
            .thenReturn("¡Tarea creada exitosamente en la base de datos!");

        // ACT: Run the orchestrator
        orchestrator.processIncomingMessage(chatId, userMessage);

        // ASSERT: Verify the orchestrator triggered the right tool and sent the Telegram message
        verify(createTaskTool, times(1)).execute(any(JsonNode.class));
        verify(telegramService, times(1)).sendMessage(eq(chatId), eq("¡Tarea creada exitosamente en la base de datos!"));
    }

    @Test
    public void testVerTareasCompletadasDeUnSprint() throws Exception {
        Long chatId = 12345L;
        String userMessage = "¿Cuáles son las tareas completadas del sprint 3?";

        // Force Gemini to pick the sprint tool
        when(geminiAiService.askGemini(anyString()))
            .thenReturn("TOOL_REQUESTED|getSprintTasks|{\"sprintId\": 3}");
            
        when(geminiAiService.summarizeData(anyString(), anyString()))
            .thenReturn("Aquí están las tareas del sprint 3...");

        orchestrator.processIncomingMessage(chatId, userMessage);

        // Verify the sprint tool was executed
        verify(getSprintTasksTool, times(1)).execute(any(JsonNode.class));
        verify(telegramService, times(1)).sendMessage(eq(chatId), eq("Aquí están las tareas del sprint 3..."));
    }

    @Test
    public void testVerTareasCompletadasDeUsuarioEnSprint() throws Exception {
        Long chatId = 12345L;
        String userMessage = "Dame mis tareas completadas del sprint 3 (soy Diego)";

        // Force Gemini to pick the specific user-sprint tool
        when(geminiAiService.askGemini(anyString()))
            .thenReturn("TOOL_REQUESTED|getUserSprintTasks|{\"userName\": \"Diego\", \"sprintId\": 3}");
            
        when(geminiAiService.summarizeData(anyString(), anyString()))
            .thenReturn("Diego, completaste 2 tareas en el sprint 3.");

        orchestrator.processIncomingMessage(chatId, userMessage);

        // Verify the user-sprint tool was executed
        verify(getUserSprintTasksTool, times(1)).execute(any(JsonNode.class));
        verify(telegramService, times(1)).sendMessage(eq(chatId), eq("Diego, completaste 2 tareas en el sprint 3."));
    }
}