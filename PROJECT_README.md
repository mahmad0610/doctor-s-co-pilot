# Sehatly Doctor Dashboard MVP

## 🎯 Overview

Sehatly is an AI-powered clinical command center designed for healthcare professionals. It facilitates a closed-loop system where patient data flows through AI processing to generate actionable insights, which doctors can review, validate, and approve.

### The Closed-Loop System

```
Patient App → AI Engine → Doctor Dashboard
     ↓            ↓              ↓
  Adherence    Triage      Validation &
  & Vitals    Summaries    Authority
  Data        Care Plans    Sign-off
```

## ✨ Features

### 1. **Authentication**
- Google Firebase Sign-In
- Role-based access control (Doctor role required)
- Secure session management

### 2. **Patient Command Center**
- Real-time patient list with status indicators (Urgent, Today, Stable)
- Unread message badges
- Quick vitals preview (Heart Rate, BP, O₂ levels)
- Search and filter capabilities
- Quick actions (Call, Archive)

### 3. **Patient Detail View**
- Bento grid layout for vitals cards
- AI Triage Brief with confidence scoring
- 7-day vitals timeline (interactive charts)
- Medication history
- Chronic conditions tracking
- Patient timeline

### 4. **AI Triage System**
- Automated patient data analysis
- Confidence-based recommendations (Green >80%, Amber 60-80%, Red <60%)
- Severity flags for critical conditions
- Evidence-based suggestions with ICD code support

### 5. **Care Plan Editor**
- Daily timeline view with editable activities
- Drug interaction warnings
- Confidence-based validation alerts
- Review and approval workflow

### 6. **Sign & Override Modal**
- Authority gate requiring explicit review confirmation
- Severe drug interaction blocking
- Confetti animation on successful sign-off
- Keyboard shortcuts (Cmd+Enter to sign)

## 🎨 Design System

### Color Palette
- **Primary (Emerald)**: `hsl(160 84% 39%)` - Trust & Medical
- **Secondary (Slate)**: `hsl(215 16% 47%)` - Clinical Calm
- **Warning (Amber)**: `hsl(38 92% 50%)` - Alerts
- **Destructive (Red)**: `hsl(0 84% 60%)` - Critical

### Confidence Metering
- **High (>80%)**: Green `hsl(142 71% 45%)`
- **Medium (60-80%)**: Amber `hsl(38 92% 50%)`
- **Low (<60%)**: Red `hsl(0 84% 60%)`

### Micro-UX Features
- Pulse animations on new alerts
- Loading skeletons everywhere
- Smooth transitions
- "Last signed X mins ago" timestamps
- Copy to clipboard functionality
- Dark mode support

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── AILabel.tsx      # AI transparency labels
│   ├── ConfidenceBadge.tsx
│   ├── LoadingSkeleton.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx  # Firebase auth wrapper
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── mockData.ts      # Demo data
│   └── utils.ts
├── pages/
│   ├── Login.tsx
│   ├── PatientList.tsx
│   ├── PatientDetail.tsx
│   ├── CarePlanEditor.tsx
│   └── NotFound.tsx
├── types/
│   └── index.ts         # TypeScript definitions
└── App.tsx
```

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI
- **Auth**: Firebase Authentication
- **Charts**: Recharts
- **State**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Animations**: Canvas Confetti
- **Date Handling**: date-fns

## 🔧 Setup

### Prerequisites
- Node.js 18+ and npm
- Firebase project (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sehatly-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:8080 in your browser

## 🔐 Authentication Setup

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** → **Sign-in method** → **Google**
4. Add your app's domain to authorized domains
5. Copy configuration to `.env`

### Role Management

By default, all authenticated users are assigned the "doctor" role. In production:

1. Implement a user roles database (Firestore/Supabase)
2. Update `AuthContext.tsx` → `checkUserRole()` function
3. Fetch roles from your backend
4. Enforce role-based access control

## 📊 Mock Data

The MVP uses mock data (`src/lib/mockData.ts`) for demonstration. To connect to real APIs:

1. Replace mock data calls with API endpoints:
   - `/api/v1/triage/` - AI Triage Brief
   - `/api/v1/planner/{planId}/sign` - Sign Care Plan
2. Update `PatientList`, `PatientDetail`, `CarePlanEditor` components
3. Configure API base URL in environment variables

## 🎯 Key User Flows

### 1. Sign In Flow
```
Login Page → Google Sign-In → Role Check → Patient List
```

### 2. Review Patient Flow
```
Patient List → Patient Detail → View Triage Brief → Review Vitals → Check Timeline
```

### 3. Care Plan Approval Flow
```
Patient Detail → Edit Care Plan → Review Timeline → Check Drug Interactions → Sign & Approve
```

## ⚡ Performance Optimizations

- Lazy loading for routes
- Skeleton loading states
- Optimistic UI updates
- Memoized components
- Debounced search

## 🎨 Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support (Cmd+Enter shortcuts)
- Semantic HTML structure
- High contrast color ratios
- Screen reader friendly

## 📱 Responsive Design

Fully responsive across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Voice dictation for notes
- [ ] Integration with EHR systems
- [ ] Team collaboration features
- [ ] Automated report generation

### Backend Integration
- [ ] Connect to Supabase/Firebase for data persistence
- [ ] Implement real AI triage API
- [ ] Add prescription management
- [ ] Lab results integration
- [ ] Appointment scheduling API

## 🛡️ Security Considerations

### Current Implementation
✅ Firebase Authentication
✅ Role-based access control
✅ HTTPS enforced
✅ Environment variables for secrets

### Production Recommendations
- [ ] Implement Row Level Security (RLS) policies
- [ ] Add rate limiting
- [ ] Enable audit logging
- [ ] Implement data encryption at rest
- [ ] Add HIPAA compliance measures
- [ ] Set up backup systems
- [ ] Configure CORS properly

## 📝 Development Notes

### Code Style
- TypeScript strict mode enabled
- ESLint configuration active
- Component-based architecture
- Separation of concerns (UI/Logic/API)

### Testing Strategy (To Implement)
- Unit tests for utilities
- Integration tests for auth flow
- E2E tests for critical paths
- Visual regression testing

## 🤝 Contributing

This is an MVP built for rapid iteration. When contributing:

1. Follow the existing code structure
2. Use semantic commit messages
3. Write clear component documentation
4. Test on multiple devices
5. Update this README with new features

## 📄 License

[Add your license here]

## 📞 Support

For questions or issues:
- Email: support@sehatly.com
- Documentation: [docs.sehatly.com]
- Issues: [GitHub Issues]

---

**Built with ❤️ for healthcare professionals who deserve better tools.**
