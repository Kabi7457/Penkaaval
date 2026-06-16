-- PenKaaval Database Schema
-- Run this in your Supabase SQL Editor

-- Create team_applications table
CREATE TABLE IF NOT EXISTS team_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  district TEXT NOT NULL,
  current_status TEXT NOT NULL CHECK (current_status IN ('Student', 'Working Professional', 'Other')),
  interests TEXT[] NOT NULL,
  reason TEXT NOT NULL,
  application_status TEXT DEFAULT 'Pending' CHECK (application_status IN ('Pending', 'Accepted', 'Rejected', 'Contacted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email to prevent duplicate submissions
CREATE UNIQUE INDEX IF NOT EXISTS idx_team_applications_email ON team_applications(email);

-- Enable Row Level Security
ALTER TABLE team_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit application)
CREATE POLICY "Allow public insert" ON team_applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users (admin) to select all
CREATE POLICY "Allow authenticated select" ON team_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update" ON team_applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated delete" ON team_applications
  FOR DELETE
  USING (auth.role() = 'authenticated');
