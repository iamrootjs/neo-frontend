export default defineEventHandler(async (event) => {
    const knowledgeBaseId = getRouterParam(event, 'knowledgeBaseId')
    const body = await readBody(event)
    
    // Validate knowledge base ID
    if (!knowledgeBaseId || isNaN(parseInt(knowledgeBaseId))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid knowledge base ID"
        })
    }

    // Validate required fields
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Content is required and must be a non-empty string"
        })
    }

    // Validate metadata if provided
    if (body.metadata && typeof body.metadata !== 'object') {
        throw createError({
            statusCode: 400,
            statusMessage: "Metadata must be an object"
        })
    }

    // Validate generateEmbedding if provided
    if (body.generateEmbedding !== undefined && typeof body.generateEmbedding !== 'boolean') {
        throw createError({
            statusCode: 400,
            statusMessage: "generateEmbedding must be a boolean"
        })
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Generate a new entry ID
    const entryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create the new entry
    const newEntry = {
        id: entryId,
        knowledgeBaseId: parseInt(knowledgeBaseId),
        content: body.content.trim(),
        metadata: body.metadata || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    // Return 201 status for created resource
    setResponseStatus(event, 201)
    
    return {
        entry: newEntry
    }
})
