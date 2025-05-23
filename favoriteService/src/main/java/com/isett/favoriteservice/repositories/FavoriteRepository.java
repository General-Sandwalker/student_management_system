package com.isett.favoriteservice.repositories;

import com.isett.favoriteservice.models.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    Optional<Favorite> findByUserIdAndCourseId(String userId, String courseId);
}
