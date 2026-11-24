{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Task Graph",
  "type": "object",
  "properties": {
    "project": { "type": "string" },
    "stack": { "type": "object" },
    "phases": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" },
          "parallel": { "type": "boolean", "default": true },
          "tasks": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string" },
                "name": { "type": "string" },
                "phase": { "type": "integer" },
                "role": { "type": "string" },
                "prompt": { "type": "string" },
                "deps": { "type": "array", "items": { "type": "string" }, "default": [] },
                "files": { "type": "array", "items": { "type": "string" }, "default": [] },
                "verify": { "type": "string" },
                "status": { "type": "string", "enum": ["pending", "in_progress", "completed", "failed", "blocked"], "default": "pending" },
                "agentId": { "type": "string" },
                "result": { "type": "object" }
              },
              "required": ["id", "name", "phase", "role", "prompt"]
            }
          }
        },
        "required": ["id", "name", "tasks"]
      }
    }
  },
  "required": ["project", "stack", "phases"]
}