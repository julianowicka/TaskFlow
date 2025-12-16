package com.taskflow.backend.controller;

import com.taskflow.backend.model.Column;
import com.taskflow.backend.repository.ColumnRepository;
import com.taskflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/columns")
@CrossOrigin(origins = "http://localhost:4200")
public class ColumnController {
    
    @Autowired
    private ColumnRepository columnRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<Column>> getColumnsByBoard(@PathVariable String boardId) {
        List<Column> columns = columnRepository.findByBoardIdOrderByPosition(boardId);
        return ResponseEntity.ok(columns);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Column> getColumnById(@PathVariable String id) {
        Optional<Column> column = columnRepository.findById(id);
        return column.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Column> createColumn(@RequestBody Column column) {
        column.setCreatedAt(LocalDateTime.now());
        column.setUpdatedAt(LocalDateTime.now());
        Column savedColumn = columnRepository.save(column);
        return ResponseEntity.ok(savedColumn);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Column> updateColumn(@PathVariable String id, @RequestBody Column columnDetails) {
        Optional<Column> columnOptional = columnRepository.findById(id);
        if (columnOptional.isPresent()) {
            Column column = columnOptional.get();
            column.setTitle(columnDetails.getTitle());
            column.setUpdatedAt(LocalDateTime.now());
            Column updatedColumn = columnRepository.save(column);
            return ResponseEntity.ok(updatedColumn);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/task-order")
    public ResponseEntity<Column> updateTaskOrder(@PathVariable String id, @RequestBody List<String> taskIds) {
        Optional<Column> columnOptional = columnRepository.findById(id);
        if (columnOptional.isPresent()) {
            Column column = columnOptional.get();
            column.setTaskIds(taskIds);
            column.setUpdatedAt(LocalDateTime.now());
            Column updatedColumn = columnRepository.save(column);
            return ResponseEntity.ok(updatedColumn);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/position")
    public ResponseEntity<Column> updatePosition(@PathVariable String id, @RequestBody int position) {
        Optional<Column> columnOptional = columnRepository.findById(id);
        if (columnOptional.isPresent()) {
            Column column = columnOptional.get();
            column.setPosition(position);
            column.setUpdatedAt(LocalDateTime.now());
            Column updatedColumn = columnRepository.save(column);
            return ResponseEntity.ok(updatedColumn);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteColumn(@PathVariable String id) {
        if (columnRepository.existsById(id)) {
            // Delete all tasks in this column
            taskRepository.findByColumnId(id).forEach(task -> taskRepository.deleteById(task.getId()));
            columnRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}



