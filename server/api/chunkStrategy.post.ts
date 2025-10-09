export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Validate required fields
    if (!body.name) {
        throw createError({
            statusCode: 400,
            statusMessage: "Name is required"
        })
    }

    if (!body.slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Slug is required"
        })
    }

    if (!body.description) {
        throw createError({
            statusCode: 400,
            statusMessage: "Description is required"
        })
    }

    // Mock creation - generate a new ID and timestamps
    const newStrategy = {
        id: Math.floor(Math.random() * 1000) + 100, // Generate random ID
        name: body.name,
        slug: body.slug,
        description: body.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    // Return the created strategy wrapped in object
    return {
        chunkingStrategy: newStrategy
    }
})