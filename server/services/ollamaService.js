const { Ollama } = require('ollama');

// Initialize Ollama client (default connects to http://127.0.0.1:11434)
const ollama = new Ollama();

const MODEL_NAME = 'llama3';

const parseJSONFromAI = (text) => {
    try {
        let cleanText = text.replace(/```json\n/gi, '').replace(/```\n?/g, '').trim();
        // basic trailing comma fix
        cleanText = cleanText.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(cleanText);
    } catch (e) {
        console.error('Failed to parse JSON from AI response:', text);
        throw new Error('AI returned invalid JSON format');
    }
};

const getOllamaResponse = async (systemInstruction, userDataStr) => {
    const response = await ollama.chat({
        model: MODEL_NAME,
        messages: [
            { role: 'system', content: systemInstruction + '\nRespond ONLY with valid JSON (no markdown, no backticks):' },
            { role: 'user', content: userDataStr }
        ],
        format: 'json' // This ensures the model restricts its output to valid JSON
    });
    return parseJSONFromAI(response.message.content);
};

const classifyPersonality = async (userData) => {
    const si = 'You are an AI travel personality classifier. Return a JSON object with a single key "personality" matching one of: Explorer, Luxury Seeker, Adventure Traveler, Culture Enthusiast, Relaxation Traveler.';
    return await getOllamaResponse(si, JSON.stringify(userData));
};

const generateItinerary = async (tripDetails) => {
    const si = `You are an expert AI travel planner creating detailed, personalized trip itineraries.
  The output MUST be a JSON array of objects representing days.
  Each day MUST have: dayNumber (number), date (string), theme (string), activities (array), aiTips (array of strings).
  Each activity MUST have: title, type, location, address, startTime (e.g. "09:00"), endTime, estimatedCost (number), currency, notes, weatherDependent (boolean), indoorAlternative (string).
  Personality-specific guidelines:
  - Explorer: hide gems, local spots
  - Luxury Seeker: 5-star, VIP
  - Adventure Traveler: outdoor, physical
  - Culture Enthusiast: museums, heritage
  - Relaxation Traveler: slow, spa, max 3 activities
  `;
    return await getOllamaResponse(si, JSON.stringify(tripDetails));
};

const replanItinerary = async (currentItinerary, reason, tripContext) => {
    const si = `You are an AI travel replanner. Given an itinerary array and a reason for change, return a JSON object with a single key "suggestedChanges" containing the FULL modified array of activities for that day, using the exact same schema for activities as provided.`;
    const payload = JSON.stringify({ currentItinerary, reason, tripContext });
    return await getOllamaResponse(si, payload);
};

const chatAssistant = async (history, newMessage, tripContext) => {
    const si = `You are a helpful travel assistant for a specific trip context: ${JSON.stringify(tripContext)}. 
  Respond ONLY with valid JSON string. For chat, return a JSON object with a single key "reply" containing your text response.`;

    const messages = [
        { role: 'system', content: si }
    ];

    // Format history for Ollama (it uses 'assistant' instead of 'model')
    history.forEach(msg => {
        messages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.content
        });
    });

    messages.push({ role: 'user', content: newMessage });

    const response = await ollama.chat({
        model: MODEL_NAME,
        messages: messages,
        format: 'json'
    });

    return parseJSONFromAI(response.message.content);
};

const optimizeBudget = async (tripData) => {
    const si = `You are a budget optimization AI. Analyze the trip details and expenses. Return a JSON object with "analysis" (string paragraph), "savingsOpportunities" (array of strings), and "adjustedBudgetBreakdown" (object with categories and suggested amounts).`;
    return await getOllamaResponse(si, JSON.stringify(tripData));
};

module.exports = {
    classifyPersonality,
    generateItinerary,
    replanItinerary,
    chatAssistant,
    optimizeBudget
};
