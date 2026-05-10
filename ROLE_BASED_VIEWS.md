# Role-Based Traffic Management Views

This document describes the three different user views implemented in the Smart Traffic Grid system.

## Overview

The system now supports three distinct user roles, each with a customized dashboard and navigation menu:

1. **🚔 Traffic Police** - Full system monitoring and control
2. **🚑 Emergency Responder** - Emergency corridor activation
3. **👤 Regular Users** - Public traffic information and incident reporting

## User Roles & Features

### 1. Traffic Police Portal

**Route:** `/` (Live Junction Status Page)

#### Features:
- **Full system visibility** with all metrics
- **System Health Monitoring** (Admin-only feature)
- **Detailed analytics** with AI predictions
- **AI Route Explainer** for intelligent routing
- **Emergency Corridor Management** for coordinating emergency response

#### Navigation Menu:
- Live Junction Status
- Analytics & AI Prediction
- System Health Admin
- AI Route Explainer
- Emergency Corridor

#### Dashboard Components:
- Active junctions count
- Real-time update stream
- Average congestion metrics
- Detailed junction list with codes and areas
- Congestion heatmap with legend showing:
  - 🔴 Red: Critical (75-100% congestion)
  - 🟠 Orange: High (50-75% congestion)
  - 🟡 Yellow: Moderate (25-50% congestion)
  - 🟢 Green: Low (0-25% congestion)
- Average waiting time display

### 2. Emergency Responder Portal

**Route:** `/emergency` (Emergency Responder Page)

#### Features:
- **Prominent Emergency Corridor Button** - Large red activation button for quick access
- **Route Planning** with AI recommendations
- **Critical Area Highlighting** - Automatic filtering of high-congestion zones
- **Emergency Status Display** - Real-time emergency incidents
- **Vehicle Type Selection** (Ambulance, Fire Truck, Police)
- **Destination Selection** - Quick route planning

#### Navigation Menu:
- Dashboard (Emergency view)
- Emergency Corridor
- Route Planning

#### Dashboard Components:
- Active routes count
- Critical areas indicator
- Active emergencies count
- Prominent 🚨 emergency activation button
- Route status table with:
  - Color-coded traffic levels
  - Waiting times
  - Critical area highlighting
- Emergency modal with:
  - Vehicle type selection
  - Starting junction selection
  - Destination input
  - Auto corridor activation

#### Emergency Modal Form:
```
Vehicle Type: [Ambulance / Fire Truck / Police Vehicle]
Starting Junction: [Dropdown - Select from available junctions]
Destination: [Text field - Hospital, Fire Station, etc.]
```

### 3. Regular User Portal

**Route:** `/` or `/user-dashboard` (User Dashboard Page)

#### Features:
- **Simplified Interface** - Only essential traffic information
- **Report Button** - Easy incident/issue reporting
- **Personal Incident Submission** - Report accidents, hazards, signal failures
- **Minimal Metrics** - Only active routes and average traffic level
- **Map Visibility** - See traffic heatmap with legend
- **Waiting Time Information** - Know expected delays

#### Navigation Menu:
- Traffic Status
- Report Issue

#### Dashboard Components:
- Active routes count
- Average traffic level (city-wide)
- Traffic heatmap with visual legend
- Junction status table with report buttons
- Heat map legend showing:
  - Color intensity meanings
  - Average waiting time
  - Number of zones in each traffic level

#### Incident Report Modal:
```
Issue Title: [Text - Accident, Road damage, Signal malfunction, etc.]
Description: [Textarea - Detailed description of the issue]
Severity Level: [Low / Medium / High / Critical]
```

Reports are automatically geotagged to the selected junction.

## Heat Map Legend Component

The `HeatMapLegend` component displays:

- **Visual Color Codes**: 
  - 🔴 Critical (75-100%)
  - 🟠 High (50-75%)
  - 🟡 Moderate (25-50%)
  - 🟢 Low (0-25%)

- **Zone Counts**: Number of junctions in each traffic level category

- **Average Waiting Time**: City-wide average waiting time in seconds

## Testing the Different Roles

### Using the RoleSwitcher Component

A debug component is available at `RoleSwitcher.jsx` that allows you to quickly switch between roles during development:

```jsx
import { RoleSwitcher } from "../components/common/RoleSwitcher";

// Add to your layout or debug panel:
<RoleSwitcher />
```

### Manual Testing

Test data can be stored in localStorage with the following format:

```javascript
// Traffic Police
localStorage.setItem("user", JSON.stringify({
  id: "tp-001",
  name: "Officer Kumar",
  role: "TRAFFIC_POLICE",
  email: "officer@traffic.gov"
}));

// Emergency Responder
localStorage.setItem("user", JSON.stringify({
  id: "er-001",
  name: "Paramedic Sharma",
  role: "EMERGENCY_RESPONDER",
  email: "ambulance@emergency.gov"
}));

// Regular User
localStorage.setItem("user", JSON.stringify({
  id: "user-001",
  name: "Citizen Singh",
  role: "USER",
  email: "citizen@example.com"
}));
```

After setting the user data, refresh the page to see the role-specific interface.

## File Structure

### New Files Created:

```
frontend/src/
├── pages/
│   ├── UserDashboardPage.jsx          # Regular user view
│   ├── EmergencyResponderPage.jsx      # Emergency responder view
│   └── RoleBasedHomePage.jsx           # Role-based redirect
├── components/
│   ├── maps/
│   │   └── HeatMapLegend.jsx          # Heat map intensity legend
│   └── common/
│       ├── IncidentReportModal.jsx    # Incident reporting modal
│       └── RoleSwitcher.jsx           # Dev tool for role testing
└── context/
    └── useAuth.js                      # Updated with role support
```

### Modified Files:

```
frontend/src/
├── routes/AppRouter.jsx               # Added new routes
├── layouts/AppLayout.jsx              # Ready for role-based content
├── components/common/
│   ├── Sidebar.jsx                   # Role-based navigation
│   ├── Navbar.jsx                    # Role-specific headers
├── pages/
│   └── LiveJunctionStatusPage.jsx     # Added heat map legend
└── utils/constants.js                 # Added role-based nav items
```

## User Roles Constant

```javascript
export const USER_ROLES = {
  TRAFFIC_POLICE: "TRAFFIC_POLICE",
  EMERGENCY_RESPONDER: "EMERGENCY_RESPONDER",
  USER: "USER",
};
```

## Component Integration

### In AppLayout:
```jsx
<RealtimeProvider>
  <Sidebar /> {/* Shows role-based navigation */}
  <Navbar /> {/* Shows role-specific title and user info */}
  <Outlet /> {/* Renders role-specific page */}
</RealtimeProvider>
```

## API Endpoints Used

The views interact with these backend endpoints:

- `POST /emergency` - Create emergency corridor event
- `POST /incidents` - Submit incident report
- `GET /junctions` - Fetch junction data
- `GET /analytics` - Get traffic analytics
- `GET /system-health` - Get system health (police only)
- `GET /predictions` - Get AI predictions

## Navigation Flow

```
Homepage (/)
├── User Role = TRAFFIC_POLICE
│   ├── Live Junction Status (default)
│   ├── Analytics & AI Prediction
│   ├── System Health Admin
│   ├── AI Route Explainer
│   └── Emergency Corridor
├── User Role = EMERGENCY_RESPONDER
│   ├── Dashboard (emergency view) (default)
│   ├── Emergency Corridor
│   └── Route Planning
└── User Role = USER
    ├── Traffic Status (default)
    └── Report Issue
```

## Authentication & User Data

User data is retrieved from localStorage:
```javascript
const user = JSON.parse(localStorage.getItem("user"));
```

The user object should contain:
- `id`: Unique user identifier
- `name`: Display name
- `role`: One of "TRAFFIC_POLICE", "EMERGENCY_RESPONDER", or "USER"
- `email`: User email address (optional)

## Future Enhancements

1. Add real authentication system
2. Implement role-based API permissions
3. Add more detailed analytics for police
4. Implement real-time emergency notifications
5. Add incident approval workflow
6. Create user reputation system for reports
7. Add audit logs for police actions
