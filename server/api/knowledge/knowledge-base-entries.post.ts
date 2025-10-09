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

    // Mock the chunks array based on word count
    const chunks = []
    const words = body.content.split(' ')
    const chunkSize = body.options?.chunkSize || 500
    
    for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '))
    }

    // Return the chunks
    return {
        chunks: chunks
    }
})
