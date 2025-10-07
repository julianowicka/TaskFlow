package com.taskflow.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String columnId;
    private String boardId;
    private String assigneeId;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private List<TaskLabel> labels;
    private List<ChecklistItem> checklist;
    private List<TaskComment> comments;
    private List<String> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Enums
    public enum TaskPriority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    public enum TaskStatus {
        TODO, IN_PROGRESS, REVIEW, DONE
    }
    
    // Nested classes
    public static class TaskLabel {
        private String id;
        private String name;
        private String color;
        
        // Constructors, getters, setters
        public TaskLabel() {}
        
        public TaskLabel(String name, String color) {
            this.name = name;
            this.color = color;
        }
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
    
    public static class ChecklistItem {
        private String id;
        private String text;
        private boolean isCompleted;
        private LocalDateTime createdAt;
        
        // Constructors, getters, setters
        public ChecklistItem() {
            this.createdAt = LocalDateTime.now();
        }
        
        public ChecklistItem(String text) {
            this();
            this.text = text;
        }
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public boolean isCompleted() { return isCompleted; }
        public void setCompleted(boolean completed) { isCompleted = completed; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
    
    public static class TaskComment {
        private String id;
        private String taskId;
        private String userId;
        private String text;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        // Constructors, getters, setters
        public TaskComment() {
            this.createdAt = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
        }
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTaskId() { return taskId; }
        public void setTaskId(String taskId) { this.taskId = taskId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
    
    // Constructors
    public Task() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.priority = TaskPriority.MEDIUM;
        this.status = TaskStatus.TODO;
    }
    
    public Task(String title, String columnId, String boardId) {
        this();
        this.title = title;
        this.columnId = columnId;
        this.boardId = boardId;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getColumnId() {
        return columnId;
    }
    
    public void setColumnId(String columnId) {
        this.columnId = columnId;
    }
    
    public String getBoardId() {
        return boardId;
    }
    
    public void setBoardId(String boardId) {
        this.boardId = boardId;
    }
    
    public String getAssigneeId() {
        return assigneeId;
    }
    
    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }
    
    public TaskPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public List<TaskLabel> getLabels() {
        return labels;
    }
    
    public void setLabels(List<TaskLabel> labels) {
        this.labels = labels;
    }
    
    public List<ChecklistItem> getChecklist() {
        return checklist;
    }
    
    public void setChecklist(List<ChecklistItem> checklist) {
        this.checklist = checklist;
    }
    
    public List<TaskComment> getComments() {
        return comments;
    }
    
    public void setComments(List<TaskComment> comments) {
        this.comments = comments;
    }
    
    public List<String> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
