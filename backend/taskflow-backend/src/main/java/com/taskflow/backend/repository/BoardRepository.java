package com.taskflow.backend.repository;

import com.taskflow.backend.model.Board;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends MongoRepository<Board, String> {
    List<Board> findByOwnerIdAndIsArchivedFalse(String ownerId);
    List<Board> findByOwnerId(String ownerId);
}
