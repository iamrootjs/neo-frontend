export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    
    // Validate knowledge base ID
    if (!id || isNaN(parseInt(id))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid knowledge base ID"
        })
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Simulate knowledge base not found for certain IDs
    if (id === "999" || id === "nonexistent") {
        throw createError({
            statusCode: 404,
            statusMessage: "Knowledge base not found"
        })
    }

    // Simulate successful deletion by returning 204 No Content
    setResponseStatus(event, 204)
    return null
})
