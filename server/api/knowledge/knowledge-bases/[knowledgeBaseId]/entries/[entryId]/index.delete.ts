export default defineEventHandler(async (event) => {
    const knowledgeBaseId = getRouterParam(event, 'knowledgeBaseId')
    const entryId = getRouterParam(event, 'entryId')
    
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

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Simulate entry not found for certain IDs
    if (entryId === "nonexistent" || entryId === "deleted") {
        throw createError({
            statusCode: 404,
            statusMessage: "Entry not found"
        })
    }

    // Simulate successful deletion by returning 204 No Content
    setResponseStatus(event, 204)
    
    // Return empty response for 204 status
    return null
})
