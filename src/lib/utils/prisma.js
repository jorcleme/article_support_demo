import { PrismaClient } from '@prisma/client';

export let prismadb = new PrismaClient({
    log: ['query', 'error']
});
