export default defineEventHandler(async (event) => {
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data for chunk strategies
    return {
        strategies: [
            {
                id: 1,
                name: "Fixed Size Chunking",
                slug: "fixed-size",
                description: "Splits text into chunks of a fixed character or token count. Simple and predictable, but may break semantic boundaries.",
                created_at: "2025-10-08T10:30:00.000Z",
                updated_at: "2025-10-08T14:40:32.068Z"
            },
            {
                id: 2,
                name: "Semantic Chunking",
                slug: "semantic",
                description: "Uses AI to identify natural breakpoints in text based on meaning and context. Preserves semantic coherence but requires more processing.",
                created_at: "2025-10-08T09:15:00.000Z",
                updated_at: "2025-10-08T13:22:15.123Z"
            },
            {
                id: 3,
                name: "Sentence Boundary",
                slug: "sentence-boundary",
                description: "Chunks text at sentence boundaries while respecting a maximum size limit. Balances readability with size constraints.",
                created_at: "2025-10-08T08:45:00.000Z",
                updated_at: "2025-10-08T12:10:45.456Z"
            },
            {
                id: 4,
                name: "Paragraph Chunking",
                slug: "paragraph",
                description: "Splits content by paragraphs, combining smaller paragraphs if needed. Maintains document structure and readability.",
                created_at: "2025-10-08T07:20:00.000Z",
                updated_at: "2025-10-08T11:55:30.789Z"
            },
            {
                id: 5,
                name: "Sliding Window",
                slug: "sliding-window",
                description: "Creates overlapping chunks with a sliding window approach. Ensures context continuity but increases storage requirements.",
                created_at: "2025-10-08T06:00:00.000Z",
                updated_at: "2025-10-08T10:35:20.012Z"
            }
        ]
    }
})