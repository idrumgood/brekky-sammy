# BrekkySammy TODOs

## 🔐 Authentication & Users
- [x] Implement Firebase Authentication (Email/Password)
- [x] Integrate Google One Tap / Google Login
- [x] Create user profile pages (personal "Sammy" history & editing)
- [x] Public user profiles (view other scouts' reviews, location, and bio)
- [x] Profile editing (custom avatars, display names, and bios)
- [x] Implement protected routes for review submission

## 🍳 Review Submission flow
- [x] Design and build the "Rate a Sammy" multi-step form
- [x] Integrate Firebase Storage for photo uploads during reviews
- [x] Add ability to tag specific ingredients used in the sandwich
- [ ] Implement "Edit Review" functionality for users
- [x] **Photo Upload Refinement**: Restore choice between camera and gallery for mobile users

## 📊 Enhancements & Features
- [x] **Admin Dashboard**: Simple UI for club admins to manage/update restaurant and sandwich data
- [ ] **Leaderboard**: Add a "Top Rated" page with more filters (by neighborhood, by ingredient)
- [ ] **Badges**: Award special achievements to dedicated sammy scouts (e.g., "5-Sammy Streak", "Spicy Scout")
- [ ] **Social Features**: Allow users to follow each other's brunch activities
- [x] **Maps Integration**: Added a dedicated "Map Room" with auto-centering and CartoDB styles
- [x] **Navbar Evolution**: Condensed mobile search icon with full-width expansion
- [x] **UI Security**: Role-based protection for restaurant editing (Admins only)

## 🚀 DevOps & Maintenance
- [x] Set up a CI/CD pipeline using Google Cloud Build (automatic deploy on git push)
- [ ] Add structured logging to Cloud Run for better debugging
- [ ] Implement periodic database backups
