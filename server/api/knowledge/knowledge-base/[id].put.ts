export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // Validate knowledge base ID
    if (!id || isNaN(parseInt(id))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid knowledge base ID"
        })
    }

    // Validate at least one field is provided
    if (!body.name && !body.description && !body.chunkingStrategyId) {
        throw createError({
            statusCode: 400,
            statusMessage: "At least one field (name, description, or chunkingStrategyId) is required"
        })
    }

    // Validate fields if provided
    if (body.name && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Name must be a non-empty string"
        })
    }

    if (body.description && (typeof body.description !== 'string' || body.description.trim().length === 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Description must be a non-empty string"
        })
    }

    if (body.chunkingStrategyId && (typeof body.chunkingStrategyId !== 'number' || body.chunkingStrategyId <= 0)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Chunking strategy ID must be a positive number"
        })
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock successful update - in a real implementation, this would update the database
    const updatedKnowledgeBase = {
        id: parseInt(id),
        name: body.name || "Updated Knowledge Base",
        description: body.description || "Updated description for the knowledge base",
        chunking_strategy_id: body.chunkingStrategyId || 1,
        created_at: "2025-10-07T09:30:00.000Z",
        updated_at: new Date().toISOString()
    }

    // Return the updated knowledge base
    return {
        knowledgeBase: updatedKnowledgeBase
    }
})
