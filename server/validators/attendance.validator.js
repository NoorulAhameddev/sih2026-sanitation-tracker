const { z } = require('zod');

const querySchema = z.object({
    query: z.object({
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        offset: z.string().regex(/^\d+$/).transform(Number).optional(),
        ward: z.string().trim().optional(),
        covered: z.enum(['Yes', 'No']).optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        q: z.string().trim().optional()
    })
});

const createSchema = z.object({
    body: z.object({
        worker_id: z.string().trim().min(1, 'Worker ID is required').max(50),
        worker_name: z.string().trim().min(1, 'Worker name is required').max(100),
        phone_number: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits').optional().default(''),
        route_id: z.string().trim().min(1, 'Route ID is required').max(50),
        ward: z.string().trim().min(1, 'Ward is required').max(50),
        covered: z.enum(['Yes', 'No'], {
            errorMap: () => ({ message: 'Covered status must be Yes or No' })
        }),
        complaints_received: z.coerce.number().int().min(0, 'Complaints cannot be negative').default(0),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        remarks: z.string().optional().default('')
    })
});

const updateSchema = z.object({
    body: z.object({
        worker_id: z.string().trim().min(1).max(50).optional(),
        worker_name: z.string().trim().min(1).max(100).optional(),
        phone_number: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits').optional(),
        route_id: z.string().trim().min(1).max(50).optional(),
        ward: z.string().trim().min(1).max(50).optional(),
        covered: z.enum(['Yes', 'No']).optional(),
        complaints_received: z.coerce.number().int().min(0).optional(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        remarks: z.string().optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update"
    })
});

module.exports = {
    querySchema,
    createSchema,
    updateSchema
};
