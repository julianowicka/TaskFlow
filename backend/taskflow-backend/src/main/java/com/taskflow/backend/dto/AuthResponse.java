package com.taskflow.backend.dto;

public class AuthResponse {
    private String token;
    private UserDto user;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    // Nested UserDto class
    public static class UserDto {
        private String id;
        private String email;
        private String name;
        private String avatar;
        
        // Constructors
        public UserDto() {}
        
        public UserDto(String id, String email, String name, String avatar) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.avatar = avatar;
        }
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getAvatar() {
            return avatar;
        }
        
        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }
    }
}


