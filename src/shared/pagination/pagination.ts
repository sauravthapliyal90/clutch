import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function toSkipTake(params: PaginationParams){
    return {
        skip: (params.page -1) * params.limit,
        take: params.limit,
    }
} 

export interface paginationResult<T>{
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }
}

export function buildPaginationResult<T>(
    data: T[],
    total: number,
    params: PaginationParams
): paginationResult<T>{
    return {
        data, 
        meta: {
            page: params.page,
            limit: params.limit,
            total,
            totalPages: Math.ceil(total / params.limit),
        }
    }
}