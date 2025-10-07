package com.taskflow.backend.controller;

import com.taskflow.backend.model.Board;
import com.taskflow.backend.repository.BoardRepository;
import com.taskflow.backend.repository.ColumnRepository;
import com.taskflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/boards")
@CrossOrigin(origins = "http://localhost:4200")
public class BoardController {
    
    @Autowired
    private BoardRepository boardRepository;
    
    @Autowired
    private ColumnRepository columnRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @GetMapping
    public ResponseEntity<List<Board>> getAllBoards(@RequestParam String ownerId) {
        List<Board> boards = boardRepository.findByOwnerIdAndIsArchivedFalse(ownerId);
        return ResponseEntity.ok(boards);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable String id) {
        Optional<Board> board = boardRepository.findById(id);
        return board.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board) {
        board.setCreatedAt(LocalDateTime.now());
        board.setUpdatedAt(LocalDateTime.now());
        Board savedBoard = boardRepository.save(board);
        return ResponseEntity.ok(savedBoard);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable String id, @RequestBody Board boardDetails) {
        Optional<Board> boardOptional = boardRepository.findById(id);
        if (boardOptional.isPresent()) {
            Board board = boardOptional.get();
            board.setTitle(boardDetails.getTitle());
            board.setDescription(boardDetails.getDescription());
            board.setUpdatedAt(LocalDateTime.now());
            Board updatedBoard = boardRepository.save(board);
            return ResponseEntity.ok(updatedBoard);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/column-order")
    public ResponseEntity<Board> updateColumnOrder(@PathVariable String id, @RequestBody List<String> columnOrder) {
        Optional<Board> boardOptional = boardRepository.findById(id);
        if (boardOptional.isPresent()) {
            Board board = boardOptional.get();
            board.setColumnOrder(columnOrder);
            board.setUpdatedAt(LocalDateTime.now());
            Board updatedBoard = boardRepository.save(board);
            return ResponseEntity.ok(updatedBoard);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable String id) {
        if (boardRepository.existsById(id)) {
            // Delete all columns and tasks associated with this board
            columnRepository.findByBoardId(id).forEach(column -> {
                taskRepository.findByColumnId(column.getId()).forEach(task -> taskRepository.deleteById(task.getId()));
                columnRepository.deleteById(column.getId());
            });
            boardRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/archive")
    public ResponseEntity<Board> archiveBoard(@PathVariable String id) {
        Optional<Board> boardOptional = boardRepository.findById(id);
        if (boardOptional.isPresent()) {
            Board board = boardOptional.get();
            board.setArchived(true);
            board.setUpdatedAt(LocalDateTime.now());
            Board updatedBoard = boardRepository.save(board);
            return ResponseEntity.ok(updatedBoard);
        }
        return ResponseEntity.notFound().build();
    }
}

