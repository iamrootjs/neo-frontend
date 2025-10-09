export default defineEventHandler(async (event) => {
    const knowledgeBaseId = getRouterParam(event, 'knowledgeBaseId')
    const entryId = getRouterParam(event, 'entryId')
    const body = await readBody(event)
    
    // Validate parameters
    if (!knowledgeBaseId || isNaN(parseInt(knowledgeBaseId))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid knowledge base ID"
        })
    }

    if (!entryId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Entry ID is required"
        })
    }

    // Validate request body - at least one field must be provided
    if (!body.content && !body.metadata && body.regenerateEmbedding === undefined) {
        throw createError({
            statusCode: 400,
            statusMessage: "At least one field (content, metadata, or regenerateEmbedding) must be provided"
        })
    }

    // Validate content if provided
    if (body.content !== undefined && (typeof body.content !== 'string' || body.content.trim().length === 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Content must be a non-empty string"
        })
    }

    // Validate metadata if provided
    if (body.metadata !== undefined && typeof body.metadata !== 'object') {
        throw createError({
            statusCode: 400,
            statusMessage: "Metadata must be an object"
        })
    }

    // Validate regenerateEmbedding if provided
    if (body.regenerateEmbedding !== undefined && typeof body.regenerateEmbedding !== 'boolean') {
        throw createError({
            statusCode: 400,
            statusMessage: "regenerateEmbedding must be a boolean"
        })
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 400))

    // Simulate entry not found for certain IDs
    if (entryId === "nonexistent" || entryId === "deleted") {
        throw createError({
            statusCode: 404,
            statusMessage: "Entry not found"
        })
    }

    // Mock the current entry data
    const currentEntry = {
        id: entryId,
        knowledgeBaseId: parseInt(knowledgeBaseId),
        content: "Original content that will be updated",
        metadata: {
            category: "General",
            tags: ["original", "tags"],
            source: "manual-entry"
        },
        createdAt: "2025-10-07T10:30:00.000Z",
        updatedAt: "2025-10-07T10:30:00.000Z"
    }

    // Update the entry with provided fields
    const updatedEntry = {
        ...currentEntry,
        content: body.content !== undefined ? body.content.trim() : currentEntry.content,
        metadata: body.metadata !== undefined ? { ...currentEntry.metadata, ...body.metadata } : currentEntry.metadata,
        updatedAt: new Date().toISOString()
    }

    return {
        entry: updatedEntry
    }
})
