const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const parseJSONFromAI = (text) => {
    try {
        let cleanText = text.replace(/```json\n/gi, '').replace(/```\n?/g, '').trim();
        cleanText = cleanText.replace(/,\s*([\]}])/g, '$1');
        return JSON.parse(cleanText);
    } catch (e) {
        console.error('Failed to parse JSON from AI response:', text);
        throw new Error('AI returned invalid JSON format');
    }
};

const getGeminiResponse = async (systemInstruction, userDataStr, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const currentModel = genAI.getGenerativeModel({ 
                model: 'gemini-2.5-flash',
                systemInstruction: systemInstruction + '\nRespond ONLY with valid JSON (no markdown, no backticks):'
            });
            const chat = currentModel.startChat();
            const result = await chat.sendMessage(userDataStr);
            const response = await result.response;
            return parseJSONFromAI(response.text());
        } catch (err) {
            if (err.message?.includes('429') && attempt < retries) {
                const wait = attempt * 15000;
                console.log(`Rate limited. Retry ${attempt}/${retries} in ${wait / 1000}s...`);
                await new Promise(r => setTimeout(r, wait));
            } else {
                throw err;
            }
        }
    }
};

const classifyPersonality = async (userData) => {
    const si = 'You are an AI travel personality classifier. Return a JSON object with a single key "personality" matching one of: Explorer, Luxury Seeker, Adventure Traveler, Culture Enthusiast, Relaxation Traveler.';
    return await getGeminiResponse(si, JSON.stringify(userData));
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
    return await getGeminiResponse(si, JSON.stringify(tripDetails));
};

const replanItinerary = async (currentItinerary, reason, tripContext) => {
    const si = `You are an AI travel replanner. Given an itinerary array and a reason for change, return a JSON object with a single key "suggestedChanges" containing the FULL modified array of activities for that day, using the exact same schema for activities as provided.`;
    const payload = JSON.stringify({ currentItinerary, reason, tripContext });
    return await getGeminiResponse(si, payload);
};

const chatAssistant = async (history, newMessage, tripContext) => {
    const chatAssistantModel = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are a helpful travel assistant for a specific trip context: ${JSON.stringify(tripContext)}. 
  Respond ONLY with valid JSON. For chat, return a JSON object with a single key "reply" containing your text response.`
    });
    
    const chat = chatAssistantModel.startChat({
        history: history.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        })),
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return parseJSONFromAI(response.text());
};

const optimizeBudget = async (tripData) => {
    const si = `You are a budget optimization AI. Analyze the trip details and expenses. Return a JSON object with "analysis" (string paragraph), "savingsOpportunities" (array of strings), and "adjustedBudgetBreakdown" (object with categories and suggested amounts).`;
    return await getGeminiResponse(si, JSON.stringify(tripData));
};

module.exports = {
    classifyPersonality,
    generateItinerary,
    replanItinerary,
    chatAssistant,
    optimizeBudget
};
