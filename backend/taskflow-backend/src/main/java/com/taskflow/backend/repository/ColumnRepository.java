package com.taskflow.backend.repository;

import com.taskflow.backend.model.Column;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColumnRepository extends MongoRepository<Column, String> {
    List<Column> findByBoardIdOrderByPosition(String boardId);
    List<Column> findByBoardId(String boardId);
}


