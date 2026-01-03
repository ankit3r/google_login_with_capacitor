# 🎬 CineHub - Movie Discovery App

A beautiful, feature-rich movie discovery application built with React, Redux, and Firebase. Browse thousands of movies, watch trailers, read reviews, and manage your watchlist.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://react--login-4c527.web.app/home)
[![App link](https://img.shields.io/badge/demo-live-brightgreen)]([https://react--login-4c527.web.app/home](https://drive.google.com/file/d/1sHLmmVamVnzMIkgy7dm24UvLO79FY3Lm/view?usp=drive_link))
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)
[![TMDB API](https://img.shields.io/badge/API-TMDB-01d277)](https://www.themoviedb.org/)

## 🌟 Live Demo

**[View Live Application](https://react--login-4c527.web.app/home)**

## ✨ Features

### 🎥 Movie Browsing
- **Multiple Categories**: Popular, Trending, Top Rated movies
- **Horizontal Scrolling**: Netflix-style movie carousels
- **Advanced Pagination**: Navigate through thousands of movies with page numbers
- **Responsive Grid Layout**: Optimized for all screen sizes

### 🔍 Search Functionality
- **Real-time Search**: Instant movie search as you type
- **Persistent Search**: Search query persists across navigation
- **Search Pagination**: Browse through all search results
- **Smart Clear**: Easy search reset functionality

### 📱 Movie Details
- **Rich Information**: Title, rating, runtime, genres, overview
- **Trailer Player**: Watch movie trailers on YouTube
- **Cast & Crew**: View actor profiles with photos
- **Similar Movies**: Discover related content
- **Reviews System**: Read TMDB reviews + add your own comments

### 👤 User Features
- **Firebase Authentication**: Google Sign-in integration
- **User Profiles**: Display name and profile picture
- **Personal Comments**: Add reviews to any movie
- **Secure Sessions**: Protected routes and state management

### 💾 Data Management
- **Export to CSV**: Download movie lists
- **Redux State**: Centralized state management
- **Persistent Data**: Comments stored in Redux

### 📱 Cross-Platform
- **Web Application**: Responsive web design
- **Mobile Ready**: Capacitor integration for iOS/Android
- **PWA Support**: Progressive Web App capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Redux Toolkit** - State management
- **Axios** - HTTP client

### Backend & Services
- **Firebase Authentication** - User login
- **Firebase Hosting** - Web hosting
- **TMDB API** - Movie data

### Mobile
- **Capacitor** - Native mobile wrapper
- **iOS & Android** - Native builds

### Styling
- **CSS3** - Custom styling
- **Responsive Design** - Mobile-first approach
- **Animations** - Smooth transitions

## 🏗️ Building Android App

#### Quick Build Commands

```bash
# Step 1: Install dependencies (if not done)
npm install

# Step 2: Build React app
npm run build

# Step 3: Add Android platform (only needed once)
npx cap add android

# Step 4: Sync to Android
npx cap sync android

# Step 5: Open Android Studio
npx cap open android


## 📦 Installation

### Prerequisites
```bash
node >= 16.x
npm >= 8.x
Android Studio (for Android builds)
Xcode (for iOS builds - macOS only)
