package com.isett.favoriteservice.controllers;

import com.isett.favoriteservice.models.Favorite;
import com.isett.favoriteservice.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable String userId) {
        return favoriteService.getFavorites(userId);
    }

    @PostMapping
    public void addFavorite(@RequestBody Favorite favorite) {
        favoriteService.addFavorite(favorite);
    }

    @DeleteMapping("/{userId}/{courseId}")
    public void removeFavorite(@PathVariable String userId, @PathVariable String courseId) {
        favoriteService.removeFavorite(userId, courseId);
    }
}