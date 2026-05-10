# Quick Start: Testing Role-Based Views

## Quick Test Setup

Open your browser's developer console and run one of these commands to test each role:

### Test as Traffic Police
```javascript
localStorage.setItem("user", JSON.stringify({
  id: "tp-001",
  name: "Officer Kumar",
  role: "TRAFFIC_POLICE",
  email: "officer@traffic.gov"
}));
window.location.reload();
```

### Test as Emergency Responder
```javascript
localStorage.setItem("user", JSON.stringify({
  id: "er-001",
  name: "Paramedic Sharma",
  role: "EMERGENCY_RESPONDER",
  email: "ambulance@emergency.gov"
}));
window.location.reload();
```

### Test as Regular User
```javascript
localStorage.setItem("user", JSON.stringify({
  id: "user-001",
  name: "Citizen Singh",
  role: "USER",
  email: "citizen@example.com"
}));
window.location.reload();
```

## Features by Role

### 🚔 Traffic Police
- See all system data
- View system health metrics
- Monitor all emergency corridors
- Access advanced analytics

**Check:** Sidebar shows all 5 menu items

### 🚑 Emergency Responder  
- Large red emergency button
- Quick corridor activation
- See critical traffic areas
- Route planning

**Check:** Sidebar shows only 3 items, emergency button is visible

### 👤 Regular User
- Simple traffic overview
- Report incident button
- Heat map legend
- Minimal metrics

**Check:** Sidebar shows only 2 items, report buttons on each junction

## View the Heat Map Legend

All views show the heat map legend with:
- Color meanings (Red, Orange, Yellow, Green)
- Number of zones in each traffic level
- **Average waiting time in seconds**

## Test Incident Reporting

1. Log in as a Regular User
2. Find a junction in the table
3. Click the "Report" button
4. Fill in the form:
   - Title (e.g., "Accident", "Pothole")
   - Description
   - Severity (Low/Medium/High/Critical)
5. Submit

## Test Emergency Corridor

1. Log in as Emergency Responder
2. Click the red 🚨 **ACTIVATE EMERGENCY CORRIDOR** button
3. Select:
   - Vehicle type (Ambulance/Fire Truck/Police)
   - Starting junction
   - Destination
4. Click "🚨 ACTIVATE"

## File Changes Made

### New Pages
- `UserDashboardPage.jsx` - Regular user view with report button
- `EmergencyResponderPage.jsx` - Emergency responder with big red button
- `RoleBasedHomePage.jsx` - Auto-redirect based on role

### New Components
- `HeatMapLegend.jsx` - Shows color legend and waiting times
- `IncidentReportModal.jsx` - Report modal for users
- `RoleSwitcher.jsx` - Dev tool for quick role switching

### Updated Components
- `Sidebar.jsx` - Now shows role badge and role-based menu
- `Navbar.jsx` - Shows role-specific title and user name
- `LiveJunctionStatusPage.jsx` - Added heat map legend

### Updated Files
- `useAuth.js` - Enhanced with role support
- `AppRouter.jsx` - Added new routes
- `constants.js` - Added role-based navigation

## Navigation Structure

**Traffic Police (/):**
- Live Junction Status ← Default
- Analytics & AI Prediction
- System Health Admin
- AI Route Explainer
- Emergency Corridor

**Emergency Responder (/emergency):**
- Dashboard ← Default
- Emergency Corridor
- Route Planning

**Regular User (/):**
- Traffic Status ← Default
- Report Issue

## Heat Map Colors & Meaning

- 🔴 **Red (Critical)**: 75-100% - Heavy congestion, avoid area
- 🟠 **Orange (High)**: 50-75% - Significant congestion
- 🟡 **Yellow (Moderate)**: 25-50% - Some delays
- 🟢 **Green (Low)**: 0-25% - Light traffic, smooth flow

Each zone shows its zone count and average waiting time.

## Customization Tips

### Change Role Labels in Sidebar
Edit `Sidebar.jsx` - `getRoleBadge()` function

### Adjust Navigation Items
Edit `constants.js` - `ROLE_BASED_NAV` object

### Modify Heat Map Colors
Edit `HeatMapLegend.jsx` - Color values and thresholds

### Customize Emergency Modal
Edit `EmergencyResponderPage.jsx` - Modal form fields

### Adjust Report Form
Edit `IncidentReportModal.jsx` - Form fields and validation

## Debugging

Check browser console for any errors when switching roles. The app should:

1. ✅ Update sidebar navigation
2. ✅ Update navbar title and subtitle
3. ✅ Show role badge in sidebar
4. ✅ Display role-specific features

If something doesn't work:
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Set user role again and reload
