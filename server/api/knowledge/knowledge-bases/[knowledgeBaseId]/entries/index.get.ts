export default defineEventHandler(async (event) => {
    const knowledgeBaseId = getRouterParam(event, 'knowledgeBaseId')
    const query = getQuery(event)
    
    // Validate knowledge base ID
    if (!knowledgeBaseId || isNaN(parseInt(knowledgeBaseId))) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid knowledge base ID"
        })
    }

    // Parse query parameters
    const limit = parseInt(query.limit as string) || 50
    const offset = parseInt(query.offset as string) || 0
    const search = query.search as string || ''

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock entries data
    const allEntries = [
        {
            id: "entry_1",
            knowledgeBaseId: parseInt(knowledgeBaseId),
            content: "This is a comprehensive guide to setting up the development environment. It includes step-by-step instructions for installing dependencies, configuring environment variables, and running the application locally. The process involves setting up Node.js, installing npm packages, and configuring the database connection.",
            metadata: {
                category: "Development",
                tags: ["setup", "environment", "guide"],
                source: "documentation"
            },
            createdAt: "2025-10-08T10:30:00.000Z",
            updatedAt: "2025-10-08T14:45:30.000Z"
        },
        {
            id: "entry_2", 
            knowledgeBaseId: parseInt(knowledgeBaseId),
            content: "Authentication and authorization are critical components of any secure application. This entry explains how to implement JWT-based authentication, role-based access control, and secure API endpoints. It covers token generation, validation, and refresh mechanisms.",
            metadata: {
                category: "Security",
                tags: ["authentication", "security", "jwt"],
                source: "security-docs"
            },
            createdAt: "2025-10-07T15:20:00.000Z",
            updatedAt: "2025-10-08T09:15:20.000Z"
        },
        {
            id: "entry_3",
            knowledgeBaseId: parseInt(knowledgeBaseId),
            content: "API documentation provides detailed information about all available endpoints, request/response formats, and authentication requirements. Each endpoint includes examples, parameter descriptions, and error codes to help developers integrate effectively.",
            metadata: {
                category: "API",
                tags: ["api", "documentation", "endpoints"],
                source: "api-docs"
            },
            createdAt: "2025-10-06T12:10:00.000Z",
            updatedAt: "2025-10-07T16:30:45.000Z"
        },
        {
            id: "entry_4",
            knowledgeBaseId: parseInt(knowledgeBaseId),
            content: "Database schema design principles focus on normalization, indexing strategies, and performance optimization. This includes table relationships, foreign key constraints, and query optimization techniques for better application performance.",
            metadata: {
                category: "Database",
                tags: ["database", "schema", "optimization"],
                source: "db-docs"
            },
            createdAt: "2025-10-05T09:45:00.000Z",
            updatedAt: "2025-10-06T11:20:15.000Z"
        },
        {
            id: "entry_5",
            knowledgeBaseId: parseInt(knowledgeBaseId),
            content: "Deployment strategies and CI/CD pipelines ensure reliable and automated software delivery. This covers containerization with Docker, orchestration with Kubernetes, and automated testing workflows that maintain code quality.",
            metadata: {
                category: "DevOps",
                tags: ["deployment", "cicd", "docker"],
                source: "devops-guide"
            },
            createdAt: "2025-10-04T14:30:00.000Z",
            updatedAt: "2025-10-05T08:45:30.000Z"
        }
    ]

    // Filter entries based on search query
    let filteredEntries = allEntries
    if (search) {
        filteredEntries = allEntries.filter(entry => 
            entry.content.toLowerCase().includes(search.toLowerCase()) ||
            entry.metadata.category.toLowerCase().includes(search.toLowerCase()) ||
            entry.metadata.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        )
    }

    // Apply pagination
    const paginatedEntries = filteredEntries.slice(offset, offset + limit)
    
    return {
        entries: paginatedEntries,
        pagination: {
            limit,
            offset,
            total: filteredEntries.length
        }
    }
})
