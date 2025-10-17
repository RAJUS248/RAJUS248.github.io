// NOTE: This uses the CommonJS module syntax required by Netlify Functions
const { GoogleGenAI } = require('@google/genai');

// The key is securely read from the environment variables set in Netlify
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// --- CRITICAL CHANGE: Reduce the request to a manageable size (50 questions) ---
// Define the detailed prompt for 50 questions
const QUIZ_GENERATION_PROMPT = `
Generate a JSON array of exactly 5 unique multiple-choice questions about Time Complexity. The questions must be distributed roughly evenly among the complexities O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n), and O(n!). 

Each object in the array must have the following keys:
1. 'complexity': The correct Big-O complexity (e.g., 'O(N^2)').
2. 'language': One of ['java', 'python', 'c'] chosen randomly.
3. 'code': A complete, syntactically correct code snippet written in the specified 'language' that exhibits the 'complexity'.
4. 'options': An array of exactly four unique strings, including the correct complexity and three plausible distractors.
5. 'explanation': A brief, one-sentence explanation of why the 'code' has the 'complexity'.

Ensure the code snippets are highly varied and not repetitive. Only return the JSON array.
`;
// -------------------------------------------------------------------------------


// Main handler for the Netlify Function
exports.handler = async (event, context) => {
    if (!GEMINI_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "GEMINI_API_KEY environment variable is not set." }),
        };
    }

    try {
        const ai = new GoogleGenAI(GEMINI_API_KEY);

        // Optional: Get parameters if you want to support changing the language/count from the frontend later
        const { language = 'Python', count = '50' } = event.queryStringParameters;
        
        // Note: We are ignoring the 'count' parameter for now, as we want a fixed, safe prompt,
        // but it's good practice to log or use the parameters if they are sent.

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: 'user', parts: [{ text: QUIZ_GENERATION_PROMPT }] }],
        });

        // **IMPROVEMENT: Check if the response text is valid before cleaning/parsing**
        if (!response.text || response.text.trim().length === 0) {
            throw new Error("Gemini API returned an empty response. This often indicates a timeout or network issue.");
        }

        // 1. Clean the response to ensure pure JSON
        // The model often wraps JSON in ```json...```
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            // Added defensive check for lastIndexOf
            const lastIndex = jsonText.lastIndexOf('```');
            jsonText = jsonText.substring(7, lastIndex > 7 ? lastIndex : jsonText.length).trim();
        }

        const quizData = JSON.parse(jsonText);
        
        // **IMPROVEMENT: Check if the parsed data is an array of questions**
        if (!Array.isArray(quizData) || quizData.length === 0) {
             throw new Error("Parsed JSON data is not a valid array of questions.");
        }

        // Optional: Log success for debugging
        console.log(`Successfully generated ${quizData.length} questions.`);


        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                // Essential for allowing your GitHub Pages/Netlify frontend to call this function
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(quizData),
        };

    } catch (error) {
        // Log the full error message for debugging in the Netlify dashboard
        console.error("Gemini API/Parsing Error:", error.message); 
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: "Failed to generate or parse quiz questions from API.", 
                details: error.message 
            }),
        };
    }
};


