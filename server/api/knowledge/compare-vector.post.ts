export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.prompt) {
        throw createError({
            statusCode: 400,
            statusMessage: "Prompt is required"
        })
    }

    if (body.knowledgeBaseId === undefined || body.knowledgeBaseId === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Knowledge base ID is required"
        })
    }

    if (body.threshold === undefined || body.threshold === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Threshold is required"
        })
    }

    if (body.limiter === undefined || body.limiter === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Limiter is required"
        })
    }

    // Validate types
    if (typeof body.knowledgeBaseId !== 'number' || body.knowledgeBaseId <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Knowledge base ID must be a valid positive number"
        })
    }

    if (typeof body.threshold !== 'number' || body.threshold < 0 || body.threshold > 1) {
        throw createError({
            statusCode: 400,
            statusMessage: "Threshold must be a number between 0 and 1"
        })
    }

    if (typeof body.limiter !== 'number' || body.limiter <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Limiter must be a positive number"
        })
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock similar entries based on the prompt
    const mockEntries = [
        {
            id: "entry_similar_1",
            content: `This is a relevant entry that matches the prompt "${body.prompt}". It contains comprehensive information that would be useful for answering related questions.`,
            metadata: {
                category: "relevant",
                source: "knowledge-base"
            },
            similarity: 0.92
        },
        {
            id: "entry_similar_2", 
            content: `Another entry with good similarity to the query. This content provides additional context and related information that complements the user's request.`,
            metadata: {
                category: "contextual",
                source: "documentation"
            },
            similarity: 0.85
        },
        {
            id: "entry_similar_3",
            content: `A moderately relevant entry that has some connection to the prompt. While not as directly related, it still provides useful background information.`,
            metadata: {
                category: "background",
                source: "reference"
            },
            similarity: 0.73
        }
    ]

    // Filter by threshold and limit
    const filteredEntries = mockEntries
        .filter(entry => entry.similarity >= body.threshold)
        .slice(0, body.limiter)

    return {
        entries: filteredEntries
    }
})
