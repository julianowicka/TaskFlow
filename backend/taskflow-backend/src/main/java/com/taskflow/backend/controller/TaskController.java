package com.taskflow.backend.controller;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.ColumnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private ColumnRepository columnRepository;
    
    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<Task>> getTasksByBoard(@PathVariable String boardId) {
        List<Task> tasks = taskRepository.findByBoardId(boardId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/column/{columnId}")
    public ResponseEntity<List<Task>> getTasksByColumn(@PathVariable String columnId) {
        List<Task> tasks = taskRepository.findByColumnId(columnId);
        return ResponseEntity.ok(tasks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        Task savedTask = taskRepository.save(task);
        
        // Update column's taskIds
        Optional<com.taskflow.backend.model.Column> columnOptional = columnRepository.findById(task.getColumnId());
        if (columnOptional.isPresent()) {
            com.taskflow.backend.model.Column column = columnOptional.get();
            List<String> taskIds = column.getTaskIds();
            if (taskIds == null) {
                taskIds = new java.util.ArrayList<>();
            }
            taskIds.add(savedTask.getId());
            column.setTaskIds(taskIds);
            column.setUpdatedAt(LocalDateTime.now());
            columnRepository.save(column);
        }
        
        return ResponseEntity.ok(savedTask);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            
            // If column is changing, update both columns
            if (taskDetails.getColumnId() != null && !taskDetails.getColumnId().equals(task.getColumnId())) {
                String oldColumnId = task.getColumnId();
                String newColumnId = taskDetails.getColumnId();
                
                // Remove from old column
                Optional<com.taskflow.backend.model.Column> oldColumnOptional = columnRepository.findById(oldColumnId);
                if (oldColumnOptional.isPresent()) {
                    com.taskflow.backend.model.Column oldColumn = oldColumnOptional.get();
                    List<String> oldTaskIds = oldColumn.getTaskIds();
                    if (oldTaskIds != null) {
                        oldTaskIds.remove(id);
                        oldColumn.setTaskIds(oldTaskIds);
                        oldColumn.setUpdatedAt(LocalDateTime.now());
                        columnRepository.save(oldColumn);
                    }
                }
                
                // Add to new column
                Optional<com.taskflow.backend.model.Column> newColumnOptional = columnRepository.findById(newColumnId);
                if (newColumnOptional.isPresent()) {
                    com.taskflow.backend.model.Column newColumn = newColumnOptional.get();
                    List<String> newTaskIds = newColumn.getTaskIds();
                    if (newTaskIds == null) {
                        newTaskIds = new java.util.ArrayList<>();
                    }
                    newTaskIds.add(id);
                    newColumn.setTaskIds(newTaskIds);
                    newColumn.setUpdatedAt(LocalDateTime.now());
                    columnRepository.save(newColumn);
                }
            }
            
            // Update task fields
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setColumnId(taskDetails.getColumnId());
            task.setAssigneeId(taskDetails.getAssigneeId());
            task.setPriority(taskDetails.getPriority());
            task.setStatus(taskDetails.getStatus());
            task.setDueDate(taskDetails.getDueDate());
            task.setLabels(taskDetails.getLabels());
            task.setChecklist(taskDetails.getChecklist());
            task.setComments(taskDetails.getComments());
            task.setAttachments(taskDetails.getAttachments());
            task.setUpdatedAt(LocalDateTime.now());
            
            Task updatedTask = taskRepository.save(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            
            // Remove from column's taskIds
            Optional<com.taskflow.backend.model.Column> columnOptional = columnRepository.findById(task.getColumnId());
            if (columnOptional.isPresent()) {
                com.taskflow.backend.model.Column column = columnOptional.get();
                List<String> taskIds = column.getTaskIds();
                if (taskIds != null) {
                    taskIds.remove(id);
                    column.setTaskIds(taskIds);
                    column.setUpdatedAt(LocalDateTime.now());
                    columnRepository.save(column);
                }
            }
            
            taskRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/checklist")
    public ResponseEntity<Task> addChecklistItem(@PathVariable String id, @RequestBody Task.ChecklistItem item) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Task.ChecklistItem> checklist = task.getChecklist();
            if (checklist == null) {
                checklist = new java.util.ArrayList<>();
            }
            item.setId(java.util.UUID.randomUUID().toString());
            item.setCreatedAt(LocalDateTime.now());
            checklist.add(item);
            task.setChecklist(checklist);
            task.setUpdatedAt(LocalDateTime.now());
            Task updatedTask = taskRepository.save(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/checklist/{itemId}")
    public ResponseEntity<Task> updateChecklistItem(@PathVariable String id, @PathVariable String itemId, @RequestBody Task.ChecklistItem item) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Task.ChecklistItem> checklist = task.getChecklist();
            if (checklist != null) {
                for (int i = 0; i < checklist.size(); i++) {
                    if (checklist.get(i).getId().equals(itemId)) {
                        checklist.set(i, item);
                        break;
                    }
                }
                task.setChecklist(checklist);
                task.setUpdatedAt(LocalDateTime.now());
                Task updatedTask = taskRepository.save(task);
                return ResponseEntity.ok(updatedTask);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}/checklist/{itemId}")
    public ResponseEntity<Task> deleteChecklistItem(@PathVariable String id, @PathVariable String itemId) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            List<Task.ChecklistItem> checklist = task.getChecklist();
            if (checklist != null) {
                checklist.removeIf(item -> item.getId().equals(itemId));
                task.setChecklist(checklist);
                task.setUpdatedAt(LocalDateTime.now());
                Task updatedTask = taskRepository.save(task);
                return ResponseEntity.ok(updatedTask);
            }
        }
        return ResponseEntity.notFound().build();
    }
}

