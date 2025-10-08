export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.content) {
        throw createError({
            statusCode: 400,
            statusMessage: "Content is required"
        })
    }

    if (body.knowledgeBaseId === undefined || body.knowledgeBaseId === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Knowledge base ID is required"
        })
    }

    // Validate knowledge base ID is a number
    if (typeof body.knowledgeBaseId !== 'number' || body.knowledgeBaseId < 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Knowledge base ID must be a valid positive number"
        })
    }

    // Validate options if provided
    if (body.options) {
        if (body.options.chunkSize !== undefined && (typeof body.options.chunkSize !== 'number' || body.options.chunkSize <= 0)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Chunk size must be a positive number"
            })
        }

        if (body.options.chunkOverlap !== undefined && (typeof body.options.chunkOverlap !== 'number' || body.options.chunkOverlap < 0)) {
            throw createError({
                statusCode: 400,
                statusMessage: "Chunk overlap must be a non-negative number"
            })
        }
    }


    // Mock processing - simulate chunking the content
    const wordCount = body.content.split(' ').length
    const estimatedChunks = Math.ceil(wordCount / (body.options?.chunkSize || 500))

    // Mock creation response
    const newEntry = {
        id: Math.floor(Math.random() * 10000) + 1000,
        content: body.content,
        knowledgeBaseId: body.knowledgeBaseId,
        options: {
            chunkSize: body.options?.chunkSize || 500,
            chunkOverlap: body.options?.chunkOverlap || 50,
            ...body.options
        },
        metadata: {
            category: body.metadata?.category || "general",
            wordCount: wordCount,
            estimatedChunks: estimatedChunks,
            ...body.metadata
        },
        status: "processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    // Return the created entry
    return newEntry
})