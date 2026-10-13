package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String citizenName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String category;

    private String priority = "MEDIUM"; // Matches priority dropdown in React

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String address;

    private String status = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();
}