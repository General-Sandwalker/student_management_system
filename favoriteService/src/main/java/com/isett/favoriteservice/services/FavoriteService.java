package com.isett.favoriteservice.services;

import com.isett.favoriteservice.models.Favorite;
import com.isett.favoriteservice.repositories.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Cacheable(value = "favorites", key = "#userId")
    public List<Favorite> getFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    @CacheEvict(value = "favorites", key = "#favorite.userId")
    public void addFavorite(Favorite favorite) {
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndCourseId(favorite.getUserId(), favorite.getCourseId());
        if (existing.isEmpty()) {
            favorite.setAddedAt(LocalDateTime.now());
            favoriteRepository.save(favorite);
        }
    }

    @CacheEvict(value = "favorites", key = "#userId")
    public void removeFavorite(String userId, String courseId) {
        Optional<Favorite> favorite = favoriteRepository.findByUserIdAndCourseId(userId, courseId);
        favorite.ifPresent(favoriteRepository::delete);
    }
}
