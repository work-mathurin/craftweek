import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DailyNote {
  id: string;
  date: string;
  content: string;
}

// Extract markdown content from Craft block structure
function extractMarkdown(block: any): string {
  let content = block.markdown || '';
  
  if (block.content && Array.isArray(block.content)) {
    for (const child of block.content) {
      content += '\n' + extractMarkdown(child);
    }
  }
  
  return content;
}

// Normalize the server link to get the base API URL
function normalizeServerLink(serverLink: string): string {
  // Remove trailing slashes and ensure it ends with /api/v1
  let url = serverLink.trim().replace(/\/+$/, '');
  
  // If it doesn't already have /api/v1, add it
  if (!url.endsWith('/api/v1')) {
    // Check if it has /api but not /v1
    if (url.endsWith('/api')) {
      url += '/v1';
    } else {
      url += '/api/v1';
    }
  }
  
  return url;
}

// Fetch daily notes for a date range using the server link
async function fetchDailyNotes(apiBase: string, days: number): Promise<DailyNote[]> {
  const notes: DailyNote[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      console.log(`Fetching daily note for ${dateStr}...`);
      
      const response = await fetch(`${apiBase}/blocks?date=${dateStr}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const content = extractMarkdown(data);
        
        if (content.trim()) {
          notes.push({
            id: data.id,
            date: dateStr,
            content: content.trim(),
          });
          console.log(`Found content for ${dateStr}`);
        }
      } else {
        console.log(`No content for ${dateStr}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching note for ${dateStr}:`, error);
    }
  }
  
  return notes;
}

// Generate reflection using AI
async function generateReflection(notes: DailyNote[], days: number): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("AI service not configured");
  }
  
  const combinedContent = notes
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(n => `## ${n.date}\n${n.content}`)
    .join('\n\n---\n\n');
  
  // Adjust the prompt based on the period
  const periodLabel = days === 1 ? "daily" : days <= 7 ? "weekly" : days <= 14 ? "bi-weekly" : "monthly";
  
  console.log(`Generating AI ${periodLabel} reflection...`);
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `You are a thoughtful assistant helping a knowledge worker reflect on their ${periodLabel} notes. 
Analyze their daily notes and create a structured ${periodLabel} reflection document.

Your output should be in Markdown format with these exact sections:
# ${days === 1 ? 'Daily' : days <= 7 ? 'Weekly' : days <= 14 ? 'Bi-Weekly' : 'Monthly'} Brain Reset

## 🎯 Key Themes
Identify ${days === 1 ? '2-3' : '3-5'} recurring themes, topics, or focus areas.

## ✅ Decisions Made
List important decisions that were made or conclusions that were reached.

## 🔄 Open Loops
Identify unfinished tasks, pending items, or things that need follow-up.

## ⚡ Next Actions
Suggest ${days === 1 ? '2-3' : '3-5'} concrete next actions based on the content.

## 💡 Insights & Patterns
Share any interesting patterns, insights, or observations.

Be concise but insightful. Use bullet points. Focus on what matters.`
        },
        {
          role: "user",
          content: `Here are my daily notes from the past ${days} day${days > 1 ? 's' : ''}. Please create a ${periodLabel} reflection:\n\n${combinedContent}`
        }
      ],
    }),
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Please add credits to continue.");
    }
    throw new Error(`AI service error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Unable to generate reflection.";
}

// Create a new document in Craft with the reflection
async function createCraftDocument(apiBase: string, content: string): Promise<string> {
  console.log("Creating document in Craft...");
  
  // Try creating without date positioning (more reliable for server links)
  const response = await fetch(`${apiBase}/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      markdown: content
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Craft API error:", errorText);
    throw new Error(`Failed to create document: ${response.status}`);
  }
  
  const result = await response.json();
  console.log("Document created:", result);
  
  // Return a deep link to open Craft
  const blockId = result.items?.[0]?.id || result.id;
  return `craftdocs://open?blockId=${blockId}`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { serverLink, days } = await req.json();
    
    if (!serverLink) {
      return new Response(
        JSON.stringify({ error: "Craft server link is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate server link format
    if (!serverLink.includes("connect.craft.do/links/")) {
      return new Response(
        JSON.stringify({ error: "Invalid Craft Connect link format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const apiBase = normalizeServerLink(serverLink);
    const periodDays = [1, 7, 14, 30].includes(days) ? days : 7;
    
    console.log(`Starting brain reset for ${periodDays} days using ${apiBase}...`);
    
    // Step 1: Fetch daily notes
    const notes = await fetchDailyNotes(apiBase, periodDays);
    
    if (notes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No daily notes found for the selected period" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${notes.length} daily notes`);
    
    // Step 2: Generate reflection with AI
    const reflection = await generateReflection(notes, periodDays);
    
    // Step 3: Create document in Craft
    const craftUrl = await createCraftDocument(apiBase, reflection);
    
    console.log("Brain reset complete!");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        craftUrl,
        notesProcessed: notes.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in brain reset:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
