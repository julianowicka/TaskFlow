package com.taskflow.backend.repository;

import com.taskflow.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByBoardId(String boardId);
    List<Task> findByColumnId(String columnId);
    List<Task> findByAssigneeId(String assigneeId);
}
