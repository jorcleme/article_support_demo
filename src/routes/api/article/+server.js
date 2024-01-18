import { prismadb } from '$lib/utils/prisma.js';
import { json } from '@sveltejs/kit';

const a = {
	id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
	title: 'Upgrade Firmware on a CBS 250 or 350 Series Switch',
	condensed_title: 'Upgrade Firmware on a CBS 250 or 350 Series Switch',
	title_ml: 'Upgrade Firmware on a CBS 250 or 350 Series Switch',
	firmware_version: '3.0.0.69',
	objective:
		'The firmware is the program that controls the operation and functionality of the switch. It is the combination of software and hardware that has program code and data stored in it in order for the device to function. Upgrading the firmware improves the performance of the device, which could provide enhanced security, new features, and bug fixes. This process is also necessary if you encounter the following: Frequent network disconnection, intermittent connection or slow connection using the switch. The objective of this document is to show you how to upgrade the firmware on your switch.',
	intro: null,
	views: 0,
	likes: 0,
	published: true,
	published_date: '2021-02-10T00:00:00.000Z',
	category: 'Install & Upgrade',
	search_terms:
		'Upgrade Firmware on a CBS 250 or 350 Series Switch Install & Upgrade The firmware is the program that controls the operation and functionality of the switch. It is the combination of software and hardware that has program code and data stored in it in order for the device to function. Upgrading the firmware improves the performance of the device, which could provide enhanced security, new features, and bug fixes. This process is also necessary if you encounter the following: Frequent network disconnection or intermittent connection using the switch. Slow connection The objective of this document is to show you how to upgrade the firmware on your switch. Articles',
	type: 'Articles',
	document_id: '1613002648484110',
	original_url:
		'https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2524-2545-upgrade-firmware-cbs.html',
	related_video_url: null,
	applicable_devices: [
		{
			device_name: 'CBS250',
			data_sheet_link:
				'https://www.cisco.com/c/en/us/products/collateral/switches/business-250-series-smart-switches/nb-06-bus250-smart-switch-ds-cte-en.html',
			software_version: '3.0.0.69',
			download_latest_link: 'https://software.cisco.com/download/home/286325765'
		},
		{
			device_name: 'CBS350',
			data_sheet_link:
				'https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html',
			software_version: '3.0.0.69',
			download_latest_link: 'https://software.cisco.com/download/home/286325769'
		},
		{
			device_name: 'CBS350-2X',
			data_sheet_link:
				'https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html',
			software_version: '3.0.0.69',
			download_latest_link: 'https://software.cisco.com/download/home/286325769'
		},
		{
			device_name: 'CBS350-4X',
			data_sheet_link:
				'https://www.cisco.com/c/en/us/products/collateral/switches/business-350-series-managed-switches/datasheet-c78-744156.html',
			software_version: '3.0.0.69',
			download_latest_link: 'https://software.cisco.com/download/home/286325769'
		}
	],
	steps: [
		{
			id: '5e755cdc-d54b-4703-b5d7-d6ffabf66ff1',
			section: 'Upgrade the Firmware',
			text: '<p> Log in to the web-based utility of the switch and choose <b>Administration &gt; File Management &gt; Firmware Operations </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-1.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 1,
			inserted_at: '2023-12-14T18:28:28.141Z'
		},
		{
			id: '453e4c9e-110d-47f9-bbfa-c71412e5a3b5',
			section: 'Upgrade the Firmware',
			text: 'On the File Operations page: <ul> <li> Click the<b> Update Firmware</b> radio button as the Operation Type. </li> <li> Click the <b> HTTP/HTTPS</b> radio button as the Copy Method. </li> <li> For the File Name, click<b> Choose File</b> and locate the previously downloaded firmware file from your computer. </li></ul>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-2.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 2,
			inserted_at: '2023-12-14T18:28:28.146Z'
		},
		{
			id: 'be264c5a-4c33-4f10-81cd-62357fac931b',
			section: 'Upgrade the Firmware',
			text: '<p> Choose the file then click <b>Open </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-4.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 3,
			inserted_at: '2023-12-14T18:28:28.150Z'
		},
		{
			id: '38220f64-99d0-4cc2-8145-39c8170fab57',
			section: 'Upgrade the Firmware',
			text: '<p> Click <b>Apply </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-3.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 4,
			inserted_at: '2023-12-14T18:28:28.154Z'
		},
		{
			id: 'd31a429e-08a1-455b-9357-77b5acbec761',
			section: 'Reboot the Switch',
			text: '<p> Choose <b>Administration &gt; Reboot </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-5.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 1,
			inserted_at: '2023-12-14T18:28:28.158Z'
		},
		{
			id: 'b562b3fd-1128-4220-96b1-f5cd4c658964',
			section: 'Reboot the Switch',
			text: 'On this page, enter the following: <ul> <li>Ensure the default of<b> Immediate</b>is selected. </li> <li>(Optional) Check the <b>Restore to Factory Defaults</b> or <b>Clear Startup Configuration File</b> check boxes if desired. With either option chosen, the switch essentially performs a factory default reset since both the running and startup configurations will be deleted upon reboot. </li> <li>Click <b>Reboot</b>. </li></ul> The switch will then reboot. This process may take a few minutes.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-7.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 2,
			inserted_at: '2023-12-14T18:28:28.162Z'
		},
		{
			id: 'a8fb01dd-cd5d-440b-ab3f-41f83522f44e',
			section: 'Verify the New Firmware',
			text: '<p> Choose <b>Administration &gt; File Management &gt; Firmware Operations </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-6.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 1,
			inserted_at: '2023-12-14T18:28:28.167Z'
		},
		{
			id: 'd713abde-bd64-4c4c-8e5c-ffc056e5b231',
			section: 'Verify the New Firmware',
			text: 'Check the Active Firmware Version area to verify if the updated firmware has been successfully uploaded to the switch. Nice work! You should now have successfully upgraded the firmware of your switch. Looking for more articles on your CBS250 or CBS350 switch? Check out any of the links below for more information!',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/Cisco-Business-Switching/images/tlz-1202021-step-8.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 2,
			inserted_at: '2023-12-14T18:28:28.173Z'
		},
		{
			id: 'fcac6a48-9a02-40aa-b0d4-1132b024c6b2',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Connect your computer to the Cisco Business 250 or 350 Series Switch using a console cable and launch a terminal emulator application to access the switch CLI.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step1.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 1,
			inserted_at: '2023-12-14T18:28:28.178Z'
		},
		{
			id: '9798932c-d9a1-48a7-b260-f8921d7be4cb',
			section: 'Upgrade the Firmware through the CLI',
			text: '<p> In the PuTTY Configuration window, choose <b>Serial </b> as the Connection type and enter the default speed for the serial line which is 115200. Then, click <b>Open </b> .</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step2a.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 2,
			inserted_at: '2023-12-14T18:28:28.184Z'
		},
		{
			id: '3913d3d0-8824-444f-97a5-0ed50dbe7c16',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Log in to the switch CLI using your own User Name and Password.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step3a.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 3,
			inserted_at: '2023-12-14T18:28:28.189Z'
		},
		{
			id: 'a6b4f114-a57d-4ed5-bb0a-ca5901ebd8cb',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Once you are on the CLI, enter the privileged exec mode and check the firmware version your switch is currently using as well as the location where the image is installed, and other information by entering the following: <kbd class="kbd-cdt" data-label="Click to copy command" translate="no"> CBS350#sh ver</kbd> <ul> <li>The switch is running firmware version 2.2.5.68 </li> <li>The image is installed in the flash directory </li> <li>The MD5 hash string </li> <li>The time and date the image is loaded to the switch </li></ul>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step4aa.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 4,
			inserted_at: '2023-12-14T18:28:28.197Z'
		},
		{
			id: '686636f5-220a-4049-a2e8-ec2bd171d984',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Browse through your TFTP folder and run the TFTP server in the background in preparation for the upgrade process.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step5.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 5,
			inserted_at: '2023-12-14T18:28:28.201Z'
		},
		{
			id: 'd2aa1ae2-8abb-4fd5-b18e-78495cbf05fc',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Upload the latest firmware file from your TFTP folder to the switch by entering the following: <kbd class="kbd-cdt" data-label="Click to copy command" translate="no"> CBS350#boot system tftp://192.168.100.108/image/image_cbs_ros_3.0.0.69_release_cisco_signed.bin</kbd>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step6a.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 6,
			inserted_at: '2023-12-14T18:28:28.206Z'
		},
		{
			id: 'df44c750-e97f-4286-a162-4a68ec1a1ef1',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Wait until the page shows that the operation has been completed.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step7.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 7,
			inserted_at: '2023-12-14T18:28:28.211Z'
		},
		{
			id: '5703605b-ca98-4374-a935-7563eb013fed',
			section: 'Upgrade the Firmware through the CLI',
			text: '(Optional) To verify that the new image file has been successfully loaded, check your switch firmware information again by entering the following: <kbd class="kbd-cdt" data-label="Click to copy command" translate="no"> CBS350#sh ver</kbd>',
			src: null,
			alt: null,
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 8,
			inserted_at: '2023-12-14T18:28:28.216Z'
		},
		{
			id: 'e9cc6048-1174-4630-922b-6eadf5a9ccd7',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Check the firmware information. The page should show both the old and new image files but should indicate that the old image file will be inactive after reboot and the new image file will be active after reboot.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step9.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 9,
			inserted_at: '2023-12-14T18:28:28.221Z'
		},
		{
			id: '90c2e23e-cd49-4948-b316-9a5f562ae156',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Reboot the switch by entering the following: <kbd class="kbd-cdt" data-label="Click to copy command" translate="no"> CBS350#reload</kbd>',
			src: null,
			alt: null,
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 10,
			inserted_at: '2023-12-14T18:28:28.226Z'
		},
		{
			id: 'c6d10224-6fae-4028-b73f-172ea6473eb4',
			section: 'Upgrade the Firmware through the CLI',
			text: '<p> Enter <b>Y </b> in the message prompt to continue.</p>',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step11.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 11,
			inserted_at: '2023-12-14T18:28:28.231Z'
		},
		{
			id: 'd091b58b-4d0f-4302-81a1-a74bfcffb48b',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Wait for a few minutes while the system is shutting down and rebooting.',
			src: null,
			alt: null,
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 12,
			inserted_at: '2023-12-14T18:28:28.235Z'
		},
		{
			id: '12467e8d-7985-4789-ad74-654fc48ec102',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Once the system has rebooted, log in to the switch again.',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step13.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 13,
			inserted_at: '2023-12-14T18:28:28.240Z'
		},
		{
			id: '30b0a7a2-2a6a-40eb-a6d8-ff0415014c18',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Verify the if the new image file is now active by entering the following: <kbd class="kbd-cdt" data-label="Click to copy command" translate="no"> CBS350#sh ver</kbd>',
			src: null,
			alt: null,
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 14,
			inserted_at: '2023-12-14T18:28:28.244Z'
		},
		{
			id: '5a6e73bf-200e-481a-8273-5e896e4b0fbf',
			section: 'Upgrade the Firmware through the CLI',
			text: 'Check the image information displayed. It should now show that the active image is the latest version. You should now have successfully upgraded the firmware on your Cisco Business 250 or 350 Series Switch through the CLI. Looking for more articles on your CBS250 or CBS350 switch? Check out any of the links below for more information!',
			src: 'https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step15.png',
			alt: 'Related Image, screenshot, or diagram',
			note: null,
			ml_summary: null,
			mobile_summary: null,
			article_id: '70580b54-f1cc-462b-80ea-ac7849542dcf',
			step_number: 15,
			inserted_at: '2023-12-14T18:28:28.249Z'
		}
	],
	ProductFamily: [
		{
			id: 'd19d0816-b721-4316-8945-83dc606daeb4',
			family: 'Cisco Business 250 Series Smart Switches',
			admin_guide_url: 'https://cisco.com/go/cbs250ag',
			product_support_page_url:
				'https://www.cisco.com/c/en/us/support/smb/product-support/small-business/CBS250.html',
			emulator_url: null,
			firmware_url: 'https://software.cisco.com/download/home/286325765'
		},
		{
			id: 'af67c1b3-869b-4dfd-8adf-8e9b0aa0fe15',
			family: 'Cisco Business 350 Series Managed Switches',
			admin_guide_url:
				'https://www.cisco.com/c/dam/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs350_3_1AG.pdf',
			product_support_page_url:
				'https://www.cisco.com/c/en/us/support/smb/product-support/small-business/CBS350.html',
			emulator_url:
				'https://www.cisco.com/web/fw/tools/cisco-business/emulators/switch/cbs/cbs350/cbs350-48fp-4x/html/cbs/config/log_off_page.html?moduleType=2138',
			firmware_url: 'https://software.cisco.com/download/home/286325769'
		}
	],
	opened: false
};
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
	const title = 'Upgrade Firmware on a CBS 250 or 350 Series Switch';
	let article = await prismadb.article.findFirst({
		where: {
			title: title
		},
		include: {
			steps: true,
			ProductFamily: true
		}
	});
	if (a) {
		a.steps.sort((a, b) => a.inserted_at - b.inserted_at);
		article.opened = false;

		return json({ article: a }, { status: 200, headers: { 'Content-Type': 'application/json' } });
	} else {
		return json(
			{ article: 'not found' },
			{ status: 404, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
