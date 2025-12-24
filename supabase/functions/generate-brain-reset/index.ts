import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Allowed origins for CORS - add your production domain here
const ALLOWED_ORIGINS = [
  'https://craftweek.site',
  'https://www.craftweek.site',
  'https://afwjxctaizfmwxflxtxb.lovableproject.com',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Check if origin is allowed (includes lovable preview domains)
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.lovableproject.com')) return true;
  if (origin.endsWith('.lovable.app')) return true;
  return false;
}

// Simple rate limiting: track requests per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // max requests per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  
  record.count++;
  return false;
}

function getCorsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Map internal errors to safe client messages
function getClientSafeError(error: Error): string {
  const message = error.message.toLowerCase();
  
  if (message.includes('ai service') || message.includes('lovable_api')) {
    return 'Service temporarily unavailable. Please try again later.';
  }
  if (message.includes('rate limit') || message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (message.includes('credits') || message.includes('402')) {
    return 'AI service quota exceeded. Please try again later.';
  }
  if (message.includes('craft') || message.includes('failed to create')) {
    return 'Unable to connect to Craft. Please check your server URL and token.';
  }
  if (message.includes('token') || message.includes('authorization') || message.includes('401')) {
    return 'Authentication failed. Please check your Craft API token.';
  }
  if (message.includes('no daily notes')) {
    return 'No daily notes found for the selected period.';
  }
  if (message.includes('validation')) {
    return 'Invalid input. Please check your server URL and try again.';
  }
  
  return 'An error occurred. Please try again.';
}

// Input validation schema using zod
const requestSchema = z.object({
  serverUrl: z.string()
    .min(1, "Server URL is required")
    .max(500, "Server URL is too long")
    .refine((url) => {
      try {
        const parsed = new URL(url);
        // Must be HTTPS and end with .craft.do domain
        return parsed.protocol === 'https:' && 
               (parsed.hostname.endsWith('.craft.do') || parsed.hostname === 'craft.do');
      } catch {
        return false;
      }
    }, "Must be a valid Craft server URL (https://*.craft.do)"),
  craftToken: z.string()
    .min(10, "Token is too short")
    .max(1000, "Token is too long")
    // Only allow safe characters in tokens
    .regex(/^[A-Za-z0-9_\-.]+$/, "Token contains invalid characters"),
  days: z.number()
    .int()
    .min(1)
    .max(30)
    .optional()
    .default(7),
});

interface DailyNote {
  id: string;
  date: string;
  content: string;
}

// Extract the API base URL from validated server URL
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
function extractMarkdown(block: unknown): string {
  if (!block || typeof block !== 'object') return '';
  
  const blockObj = block as Record<string, unknown>;
  let content = typeof blockObj.markdown === 'string' ? blockObj.markdown : '';
  
  if (Array.isArray(blockObj.content)) {
    for (const child of blockObj.content) {
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
      console.log(`Fetching daily note for ${dateStr}`);
      
      const response = await fetch(`${apiBase}/blocks?date=${encodeURIComponent(dateStr)}`, {
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
            id: typeof data.id === 'string' ? data.id : '',
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

// Format date range for display
function formatDateRange(notes: DailyNote[], days: number): string {
  if (notes.length === 0) return '';
  
  const sortedNotes = [...notes].sort((a, b) => a.date.localeCompare(b.date));
  const startDate = new Date(sortedNotes[0].date);
  const endDate = new Date(sortedNotes[sortedNotes.length - 1].date);
  
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' };
  
  const startStr = startDate.toLocaleDateString('en-US', formatOptions);
  const endStr = endDate.toLocaleDateString('en-US', formatOptions);
  const year = endDate.toLocaleDateString('en-US', yearOptions);
  
  // Calculate week number for the end date
  const startOfYear = new Date(endDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((endDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  
  if (days <= 7) {
    return `Week ${weekNumber} · ${endDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  
  return `${startStr} – ${endStr}, ${year}`;
}

// Generate weekly reflection using AI
async function generateReflection(notes: DailyNote[], days: number): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("AI service not configured");
  }
  
  const sortedNotes = notes.sort((a, b) => a.date.localeCompare(b.date));
  const combinedContent = sortedNotes
    .map(n => `## ${n.date}\n${n.content}`)
    .join('\n\n---\n\n');
  
  const periodLabel = formatDateRange(notes, days);
  
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
          content: `You are a calm, thoughtful assistant helping a knowledge worker process their notes into clarity.

Create a personal weekly reflection document. This is a ritual for mental clarity, not a report or summary.

DOCUMENT STRUCTURE (use exactly this format):

# Weekly Brain Reset

**${periodLabel}**

## 🎯 What Dominated My Week
Identify 3–5 dominant themes or focus areas from this period. Be specific and grounded in the actual content.

## ✅ Decisions I Actually Made
List concrete decisions, conclusions, or commitments that emerged. Only include what was actually decided.

## 🔄 Mental Clutter Still Open
List unresolved topics, pending questions, or items needing follow-up. These are mental weights to acknowledge.

## ⭐ One Thing That Mattered Most

> This week was really about **[identify the single most important thing from the notes]**.

Everything else revolved around it, whether consciously or not.

## ⚡ Next Week Commitments
Provide 3–5 actionable, forward-looking steps derived from the content. Be specific and practical.

## 💡 What This Week Is Teaching Me
Share high-level reflections, behavioral patterns, or notable trends observed across the period.

## 🧘 Weekly Closure

*Complete these to close the week:*

- What I should stop carrying into next week:
- One thing I want to protect:
- One intention for the next 7 days:

TONE & STYLE:
- Calm, reflective, practical
- No hype, no generic AI language, no filler
- Concise but meaningful—every line should add value
- Use bullet points for clarity
- Avoid repetition across sections
- For One Thing That Mattered Most, identify the core thread that everything else connects to
- Leave Weekly Closure prompts empty for the user to fill in
- This is a personal thinking tool, not content for others`
        },
        {
          role: "user",
          content: `Here are my daily notes from ${periodLabel}. Create my weekly brain reset reflection:\n\n${combinedContent}`
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
  console.log("Document created successfully");
  
  // Return a deep link to open Craft
  const blockId = result.items?.[0]?.id || result.id;
  return `craftdocs://open?blockId=${encodeURIComponent(blockId)}`;
}

serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get client IP for rate limiting
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   req.headers.get('cf-connecting-ip') || 
                   'unknown';
  
  // Check rate limit
  if (isRateLimited(clientIP)) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  // Validate required headers
  const apiKey = req.headers.get('apikey');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  
  try {
    // Parse and validate input
    const rawBody = await req.json();
    const validationResult = requestSchema.safeParse(rawBody);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(e => e.message).join(', ');
      console.log(`Validation failed: ${errorMessages}`);
      return new Response(
        JSON.stringify({ error: "Invalid input. Please check your server URL and token." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { serverUrl, craftToken, days } = validationResult.data;
    
    const apiBase = normalizeServerUrl(serverUrl);
    const periodDays = [7, 14, 30].includes(days) ? days : 7;
    
    console.log(`Starting brain reset for ${periodDays} days`);
    
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
    const reflection = await generateReflection(notes, periodDays);
    
    // Step 3: Create document in Craft
    const craftUrl = await createCraftDocument(apiBase, craftToken, reflection);
    
    console.log("Brain reset complete");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        craftUrl,
        notesProcessed: notes.length 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    // Log detailed error server-side only
    console.error("Error in brain reset:", {
      error: error instanceof Error ? error.stack : error,
      timestamp: new Date().toISOString(),
    });
    
    // Return safe error message to client
    const clientError = error instanceof Error 
      ? getClientSafeError(error) 
      : 'An error occurred. Please try again.';
    
    return new Response(
      JSON.stringify({ error: clientError }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});