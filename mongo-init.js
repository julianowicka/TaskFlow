// Inicjalizacja bazy danych MongoDB dla TaskFlow
db = db.getSiblingDB('taskflow');

// Tworzenie użytkownika aplikacji
db.createUser({
  user: 'taskflow_user',
  pwd: 'taskflow_password',
  roles: [
    {
      role: 'readWrite',
      db: 'taskflow'
    }
  ]
});

// Tworzenie indeksów dla lepszej wydajności
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

db.boards.createIndex({ "ownerId": 1 });
db.boards.createIndex({ "name": 1 });

db.columns.createIndex({ "boardId": 1 });
db.columns.createIndex({ "position": 1 });

db.tasks.createIndex({ "columnId": 1 });
db.tasks.createIndex({ "assigneeId": 1 });
db.tasks.createIndex({ "createdAt": 1 });

print('MongoDB initialization completed successfully!');

