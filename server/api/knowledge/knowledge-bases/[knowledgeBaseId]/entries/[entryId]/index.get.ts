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
    await new Promise(resolve => setTimeout(resolve, 200))

    // Mock entry data - in real implementation, this would fetch from database
    const mockEntry = {
        id: entryId,
        knowledgeBaseId: parseInt(knowledgeBaseId),
        content: "This is a detailed explanation of the specific topic requested. It provides comprehensive information including examples, best practices, and implementation details that are relevant to the user's query.",
        metadata: {
            category: "General",
            tags: ["information", "details", "example"],
            source: "manual-entry",
            lastModifiedBy: "admin"
        },
        createdAt: "2025-10-07T10:30:00.000Z",
        updatedAt: "2025-10-08T15:45:30.000Z"
    }

    // Simulate entry not found for certain IDs
    if (entryId === "nonexistent" || entryId === "deleted") {
        throw createError({
            statusCode: 404,
            statusMessage: "Entry not found"
        })
    }

    return {
        entry: mockEntry
    }
})
