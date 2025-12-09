package com.example.recommend.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class Vector {

    private String originalText;
    private String imageUrl;
    private List<Float> vectors;

    public String getOriginalText() {
        return originalText;
    }

    public void setOriginalText(String originalText) {
        this.originalText = originalText;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<Float> getVectors() {
        return vectors;
    }

    public void setVectors(List<Float> vectors) {
        this.vectors = vectors;
    }
}
