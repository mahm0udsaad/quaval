"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export function OrdersTableSQL() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const createOrdersTableSQL = `
-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  payment_intent TEXT,
  shipping_address JSONB,
  billing_address JSONB
);

-- Set up RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only admins can update orders
CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
`

  const createNotificationsTableSQL = `
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false
);

-- Set up RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
`

  const executeSQL = async (sql: string) => {
    setIsExecuting(true)
    setResult(null)

    try {
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) {
        setResult(`Error: ${error.message}`)
      } else {
        setResult("SQL executed successfully! Tables and policies have been created.")
      }
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Orders Database Setup</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Orders Database Setup</DialogTitle>
          <DialogDescription>
            Run these SQL commands to set up the orders and notifications tables in your Supabase database.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="orders">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Orders Table</TabsTrigger>
            <TabsTrigger value="notifications">Notifications Table</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Textarea className="font-mono text-sm h-80" readOnly value={createOrdersTableSQL} />
          </TabsContent>

          <TabsContent value="notifications">
            <Textarea className="font-mono text-sm h-80" readOnly value={createNotificationsTableSQL} />
          </TabsContent>
        </Tabs>

        {result && (
          <div
            className={`p-3 rounded-md ${result.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
          >
            {result}
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => executeSQL(createOrdersTableSQL + createNotificationsTableSQL)} disabled={isExecuting}>
            {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Execute SQL
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
