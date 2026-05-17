# Supabase Configuration Guide for BekiGame

This guide explains how to set up the Supabase backend to enable real-time multi-user synchronization for the BekiGame prototype.

## 1. Create a Project
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Note your **Project URL** and **Anon Key** (found in Project Settings > API).

## 2. Database Schema
Run the following script in the Supabase **SQL Editor** to create the necessary table for game sessions:

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE NOT NULL,
  state jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## 3. Row-Level Security (RLS)
To allow the webapp to read and write data securely without a custom backend, you must enable these policies in the **SQL Editor**:

```sql
-- Enable RLS on the table
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a new game session
CREATE POLICY "Allow anonymous insert" 
ON sessions FOR INSERT 
WITH CHECK (true);

-- Allow anyone to see the game state
CREATE POLICY "Allow anonymous select" 
ON sessions FOR SELECT 
USING (true);

-- Allow anyone to update the game state
CREATE POLICY "Allow anonymous update" 
ON sessions FOR UPDATE 
USING (true);
```

## 4. Enable Realtime
Realtime allows the Game Master's actions to appear instantly on the Teams' screens.

1. Go to **Database** (sidebar) -> **Replication**.
2. Click on the **'1 table'** (or '0 tables') link in the `supabase_realtime` row.
3. Toggle the switch for the `sessions` table to **ON**.

## 5. Webapp Integration
### Local Development
Create a `webapp/.env.local` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### GitHub Actions (Online Deployment)
1. Go to your GitHub Repository **Settings** -> **Secrets and variables** -> **Actions**.
2. Create a new secret named `secret1`.
3. Paste both variables into the secret:
   ```text
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-key-here
   ```

The GitHub Action will automatically pick up these values during the build process.
