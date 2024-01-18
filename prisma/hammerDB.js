import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: [
        { level: 'warn', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'query', emit: 'event' }
    ]
});

prisma.$on('warn', (e) => {
    console.log(e);
});

prisma.$on('info', (e) => {
    console.log(e);
});

prisma.$on('error', (e) => {
    console.log(e);
});

async function relateArticleToCatalyst1200() {
    const c1200Devices = await prisma.device.findMany({
        where: {
            pid: {
                startsWith: 'C1300'
            }
        }
    });

    const art1 = await prisma.article.findFirst({
        where: {
            title: 'New to Cisco Business: How to Download and Upgrade Firmware on any Device'
        }
    });

    const art2 = await prisma.article.findFirst({
        where: {
            title: 'How to Log into the Web User Interface (UI) of a Cisco Business Switch'
        }
    });

    for (const device of c1200Devices) {
        await prisma.articlesOnDevices.create({
            data: {
                device: {
                    connect: {
                        id: device.id
                    }
                },
                article: {
                    connect: {
                        id: art1.id
                    }
                }
            }
        });

        await prisma.articlesOnDevices.create({
            data: {
                device: {
                    connect: {
                        id: device.id
                    }
                },
                article: {
                    connect: {
                        id: art2.id
                    }
                }
            }
        });
    }
}

await relateArticleToCatalyst1200();
