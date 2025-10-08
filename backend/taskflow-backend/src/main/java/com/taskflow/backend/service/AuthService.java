package com.taskflow.backend.service;

import com.taskflow.backend.dto.AuthResponse;
import com.taskflow.backend.dto.LoginRequest;
import com.taskflow.backend.dto.RegisterRequest;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }
        
        User user = userOpt.get();
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        String token = jwtService.generateToken(user.getEmail());
        
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAvatar()
        );
        
        return new AuthResponse(token, userDto);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setName(registerRequest.getName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        String token = jwtService.generateToken(savedUser.getEmail());
        
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getName(),
                savedUser.getAvatar()
        );
        
        return new AuthResponse(token, userDto);
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}


