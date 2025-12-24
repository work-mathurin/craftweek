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

// Extract the API base URL from user-provided server URL
function normalizeServerUrl(serverUrl: string): string {
  let url = serverUrl.trim();
  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // Add /api/v1 if not present
  if (!url.endsWith('/api/v1')) {
    url = url + '/api/v1';
  }
  return url;
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

// Fetch daily notes for a date range
async function fetchDailyNotes(apiBase: string, craftToken: string, days: number): Promise<DailyNote[]> {
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
          'Authorization': `Bearer ${craftToken}`,
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

// Generate weekly reflection using AI
async function generateReflection(notes: DailyNote[]): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("AI service not configured");
  }
  
  const combinedContent = notes
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(n => `## ${n.date}\n${n.content}`)
    .join('\n\n---\n\n');
  
  console.log("Generating AI reflection...");
  
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
          content: `You are a thoughtful assistant helping a knowledge worker reflect on their week. 
Analyze their daily notes and create a structured weekly reflection document.

Your output should be in Markdown format with these exact sections:
# Weekly Brain Reset

## 🎯 Key Themes
Identify 3-5 recurring themes, topics, or focus areas from the week.

## ✅ Decisions Made
List important decisions that were made or conclusions that were reached.

## 🔄 Open Loops
Identify unfinished tasks, pending items, or things that need follow-up.

## ⚡ Next Actions
Suggest 3-5 concrete next actions based on the content.

## 💡 Insights & Patterns
Share any interesting patterns, insights, or observations about the week.

Be concise but insightful. Use bullet points. Focus on what matters.`
        },
        {
          role: "user",
          content: `Here are my daily notes from the past week. Please create a weekly reflection:\n\n${combinedContent}`
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
async function createCraftDocument(apiBase: string, craftToken: string, content: string): Promise<string> {
  console.log("Creating document in Craft...");
  
  // First, try to create at today's date. If that fails (e.g., trashed), create at root
  let response = await fetch(`${apiBase}/blocks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${craftToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      markdown: content,
      position: {
        position: "end",
        date: "today"
      }
    }),
  });
  
  // If today's note is trashed or unavailable, try creating without date positioning
  if (!response.ok) {
    const errorText = await response.text();
    console.log("First attempt failed, trying without date position:", errorText);
    
    // Try creating as a new document without specific date positioning
    response = await fetch(`${apiBase}/blocks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${craftToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markdown: content
      }),
    });
  }
  
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
    const { serverUrl, craftToken, days } = await req.json();
    
    if (!serverUrl) {
      return new Response(
        JSON.stringify({ error: "Craft server URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!craftToken) {
      return new Response(
        JSON.stringify({ error: "Craft API token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const apiBase = normalizeServerUrl(serverUrl);
    const periodDays = days === 14 ? 14 : 7;
    
    console.log(`Starting brain reset for ${periodDays} days using ${apiBase}...`);
    
    // Step 1: Fetch daily notes
    const notes = await fetchDailyNotes(apiBase, craftToken, periodDays);
    
    if (notes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No daily notes found for the selected period" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${notes.length} daily notes`);
    
    // Step 2: Generate reflection with AI
    const reflection = await generateReflection(notes);
    
    // Step 3: Create document in Craft
    const craftUrl = await createCraftDocument(apiBase, craftToken, reflection);
    
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
