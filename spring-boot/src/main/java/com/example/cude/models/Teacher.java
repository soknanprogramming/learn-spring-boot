package com.example.cude.models;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;


@Entity
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    private String full_name;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Classroom> classrooms;

    public Teacher(Long id, String full_name, List<Classroom> classrooms) {
        this.id = id;
        this.full_name = full_name;
        this.classrooms = classrooms;
    }

    public Teacher() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public List<Classroom> getClassrooms() {
        return classrooms;
    }
    
    public void setClassrooms(List<Classroom> classrooms) {
        this.classrooms = classrooms;
    }



}
