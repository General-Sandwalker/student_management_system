package com.isett.favoriteservice.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDateTime;

@Document(collection = "favorites")
public class Favorite implements Serializable {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private LocalDateTime addedAt;

    public Favorite() {
    }

    public Favorite(String id, String userId, String courseId, LocalDateTime addedAt) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.addedAt = addedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
