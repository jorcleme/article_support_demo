/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { Configuration, OpenAIApi } from 'openai';
import pgvector from 'pgvector/utils';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import {
    getNumDownlinkPorts,
    getNumUplinkPorts,
    getPlugType,
    replaceWhiteSpace,
    getDownlinkPortSpeed,
    getUplinkPortSpeed
} from './db_helpers.js';

dotenv.config();

const API_KEY = process.env.VITE_OPENAI_API_KEY;

const CBS_350 = [
    'CBS350-8T-E-2G',
    'CBS350-8P-2G',
    'CBS350-8P-E-2G',
    'CBS350-8FP-2G',
    'CBS350-8FP-E-2G',
    'CBS350-8S-E-2G',
    'CBS350-16T-2G',
    'CBS350-16T-E-2G',
    'CBS350-16P-2G',
    'CBS350-16P-E-2G',
    'CBS350-16FP-2G',
    'CBS350-24T-4G',
    'CBS350-24P-4G',
    'CBS350-24FP-4G',
    'CBS350-24S-4G',
    'CBS350-48T-4G',
    'CBS350-48P-4G',
    'CBS350-48FP-4G',
    'CBS350-24T-4X',
    'CBS350-24P-4X',
    'CBS350-24FP-4X',
    'CBS350-48T-4X',
    'CBS350-48P-4X',
    'CBS350-48FP-4X',
    'CBS350-8MGP-2X',
    'CBS350-8MP-2X',
    'CBS350-24MGP-4X',
    'CBS350-12NP-4X',
    'CBS350-24NGP-4X',
    'CBS350-48NGP-4X',
    'CBS350-8XT',
    'CBS350-12XS',
    'CBS350-12XT',
    'CBS350-16XTS',
    'CBS350-24XS',
    'CBS350-24XT',
    'CBS350-24XTS',
    'CBS350-48XT-4X'
];

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

// Define a function that will relate an article to a video. A video can only relate to one article but an article can have multiple videos
/**
 *
 * @param {Array<{ article_id: string, video_id: string }>} obj
 */
async function addRelatedArticleToVideo(obj) {
    for (const { article_id, video_id } of obj) {
        const updatedVideo = await prisma.video.update({
            where: {
                id: video_id
            },
            data: {
                article: {
                    connect: {
                        id: article_id
                    }
                }
            },
            include: {
                article: true
            }
        });
    }
}

// Define a function that will take an object, query the db for videos that match the id of the object, and update the video with title_embeddings and description_embeddings using raw queries
async function createVideoEmbeddings(listIdsAndEmbeddings) {
    let resultEmbeddings = [];
    for (const { id, title_embedding, description_embedding } of listIdsAndEmbeddings) {
        const titleEmbeddings = pgvector.toSql([...title_embedding]);
        const descriptionEmbeddings = pgvector.toSql([...description_embedding]);
        // Update the video with the embedding. Note, we have to use the raw query because Prisma does not support the to_sql function
        const result =
            await prisma.$queryRaw`UPDATE "Video" SET title_embeddings = ${titleEmbeddings}::vector, description_embeddings = ${descriptionEmbeddings}::vector WHERE id = ${id}::uuid`;
        console.log(`Title Result: ${result}`);
        resultEmbeddings.push(result);
    }
    return resultEmbeddings;
}

// Define a function that will take a family object as parameter. The family object will have a field named "videos". We need to loop through the videos and insert them into the database. We will use the Prisma client to do this.
/**
 *
 * @param {{ shortName: string[], videos: any[]}} family
 */
async function createVideos(family) {
    console.log(family);
    const videos = family.videos.slice(0);
    const familyShortName = family.shortName;

    // The family shortname will help us find the devices associated with the family
    const devices = await prisma.device.findMany({
        where: {
            OR: familyShortName.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });

    // Loop through the videos and insert them into the database
    // A relation must be created between video and every device in the family
    for (const video of videos) {
        // Check if the video already exists in the database
        const existingVideo = await prisma.video.findFirst({
            where: {
                title: video.title
            }
        });
        if (existingVideo) {
            console.log('Video already exists: ', existingVideo);
            devices.forEach(async (device) => {
                await prisma.videosOnDevices.create({
                    data: {
                        video: {
                            connect: {
                                id: existingVideo.id
                            }
                        },
                        device: {
                            connect: {
                                id: device.id
                            }
                        }
                    }
                });
            });
        } else {
            const newVideo = await prisma.video.create({
                data: {
                    doc_type: ['video'],
                    topics: Array.isArray(video.topics) ? video.topics : [video.topics] || [],
                    title: video.title,
                    condensed_title: null,
                    title_ml: null,
                    description: video.description,
                    category: video.category
                        ? video.category
                        : video.tags
                        ? video.tags
                        : 'Configuration',
                    embed_url: video.URL,
                    link_youtube: video.URL,
                    link_cisco: video.ciscoUrl || null,
                    published_date: video['Published_date'],
                    duration: video.Duration,
                    tags_ml: [],
                    views: +video.Views,
                    likes: +video.Likes
                }
            });
            devices.forEach(async (device) => {
                await prisma.videosOnDevices.create({
                    data: {
                        video: {
                            connect: {
                                id: newVideo.id
                            }
                        },
                        device: {
                            connect: {
                                id: device.id
                            }
                        }
                    }
                });
            });
            console.log('New Video: ', newVideo);
        }
    }
}

// Create a function that will use TensorFlow in order to create vector embeddings for the articles
// we should train the model based on a few columns of data from the articles table
// The columns we should train are title, objective, intro, firmwareVersion, and steps
/**
 *
 * @param {Array<{id: string, objective_embedding: Array<number>, title_embedding: Array<number>}>} listIdsAndEmbeddings
 */
async function createEmbeddingsForArticles(listIdsAndEmbeddings) {
    let resultEmbeddings = [];
    for (const { id, objective_embedding, title_embedding } of listIdsAndEmbeddings) {
        const objectiveEmbeddings = pgvector.toSql([...objective_embedding]);
        const titleEmbeddings = pgvector.toSql([...title_embedding]);
        // Update the article with the embedding. Note, we have to use the raw query because Prisma does not support the to_sql function
        const objectiveResult =
            await prisma.$queryRaw`UPDATE "Article" SET objective_embeddings = ${objectiveEmbeddings}::vector WHERE id = ${id}::uuid`;
        console.log(`Objective Result: ${objectiveResult}`);
        resultEmbeddings.push(objectiveResult);
        const titleResult =
            await prisma.$queryRaw`UPDATE "Article" SET title_embeddings = ${titleEmbeddings}::vector WHERE id = ${id}::uuid`;
        console.log(`Title Result: ${titleResult}`);
        resultEmbeddings.push(titleResult);
    }
    return resultEmbeddings;

    // This section of code is for testing purposes only. We are querying the embeddings for one article and then querying the database for the 10 most similar articles
    // const [oneArticle] =
    //     await prisma.$queryRaw`SELECT id, vector::text FROM "Article" WHERE title = 'Configure SNMP Views on CBS220'`;
    // console.log('One Article: ', oneArticle);
    // const oneArticleEmbeddings = JSON.parse(oneArticle.vector);
    // console.log('One Article Embeddings: ', oneArticleEmbeddings, typeof oneArticleEmbeddings);
    // const vec = pgvector.toSql([...oneArticleEmbeddings]);
    // const relatedArticles =
    //     await prisma.$queryRaw`SELECT id, title, vector::text FROM "Article" WHERE id != ${oneArticle.id}::uuid
    //     ORDER BY vector <-> ${vec}::vector LIMIT 10`;
    // console.log('Related Articles: ', relatedArticles);
    // return relatedArticles;
}

// A function to create the articles for the product family. Some articles may already exist in the database. If they do, connect the existing article to the device. If they don't, create the article and connect it to the device
/**
 *
 * @param {{articles: Array<{ applicable_devices: Array<object> }>, family: string, shortName: string[] }} family
 */
async function createArticles(family) {
    console.log('Creating articles for ' + family.family);
    const familyNames = family.shortName;
    const devices = await prisma.device.findMany({
        where: {
            OR: familyNames.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });

    for (const article of family.articles) {
        // Check if the article already exists in the database
        const existingArticle = await prisma.article.findFirst({
            where: {
                title: article.title
            },
            include: {
                steps: true
            }
        });
        if (existingArticle) {
            console.log('Article already exists: ', existingArticle);
            devices.forEach(async (device) => {
                await prisma.articlesOnDevices.create({
                    data: {
                        article: {
                            connect: {
                                id: existingArticle.id
                            }
                        },
                        device: {
                            connect: {
                                id: device.id
                            }
                        }
                    }
                });
            });
        } else {
            const newArticle = await prisma.article.create({
                data: {
                    title: article.title,
                    condensed_title: article.title,
                    title_ml: article.title,
                    firmware_version:
                        Array.isArray(article.applicable_devices) &&
                        article.applicable_devices.length > 0
                            ? article.applicable_devices[0].software_version ?? '0.0.0'
                            : null,
                    objective: article.objective ? replaceWhiteSpace(article.objective) : null,
                    intro: article.intro ? replaceWhiteSpace(article.intro) : null,
                    steps: {
                        createMany: {
                            data: article.steps.map((step) => ({
                                section: step.section ?? null,
                                step_number: String(step.step_number) ?? null,
                                text: step.text ?? null,
                                src: step.src ?? null,
                                alt: step.alt ?? null,
                                note: step.note ?? null,
                                ml_summary: step['ml_summary'] ?? step.text ?? null,
                                mobile_summary: step['mobile_summary'] ?? step.text ?? null
                            }))
                        }
                    }
                }
            });
            devices.forEach(async (device) => {
                await prisma.articlesOnDevices.create({
                    data: {
                        article: {
                            connect: {
                                id: newArticle.id
                            }
                        },
                        device: {
                            connect: {
                                id: device.id
                            }
                        }
                    }
                });
            });
            console.log('New Article: ', newArticle);
        }
    }
}

// Create Devices according to the Prisma schema model Device. Seed the database
/**
 *
 * @param {{devices: Array<{pid: string}>}} family
 */
async function createDevices(family) {
    // Pull the device data from the product family and put it into an array. The family param is an object.
    // The devices data will be an array of objects with the key "devices". Each "device" is an object.
    const deviceData = family.devices.map((device) => {
        const pid = device.pid;
        // const datasheetUrl = family.datasheetUrl.find(
        //     (deviceData) => deviceData.pid === pid
        // ).datasheet;
        // const firmwareIndex = family.firmwareUrl.findIndex((d) => d.pid === pid);
        // const firmwareUrl = family.firmwareUrl[firmwareIndex].firmware;
        return {
            pid: pid,
            device_type: device.deviceType,
            datasheet_url: null,
            firmware_url: null
        };
    });

    // Cannot create/connect relations with createMany API. You cannot nest create, createMany, connect, connectOrCreate inside a top-level createMany
    await Promise.all(
        deviceData.map(async (device) => {
            await prisma.device.create({
                data: device
            });
        })
    );
}

// Create the ProductFamily data according to the Prisma schema model ProductFamily. Seed the database
async function createProductFamily(fam) {
    const devices = await prisma.device.findMany({
        where: {
            OR: fam.shortName.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });
    return await prisma.productFamily.create({
        data: {
            family: fam.family,
            admin_guide_url: fam.adminGuideUrl,
            product_support_page_url: fam.productSupportPageUrl,
            emulator_url: fam.emulatorUrl,
            short_name: fam.shortName,
            devices: {
                connect: devices.map((device) => ({ id: device.id }))
            }
        }
    });
}
/**
 *
 * @param {{ shortName: string[], devices: Array<{pid: string}> }} family
 */
async function createRouterData(family) {
    const devices = await prisma.device.findMany({
        where: {
            OR: family.shortName.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });

    const routerData = family.devices.map((device) => {
        const pid = device.pid.trim();
        const foundDevice = devices.find((d) => d.pid === pid);

        return {
            num_interfaces: parseInt(device.num_interfaces),
            rack_mountable: device.rack_mountable ? device.rack_mountable : false,
            qos: device.qos ? device.qos : 'N/A',
            wpa: device.wpa,
            wpa2: device.wpa2,
            wan_ports: parseInt(device.wan_ports),
            lan_ports: parseInt(device.lan_ports),
            usb_ports: parseInt(device.usb_ports),
            firewall: device.firewall,
            layer_2_tunneling: device.layer_2_tunneling ? device.layer_2_tunneling : false,
            layer_2_tunneling_ipsec: device.layer_2_tunneling_ipsec
                ? device.layer_2_tunneling_ipsec
                : false,
            num_of_vlans: parseInt(device.num_of_vlans),
            port_security: device.port_security,
            link_aggregation: device.link_aggregation,
            nat_max_session: device.nat_max_sessions ? Number(device.nat_max_sessions) : 0,
            cpu: device.cpu,
            ram: device.ram,
            flash: device.flash,
            antennas: device.antennas,
            access_control: device.access_control,
            hardware_dmz: device.hardware_dmz,
            dmz_host: Boolean(device.dmz_host),
            cisco_ssl_vpn_anyconnect: device.cisco_ssl_vpn_anyconnect,
            unit_weight: device.unit_weight,
            unit_dimensions: device.unit_dimensions,
            mtbf: device.mtbf,
            package_contents: [...device.package_contents] || [],
            device: {
                connect: {
                    id: foundDevice.id
                }
            }
        };
    });

    const routers = await Promise.all(
        routerData.map(async (data) => {
            return await prisma.router.create({ data: data });
        })
    );

    console.log('Routers entered into Database: ', routers);
}

/**
 *
 * @param {{ shortName: string[], devices: Array<{pid: string}> }} family
 */
async function createWirlessData(family) {
    const devices = await prisma.device.findMany({
        where: {
            OR: family.shortName.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });

    const wirlessData = family.devices.map((device) => {
        const pid = device.pid.trim();
        const foundDevice = devices.find((d) => d.pid === pid);

        return {
            max_clients: device.max_clients,
            max_num_access_points: device.max_num_access_points,
            max_num_mesh_extenders: device.max_num_mesh_extenders,
            available_transmit_power_settings: device.available_transmit_power_settings,
            integrated_antennas: device.integrated_antennas,
            interfaces: [...device['interfaces']] || [],
            i_eee_spec: device.i_eee_spec,
            unit_weight: device.unit_weight,
            unit_dimensions: device.unit_dimensions,
            ethernet_ports: [...device['ethernet_ports']] || [],
            indicators: device.indicators,
            power_draw: device.power_draw,
            product_material_info_url: device.product_material_info_url,
            electronic_waste_laws_info_url: device.electronic_waste_laws_info_url,
            wpa2: device.wpa2 ? device.wpa2 : false,
            ipv6: device.ipv6 ? device.ipv6 : false,
            qos: device.qos ? device.qos : 'N/A',
            device: {
                connect: {
                    id: foundDevice.id
                }
            }
        };
    });

    const WAPs = await Promise.all(
        wirlessData.map(async (data) => {
            return await prisma.wireless.create({ data: data });
        })
    );

    console.log('WAPs entered into DB: ', WAPs);
}
// Create the switch data according to the Prisma schema model Switch. Seed the database
/**
 *
 * @param {{family: string, devices: []}} fam
 */
async function createSwitchData(fam) {
    const devices = await prisma.device.findMany({
        where: {
            OR: fam.shortName.map((name) => {
                return {
                    pid: {
                        startsWith: name
                    }
                };
            })
        }
    });
    console.log('All Devices: ', devices);
    const switchData = fam.devices.map((device) => {
        const pid = device.pid;
        // Query DB for the device with the pid
        const dbDevice = devices.find((d) => d.pid === pid);

        // return an object with the data to be inserted into the DB for the switch and make the connection to the device
        return {
            num_ports: device.total_system_ports,
            firmware_version: device.firmwareVersion ? device.firmwareVersion : null,
            switching_capacity: parseFloat(device.switching_capacity),
            forwarding_rate: parseFloat(device.forwarding_rate) || parseInt(device.forwarding_rate),
            hardware_stacking: device.hardware_stacking ? device.hardware_stacking : false,
            poe_support: device.number_of_ports_supporting_poe ? true : false,
            power_dedicated_to_poe: device.power_dedicated_to_poe
                ? device.power_dedicated_to_poe
                : 'N/A',
            num_of_ports_supporting_poe: device.number_of_ports_supporting_poe
                ? device.number_of_ports_supporting_poe
                : 'N/A',
            system_power_consumption: device.system_power_consumption
                ? device.system_power_consumption
                : null,
            power_consumption_with_poe: device.power_consumption_with_poe
                ? device.power_consumption_with_poe
                : 'N/A',
            heat_dissipation: device.heat_dissipation ? device.heat_dissipation : null,
            total_system_ports: device.total_system_ports,
            downlink_ports: getNumDownlinkPorts(device['rj-45_ports']),
            uplink_ports: getNumUplinkPorts(device.uplink_ports) || 0,
            small_form_factor_plus: getPlugType(device.uplink_ports),
            multi_gigabit_ethernet:
                getUplinkPortSpeed(device.uplink_ports) === '10G' ? true : false,
            uplink_port_speed: getUplinkPortSpeed(device.uplink_ports),
            downlink_port_speed: getDownlinkPortSpeed(device['rj-45_ports']),
            packet_buffer: device.packet_buffer ? device.packet_buffer : null,
            unit_dimensions: device.unit_dimensions,
            unit_weight: device.unit_weight,
            num_of_fans: /(fanless|no|n\/a)/gi.test(device.fan) ? 0 : +device.fan,
            acoustic_noise: device.acoustic_noise,
            device: {
                connect: {
                    id: dbDevice.id
                }
            }
        };
    });

    await Promise.all(
        switchData.map(
            async (data) =>
                await prisma.switch.create({
                    data: data
                })
        )
    );
}


async function seedDatabase() {
    const prodfamilies = JSON.parse(
        await readFile(`${process.cwd()}/src/lib/data/cat1300.json`, 'utf-8')
    );
    // const articleEmbeddings = JSON.parse(
    //     await readFile(`${process.cwd()}/src/lib/data/db_article_embeddings.json`, 'utf-8')
    // );
    const videoEmbeddings = JSON.parse(
        await readFile(`${process.cwd()}/src/lib/data/db_video_embeddings.json`, 'utf-8')
    );

    const relatedMediaPairs = JSON.parse(
        await readFile(
            `${process.cwd()}/src/lib/data/recommended_article_to_video_pairs.json`,
            'utf-8'
        )
    );
    // for (const family of prodfamilies) {
    //     await createDevices(family);
    //     await createRouterData(family);
    //     await createWirlessData(family);
    //     await createSwitchData(family);
    //     await createProductFamily(family);
    //     await createArticles(family);
    //     await createVideos(family);
    // }
    // Create the embeddings for the articles
    // const article = await createEmbeddingsForArticles(articleEmbeddings);
    // console.log('Article: ', article);
    // const video = await createVideoEmbeddings(videoEmbeddings);
    // console.log('Video: ', video);
    // Related the media pairs
    await addRelatedArticleToVideo(relatedMediaPairs);
}

seedDatabase()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
