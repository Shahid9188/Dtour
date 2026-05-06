const PERSONALITY_PROFILES = {
    Explorer: {
        emoji: '🧭',
        tagline: 'Discover the undiscovered',
        description: 'You prefer to take the road less traveled. You want to see hidden gems and live like a local.',
        traits: ['Curious', 'Adaptable', 'Independent'],
        bestDestinations: ['Kyoto, Japan', 'Patagonia, Chile', 'Hanoi, Vietnam'],
        color: '#0D9488'
    },
    'Luxury Seeker': {
        emoji: '🥂',
        tagline: 'Only the best will do',
        description: 'You enjoy the finer things in life. 5-star hotels, fine dining, and maximum comfort are your priorities.',
        traits: ['Refined', 'Quality-focused', 'Relaxed'],
        bestDestinations: ['Maldives', 'Dubai, UAE', 'Monaco'],
        color: '#D97706'
    },
    'Adventure Traveler': {
        emoji: '🧗‍♂️',
        tagline: 'Thrill-seeking adrenaline junkie',
        description: 'You want to be active and challenged. Hiking, diving, and extreme sports define your ideal trip.',
        traits: ['Energetic', 'Brave', 'Active'],
        bestDestinations: ['Queenstown, NZ', 'Costa Rica', 'Interlaken, Switzerland'],
        color: '#DC2626'
    },
    'Culture Enthusiast': {
        emoji: '🏛️',
        tagline: 'Immersed in history and art',
        description: 'You travel to learn. Museums, historical ruins, and cultural performances are the highlights of your trips.',
        traits: ['Intellectual', 'Observant', 'Appreciative'],
        bestDestinations: ['Rome, Italy', 'Kyoto, Japan', 'Cairo, Egypt'],
        color: '#7C3AED'
    },
    'Relaxation Traveler': {
        emoji: '💆‍♀️',
        tagline: 'Chill vibes only',
        description: 'Your ideal vacation involves a beach, a good book, and minimal scheduling. You travel to unwind.',
        traits: ['Easy-going', 'Peaceful', 'Slow-paced'],
        bestDestinations: ['Bali, Indonesia', 'Tulum, Mexico', 'Fiji'],
        color: '#2563EB'
    }
};

const QUIZ_QUESTIONS = [
    {
        id: 'q1',
        text: 'What describes your ideal vacation vibe?',
        options: [
            { text: 'Finding a secret spot tourists don\'t know about', tag: 'Explorer' },
            { text: 'A private cabana with bottomless service', tag: 'Luxury Seeker' },
            { text: 'Something that gets my heart racing', tag: 'Adventure Traveler' },
            { text: 'Absorbing the local history and art', tag: 'Culture Enthusiast' },
            { text: 'Sleeping in and moving slowly', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q2',
        text: 'When it comes to food, you prefer:',
        options: [
            { text: 'Street food and local dive bars', tag: 'Explorer' },
            { text: 'Michelin-starred restaurants', tag: 'Luxury Seeker' },
            { text: 'Eating whatever I can grab on the go', tag: 'Adventure Traveler' },
            { text: 'Traditional multi-course cultural meals', tag: 'Culture Enthusiast' },
            { text: 'Room service or beachside cafes', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q3',
        text: 'Where do you want to sleep?',
        options: [
            { text: 'A quirky local Airbnb or homestay', tag: 'Explorer' },
            { text: 'The most expensive 5-star hotel in town', tag: 'Luxury Seeker' },
            { text: 'A tent under the stars or eco-lodge', tag: 'Adventure Traveler' },
            { text: 'A historic boutique hotel near the museum district', tag: 'Culture Enthusiast' },
            { text: 'An all-inclusive spa resort', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q4',
        text: 'What is your comfortable daily pace?',
        options: [
            { text: 'Exploring from dawn till dusk without a strict plan', tag: 'Explorer' },
            { text: 'A relaxed schedule with VIP transport', tag: 'Luxury Seeker' },
            { text: 'Packed tight with physical activities', tag: 'Adventure Traveler' },
            { text: 'Carefully timed museum entry and tours', tag: 'Culture Enthusiast' },
            { text: 'Maybe one activity a day, max', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q5',
        text: 'How do you plan your trips?',
        options: [
            { text: 'I pick a general direction and wander', tag: 'Explorer' },
            { text: 'I have my concierge or agent handle it', tag: 'Luxury Seeker' },
            { text: 'I plan around the main outdoor activity', tag: 'Adventure Traveler' },
            { text: 'I pre-book all museum tickets months in advance', tag: 'Culture Enthusiast' },
            { text: 'I just book the flight and the resort', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q6',
        text: 'What souvenir are you bringing home?',
        options: [
            { text: 'A unique item from a local flea market', tag: 'Explorer' },
            { text: 'Designer clothing or high-end jewelry', tag: 'Luxury Seeker' },
            { text: 'Gear or a new scar from doing something wild', tag: 'Adventure Traveler' },
            { text: 'Local art or history books', tag: 'Culture Enthusiast' },
            { text: 'A nice candle or massage oil', tag: 'Relaxation Traveler' }
        ]
    },
    {
        id: 'q7',
        text: 'How do your friends describe you?',
        options: [
            { text: 'Curious and independent', tag: 'Explorer' },
            { text: 'Classy and refined', tag: 'Luxury Seeker' },
            { text: 'Energetic and brave', tag: 'Adventure Traveler' },
            { text: 'Intellectual and observant', tag: 'Culture Enthusiast' },
            { text: 'Easy-going and peaceful', tag: 'Relaxation Traveler' }
        ]
    }
];

const scoreQuiz = (answers) => {
    const scores = {
        'Explorer': 0,
        'Luxury Seeker': 0,
        'Adventure Traveler': 0,
        'Culture Enthusiast': 0,
        'Relaxation Traveler': 0
    };

    answers.forEach(answer => {
        // Find the question and the selected option to see its tag
        const question = QUIZ_QUESTIONS.find(q => q.id === answer.questionId);
        if (question) {
            const option = question.options.find(o => o.text === answer.answer);
            if (option && scores[option.tag] !== undefined) {
                scores[option.tag] += 1;
            }
        }
    });

    let topPersonality = 'Explorer';
    let maxScore = -1;

    Object.keys(scores).forEach(tag => {
        if (scores[tag] > maxScore) {
            maxScore = scores[tag];
            topPersonality = tag;
        }
    });

    return {
        personality: topPersonality,
        scores,
        profile: PERSONALITY_PROFILES[topPersonality]
    };
};

module.exports = {
    QUIZ_QUESTIONS,
    PERSONALITY_PROFILES,
    scoreQuiz
};
