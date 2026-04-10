# FF Wölfnitz Door-to-Door Collection App

A specialized management application for the FF Wölfnitz fire department's annual door-to-door fundraising and sales campaign. Built with Next.js, Leaflet, and Supabase.

## Features

-   **Interactive OSM Map**: Color-coded markers based on visit status.
    -   **Grey**: Not visited
    -   **Green**: Sale completed
    -   **Red**: No interest
    -   **Yellow**: Resident not home
-   **Financial Tracking**: Real-time sales and donation tracking per address.
-   **Role-Based Access**: 
    -   **Collectors**: View only assigned street districts; easy mobile entry of data.
    -   **Admins**: Full financial dashboard, district assignment, user management, and campaign reset capabilities.
-   **District Grouping**: Address clustering based on street names for efficient route planning.
-   **Fire Department Theme**: Custom "Fire Red" UI optimized for mobile and desktop use.

## Prerequisites

-   Node.js (v18 or newer)
-   npm or yarn
-   A Supabase project (provided in configuration)

## Installation

1.  Clone the repository or download the files.
2.  Navigate to the project directory:
    `cd ff-woelfnitz-collection-app`
3.  Install dependencies:
    `npm install`
4.  Create a `.env.local` file in the root directory and add the Supabase keys:
    `NEXT_PUBLIC_SUPABASE_URL=https://orarhdbyavikmmxflesi.supabase.co`
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Zq3rXnzygrFM17VW3qF_Cg_uX6cTm-0`

## Running the Application

To start the development server:
    `npm run dev`

The application will be available at `http://localhost:3000`.

## Deployment

This app is production-ready for Vercel. 
1. Push the code to a GitHub repository.
2. Connect your GitHub account to Vercel.
3. Import the repository.
4. Add the Environment Variables in the Vercel dashboard.
5. Click **Deploy**.

## Project Content

-   `pages/index.tsx`: Main map view for collectors.
-   `pages/admin/index.tsx`: Admin control center.
-   `components/MapComponent.tsx`: Core mapping logic using React-Leaflet.
-   `components/Ribbon.tsx`: Dynamic top navbar with progress tracking.

## Technical Details

- **Database**: Uses Supabase Postgres.
- **Styling**: Tailwind CSS.
- **Map Tiles**: OpenStreetMap.
- **Icons**: Lucide React.
