export default defineEventHandler(async (event) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
        knowledgeBases: [
            {
                id: 1,
                name: "Technical Documentation",
                description: "Comprehensive technical documentation for our platform, including API references, deployment guides, and troubleshooting information.",
                chunking_strategy_id: 2,
                created_at: "2025-10-07T09:30:00.000Z",
                updated_at: "2025-10-08T14:46:19.820Z"
            },
            {
                id: 2,
                name: "Customer Support FAQ",
                description: "Frequently asked questions and support articles to help customer service representatives provide accurate and timely responses.",
                chunking_strategy_id: 1,
                created_at: "2025-10-06T14:15:30.456Z",
                updated_at: "2025-10-08T12:22:45.123Z"
            },
            {
                id: 3,
                name: "Product Knowledge Base",
                description: "Detailed product information, feature descriptions, and user guides for all our software products and services.",
                chunking_strategy_id: 3,
                created_at: "2025-10-05T16:45:12.789Z",
                updated_at: "2025-10-08T10:18:30.567Z"
            },
            {
                id: 4,
                name: "Training Materials",
                description: "Employee training resources, onboarding materials, and professional development content for internal use.",
                chunking_strategy_id: 4,
                created_at: "2025-10-04T11:20:45.321Z",
                updated_at: "2025-10-07T15:35:20.890Z"
            },
            {
                id: 5,
                name: "Legal & Compliance",
                description: "Legal documents, compliance guidelines, privacy policies, and regulatory information relevant to our business operations.",
                chunking_strategy_id: 1,
                created_at: "2025-10-03T08:10:15.654Z",
                updated_at: "2025-10-06T13:42:10.234Z"
            }
        ]
    }
})
