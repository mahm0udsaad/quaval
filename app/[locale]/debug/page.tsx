'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCompleteHomePageData, getHomeSections, getHomeContentBlocks } from "@/lib/api";

export default function DebugPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const testResults: any = {};
      
      // Test 1: Check environment variables
      testResults.envVars = {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set (hidden)' : 'Not set',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
      };

      try {
        // Test 2: Basic Supabase connection
        const { data: testData, error: testError } = await supabase
          .from('home_sections')
          .select('count')
          .limit(1);
        
        testResults.supabaseConnection = {
          success: !testError,
          error: testError?.message || null,
          data: testData
        };
      } catch (error) {
        testResults.supabaseConnection = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        // Test 3: Home sections query
        const sections = await getHomeSections();
        testResults.homeSections = {
          success: true,
          count: sections?.length || 0,
          data: sections
        };
      } catch (error) {
        testResults.homeSections = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        // Test 4: Home content blocks query (NEW TEST)
        const contentBlocks = await getHomeContentBlocks('en');
        testResults.homeContentBlocks = {
          success: true,
          count: contentBlocks?.length || 0,
          firstFew: contentBlocks.slice(0, 5),
          statBlocks: contentBlocks.filter(block => block.block_type === 'stat'),
          aboutBlocks: contentBlocks.filter(block => block.section_id === 3).slice(0, 3)
        };
      } catch (error) {
        testResults.homeContentBlocks = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        // Test 5: Direct content blocks query (NEW TEST)
        const { data: directBlocks, error: directError } = await supabase
          .from("home_content_blocks")
          .select("*")
          .order("section_id, sort_order")
          .limit(10);
        
        testResults.directContentBlocks = {
          success: !directError,
          error: directError?.message || null,
          count: directBlocks?.length || 0,
          data: directBlocks
        };
      } catch (error) {
        testResults.directContentBlocks = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }

      try {
        // Test 6: Complete API function
        const data = await getCompleteHomePageData('en');
        testResults.completeApiFunction = {
          success: true,
          sectionsCount: data.sections?.length || 0,
          footerCount: data.footer?.length || 0,
          firstSectionContentBlocks: data.sections[0]?.content_blocks?.length || 0,
          statsSection: data.sections.find(s => s.section_key === 'stats'),
          data: data
        };
      } catch (error) {
        testResults.completeApiFunction = {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        };
      }

      setResults(testResults);
      setLoading(false);
    };

    runTests();
  }, []);

  if (loading) {
    return <div className="p-8">Running API tests...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Debug Results</h1>
      
      <div className="space-y-6">
        {/* Environment Variables */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.envVars, null, 2)}
          </pre>
        </div>

        {/* Supabase Connection */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Supabase Connection</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.supabaseConnection, null, 2)}
          </pre>
        </div>

        {/* Home Sections */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Home Sections (API Function)</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.homeSections, null, 2)}
          </pre>
        </div>

        {/* Home Content Blocks (API Function) */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Home Content Blocks (API Function)</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.homeContentBlocks, null, 2)}
          </pre>
        </div>

        {/* Direct Content Blocks Query */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Direct Content Blocks Query</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.directContentBlocks, null, 2)}
          </pre>
        </div>

        {/* Complete API Function */}
        <div className="border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Complete API Function</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results.completeApiFunction, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 