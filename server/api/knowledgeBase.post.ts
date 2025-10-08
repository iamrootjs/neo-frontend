export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name) {
        throw createError({
            statusCode: 400,
            statusMessage: "Name is required"
        })
    }

    if (!body.description) {
        throw createError({
            statusCode: 400,
            statusMessage: "Description is required"
        })
    }

    if (body.chunkingStrategyId === undefined || body.chunkingStrategyId === null) {
        throw createError({
            statusCode: 400,
            statusMessage: "Chunking strategy ID is required"
        })
    }

    // Validate chunking strategy ID is a number
    if (typeof body.chunkingStrategyId !== 'number' || body.chunkingStrategyId <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Chunking strategy ID must be a valid positive number"
        })
    }

    // Validate name length
    if (body.name.trim().length < 3) {
        throw createError({
            statusCode: 400,
            statusMessage: "Name must be at least 3 characters long"
        })
    }

    if (body.name.trim().length > 100) {
        throw createError({
            statusCode: 400,
            statusMessage: "Name must be no more than 100 characters long"
        })
    }

    // Validate description length
    if (body.description.trim().length < 10) {
        throw createError({
            statusCode: 400,
            statusMessage: "Description must be at least 10 characters long"
        })
    }

    if (body.description.trim().length > 500) {
        throw createError({
            statusCode: 400,
            statusMessage: "Description must be no more than 500 characters long"
        })
    }

    // Mock creation - generate a new knowledge base
    const newKnowledgeBase = {
        id: Math.floor(Math.random() * 10000) + 1000,
        name: body.name.trim(),
        description: body.description.trim(),
        chunking_strategy_id: body.chunkingStrategyId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    // Return the created knowledge base
    return newKnowledgeBase
})