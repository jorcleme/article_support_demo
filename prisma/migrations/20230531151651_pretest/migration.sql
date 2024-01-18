-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "CommentTypeML" AS ENUM ('step_note', 'best_practice', 'product_feedback', 'negative_feedback');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('Switch', 'Router', 'Wireless');

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "article_id" UUID,
    "doc_type" TEXT[],
    "topics" TEXT[],
    "title" TEXT NOT NULL,
    "condensed_title" TEXT,
    "title_ml" TEXT,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "embed_url" TEXT NOT NULL,
    "link_youtube" TEXT NOT NULL,
    "link_cisco" TEXT,
    "published_date" TIMESTAMP(6) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "tags_ml" TEXT[],
    "views" REAL DEFAULT 0,
    "likes" REAL DEFAULT 0,
    "title_embeddings" vector,
    "description_embeddings" vector,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "condensed_title" TEXT NOT NULL,
    "title_ml" TEXT NOT NULL,
    "firmware_version" TEXT,
    "objective" TEXT NOT NULL,
    "intro" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "published_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objective_embeddings" vector,
    "title_embeddings" vector,
    "vector" vector,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "section" TEXT,
    "text" TEXT,
    "step_number" TEXT,
    "src" TEXT,
    "alt" TEXT,
    "note" TEXT,
    "ml_summary" TEXT,
    "mobile_summary" TEXT,
    "article_id" UUID,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pid" VARCHAR(50) NOT NULL,
    "concept_id" UUID,
    "device_type" "DeviceType" NOT NULL,
    "datasheet_url" TEXT,
    "firmware_url" TEXT,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticlesOnDevices" (
    "article_id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticlesOnDevices_pkey" PRIMARY KEY ("article_id","device_id")
);

-- CreateTable
CREATE TABLE "VideosOnDevices" (
    "video_id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideosOnDevices_pkey" PRIMARY KEY ("video_id","device_id")
);

-- CreateTable
CREATE TABLE "Switch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_id" UUID NOT NULL,
    "num_ports" INTEGER,
    "firmware_version" TEXT,
    "switching_capacity" DOUBLE PRECISION,
    "forwarding_rate" DOUBLE PRECISION,
    "hardware_stacking" BOOLEAN DEFAULT false,
    "poe_support" BOOLEAN DEFAULT false,
    "power_dedicated_to_poe" TEXT,
    "num_of_ports_supporting_poe" TEXT,
    "system_power_consumption" TEXT,
    "power_consumption_with_poe" TEXT,
    "heat_dissipation" TEXT,
    "total_system_ports" SMALLINT,
    "downlink_ports" SMALLINT,
    "uplink_ports" SMALLINT,
    "small_form_factor_plus" BOOLEAN DEFAULT false,
    "multi_gigabit_ethernet" BOOLEAN DEFAULT false,
    "uplink_port_speed" TEXT,
    "downlink_port_speed" TEXT,
    "packet_buffer" TEXT,
    "unit_dimensions" TEXT,
    "unit_weight" TEXT,
    "num_of_fans" INTEGER DEFAULT 0,
    "acoustic_noise" TEXT,

    CONSTRAINT "Switch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Router" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_id" UUID NOT NULL,
    "num_interfaces" INTEGER,
    "rack_mountable" BOOLEAN,
    "qos" VARCHAR(500),
    "wpa" BOOLEAN DEFAULT true,
    "wpa2" BOOLEAN,
    "wan_ports" INTEGER,
    "lan_ports" INTEGER,
    "usb_ports" INTEGER,
    "firewall" TEXT,
    "layer_2_tunneling" BOOLEAN,
    "layer_2_tunneling_ipsec" BOOLEAN,
    "num_of_vlans" INTEGER,
    "port_security" BOOLEAN,
    "link_aggregation" BOOLEAN,
    "nat_max_session" INTEGER,
    "cpu" TEXT,
    "ram" TEXT,
    "flash" TEXT,
    "antennas" TEXT,
    "access_control" BOOLEAN,
    "cisco_ssl_vpn_anyconnect" TEXT,
    "dmz_host" BOOLEAN,
    "hardware_dmz" TEXT,
    "mtbf" TEXT,
    "package_contents" TEXT[],
    "unit_dimensions" TEXT,
    "unit_weight" TEXT,

    CONSTRAINT "Router_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wireless" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "device_id" UUID NOT NULL,
    "max_clients" TEXT,
    "max_num_access_points" TEXT,
    "max_num_mesh_extenders" TEXT,
    "available_transmit_power_settings" TEXT,
    "integrated_antennas" TEXT,
    "i_eee_spec" TEXT,
    "unit_dimensions" TEXT,
    "unit_weight" TEXT,
    "electronic_waste_laws_info_url" TEXT NOT NULL,
    "ethernet_ports" TEXT[],
    "indicators" TEXT,
    "power_draw" TEXT,
    "product_material_info_url" TEXT,
    "interfaces" TEXT[],
    "ipv6" BOOLEAN DEFAULT false,
    "qos" TEXT DEFAULT 'N/A',
    "wpa" BOOLEAN DEFAULT true,
    "wpa2" BOOLEAN DEFAULT false,

    CONSTRAINT "Wireless_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFamily" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "family" VARCHAR(100) NOT NULL,
    "admin_guide_url" VARCHAR(500),
    "product_support_page_url" VARCHAR(500),
    "emulator_url" VARCHAR(500),
    "short_name" VARCHAR(20)[],

    CONSTRAINT "ProductFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrequentlyAskedQuestions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "concept_id" UUID,

    CONSTRAINT "FrequentlyAskedQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFamilyImage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "concept_id" UUID,
    "hero_img" TEXT NOT NULL,

    CONSTRAINT "ProductFamilyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- CreateIndex
CREATE INDEX "Video_article_id_idx" ON "Video"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "Article_id_key" ON "Article"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_key" ON "Article"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Step_id_key" ON "Step"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_id_key" ON "Device"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_pid_key" ON "Device"("pid");

-- CreateIndex
CREATE INDEX "ArticlesOnDevices_article_id_idx" ON "ArticlesOnDevices"("article_id");

-- CreateIndex
CREATE INDEX "ArticlesOnDevices_device_id_idx" ON "ArticlesOnDevices"("device_id");

-- CreateIndex
CREATE INDEX "VideosOnDevices_video_id_idx" ON "VideosOnDevices"("video_id");

-- CreateIndex
CREATE INDEX "VideosOnDevices_device_id_idx" ON "VideosOnDevices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Switch_id_key" ON "Switch"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Switch_device_id_key" ON "Switch"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Router_id_key" ON "Router"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Router_device_id_key" ON "Router"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "Wireless_id_key" ON "Wireless"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wireless_device_id_key" ON "Wireless"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamily_id_key" ON "ProductFamily"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamily_family_key" ON "ProductFamily"("family");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamily_short_name_key" ON "ProductFamily"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "FrequentlyAskedQuestions_id_key" ON "FrequentlyAskedQuestions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FrequentlyAskedQuestions_concept_id_key" ON "FrequentlyAskedQuestions"("concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamilyImage_id_key" ON "ProductFamilyImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductFamilyImage_concept_id_key" ON "ProductFamilyImage"("concept_id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "ProductFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnDevices" ADD CONSTRAINT "ArticlesOnDevices_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlesOnDevices" ADD CONSTRAINT "ArticlesOnDevices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideosOnDevices" ADD CONSTRAINT "VideosOnDevices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideosOnDevices" ADD CONSTRAINT "VideosOnDevices_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Switch" ADD CONSTRAINT "Switch_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Router" ADD CONSTRAINT "Router_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wireless" ADD CONSTRAINT "Wireless_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrequentlyAskedQuestions" ADD CONSTRAINT "FrequentlyAskedQuestions_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "ProductFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFamilyImage" ADD CONSTRAINT "ProductFamilyImage_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "ProductFamily"("id") ON DELETE SET NULL ON UPDATE CASCADE;
