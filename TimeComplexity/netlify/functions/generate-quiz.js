// NOTE: This uses the CommonJS module syntax required by Netlify Functions
const { GoogleGenAI } = require('@google/genai');

// The key is securely read from the environment variables set in Netlify
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Define the detailed prompt for 500 questions
const QUIZ_GENERATION_PROMPT = `
Generate a JSON array of exactly 500 unique multiple-choice questions about Time Complexity. The questions must be distributed as follows: 71 questions each for O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n), and 73 questions for O(n!). 

Each object in the array must have the following keys:
1. 'complexity': The correct Big-O complexity (e.g., 'O(N^2)').
2. 'language': One of ['java', 'python', 'c'] chosen randomly.
3. 'code': A complete, syntactically correct code snippet written in the specified 'language' that exhibits the 'complexity'.
4. 'options': An array of exactly four unique strings, including the correct complexity and three plausible distractors.
5. 'explanation': A brief, one-sentence explanation of why the 'code' has the 'complexity'.

Ensure the code snippets are highly varied and not repetitive. Only return the JSON array.
`;

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

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: [{ role: 'user', parts: [{ text: QUIZ_GENERATION_PROMPT }] }],
        });

        // 1. Clean the response to ensure pure JSON
        // The model often wraps JSON in ```json...```
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.lastIndexOf('```')).trim();
        }

        const quizData = JSON.parse(jsonText);

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
        console.error("Gemini API Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate quiz questions from API.", details: error.message }),
        };
    }
};