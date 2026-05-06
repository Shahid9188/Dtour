const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fs = require('fs');

async function testModels() {
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
    let results = [];
    console.log("Using API Key starting with:", process.env.GEMINI_API_KEY.substring(0, 10));

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello!");
            results.push({ model: m, status: "SUCCESS", output: result.response.text() });
            console.log(`Model ${m} SUCCESS`);
        } catch (e) {
            results.push({ model: m, status: "FAILED", error: e.message });
            console.log(`Model ${m} FAILED: ${e.message}`);
        }
    }
    
    fs.writeFileSync('test_models.json', JSON.stringify({ key: process.env.GEMINI_API_KEY.substring(0, 10), results }, null, 2));
}

testModels();
