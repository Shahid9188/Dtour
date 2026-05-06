require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const models = ['gemini-2.0-flash-lite', 'gemini-2.5-flash-preview-05-20', 'gemini-2.0-flash'];
    
    for (const name of models) {
        try {
            console.log(`Testing ${name}...`);
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent('Reply with only: {"reply":"ok"}');
            const text = result.response.text();
            console.log(`  SUCCESS: ${text.trim()}`);
            break;
        } catch (err) {
            const is429 = err.message.includes('429');
            const is404 = err.message.includes('404');
            console.log(`  ${is429 ? 'RATE_LIMITED' : is404 ? 'NOT_FOUND' : 'ERROR'}: ${err.message.substring(0, 200)}`);
        }
    }
}

test();
