"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const profilesTableSQL = `
-- Create profiles table that links to Supabase auth users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  preferred_currency TEXT DEFAULT 'CAD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a secure RLS policy for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view and update only their own profile
CREATE POLICY "Users can view their own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
`

const userSettingsTableSQL = `
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  notifications BOOLEAN DEFAULT true,
  country VARCHAR(50),
  currency VARCHAR(10) DEFAULT 'USD',
  cart_items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only access their own settings
CREATE POLICY user_settings_policy ON user_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Create trigger to automatically create user settings when a new user is created
CREATE OR REPLACE FUNCTION public.create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_settings();
`

export function UserTablesSQL() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Profiles Table</h3>
          <Button size="sm" onClick={() => copyToClipboard(profilesTableSQL, "profiles")}>
            {copied === "profiles" ? "Copied!" : "Copy SQL"}
          </Button>
        </div>
        <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">{profilesTableSQL}</pre>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">User Settings Table</h3>
          <Button size="sm" onClick={() => copyToClipboard(userSettingsTableSQL, "settings")}>
            {copied === "settings" ? "Copied!" : "Copy SQL"}
          </Button>
        </div>
        <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm whitespace-pre-wrap">{userSettingsTableSQL}</pre>
        </div>
      </div>
    </div>
  )
}
