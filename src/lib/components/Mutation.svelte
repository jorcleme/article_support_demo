<script>
	import { cubicIn } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import {
		mostRecentStep,
		mountedArticleSteps,
		mountedArticlePreambleObjective,
		mountedArticlePreambleDevices,
		ExpGradeSelected
	} from '$lib/components/store';

	export let article;

	/** @type {HTMLElement}*/
	let body;

	/** @type {HTMLDivElement}*/
	let wrapper;
	let content;
	let preparedDOMContent = '';
	let currentSection;
	const qaPairsMap = new Map(); // This is in the global scope
	let contentArray;
	let targetNode;
	onMount(() => {
		console.log(wrapper);
		content = wrapper.innerText;
		console.log(content);
		preparedDOMContent = prepareText(content);
		contentArray = preparedDOMContent.split(' ');
		targetNode = document.body;
		body = document.querySelector('body');
		window.addEventListener('scroll', handleScroll);

		if (article) {
			console.log('article from onMount is:', article);
			// Set articleSteps and update mountedArticleSteps store
			let articleSteps = article.steps;
			// console.log('articleSteps', articleSteps);
			if ('related_video' in article) {
				hasRelatedVideo = true;
				relatedVideo = article.related_video;
			}
			// Combine objective and applicable devices into a single string
			const objective = article.objective;
			const applicableDevices = article.applicable_devices
				.map((device) => `${device.device_name} (Software version: ${device.software_version})`)
				.join(', ');

			// Update the mountedArticle store
			mountedArticlePreambleObjective.set(objective);
			mountedArticlePreambleDevices.set(applicableDevices);
			mountedArticleSteps.set(article.steps);
		} else {
			console.log('article is not defined');
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function handleScroll() {
		const stickyElement = document.getElementById('test');

		if (stickyElement) {
			const stickyRect = stickyElement.getBoundingClientRect();

			if (stickyRect.top <= 0) {
				isSticky = true;
			} else {
				isSticky = false;
			}
		}
	}

	// Break down the content into an array of words
	// var contentArray = preparedDOMContent.split(' ');
	let qaPairs = [];

	fetchQaPairs()
		.then((qaPairs) => {
			qaPairs.forEach((pair) => {
				pair.beforeText = escapeHtml(pair.beforeText);
				pair.qaText = escapeHtml(pair.qaText);
				pair.afterText = escapeHtml(pair.afterText);
			});
			// destructure qaPairs into an object with a shared context at the global level
			createMap(qaPairs);
			// console.log(qaPairs);
		})
		.then(() => {
			// Event delegation for the thumbs up/down clicks
			addFeedbackListeners();
		})
		.then(() => {
			addOmniButtonListener();
		})
		.then(() => {
			addScrollOmniButtonListener();
		})
		.then(() => {
			addButtonWellListeners();
		})
		.then(() => {
			addModeToggleListner();
		})
		.catch((error) => {
			console.error(error);
		});

	async function fetchQaPairs() {
		return new Promise((resolve, reject) => {
			// Simulate network delay
			setTimeout(() => {
				// draft of lightly guided questions to replace the three static questions: I dont understand this step, Help me troubleshoot, show best practices

				// Key points of this section
				// Are there any common mistakes to avoid in this section?
				// What are the best practices for this section?

				// You can put any logic here to simulate server response
				// Array of objects containing text to look for and associated QA text

				// <div class="avatar-container">   <div></div>  </div>    <div id='reviewerDiv'><img class="avatar" src="bio-pic-2.png" alt="Avatar"> <p class="author-name"><span id='contentReviewedBySpan'>Content Reviewed By:  </span>Corey Preston</p></div>

				let mockedUpAnswer = `<div class='assistant animated-answer'><p>The latest step explains how to access the Cisco Business Switch Stack Selector tool, which allows you to configure the settings for your 10G Cisco Business 350 series switch. This tool is important for achieving the objective of the article, which is to explain some best practices when dealing with Smartports on Cisco Business 250 or 350 series switches. <details id="sources" style=' border:none; cursor:pointer;'><summary><h4 style='margin-bottom:0; background:#f2f2f2;'>Sources used</h4></summary><h3>How did we use AI and Cisco experts to provide this answer?</h3><div id'sourcesContentContainer'><p>We search our content database for similar text to the question and context. We then use small chunks of the broader text to summarize or pick and choose which chunks are relevant. In the end the Gen AI uses the chunks to arrive at the answer. The answer produced is then reviewed for accuracy and relevancy by Cisco experts. <a href=''>Cisco's Responsible AI Framework FAQ</a></p> <img src="answerDiagram.png" style="box-shadow:none;" alt="Image description"> </div>        <div class='icon-band icon-guide'><i class=' '></i><p>Business stackable switches. If you are stacking the legacy switches, consult the following link: https://www.cisco.com/c/en/us/support/docs/smb/switches/cisco-350x-series-stackable-managed-switches/smb5367-feature-support-comparison-between-the-cisco-stackable-manag.html The feature set of the CBS350 SKUs with 10G network ports and the feature CBS350 SKUs with 10G uplink ports are nearly identical. However, there are a few differences in feature support and table sizes between the 2</p><p><a href='https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html'> View Get To Know Your Switch in the Administration Guide</a></p></div><div class='icon-band icon-guide'><i class=' '></i><p>in the user interfaces of the product software, language used based on RFP documentation, or language that is used by a referenced third-party product. Learn more about how Cisco is using Inclusive Language.   Cisco Business 350 Series Switches Administration Guide   Chapter Title  View with Adobe Reader on a variety of devices This chapter contains the following sections: A Smartport is an interface (port, VLAN or LAG) to which a built-in (or user-defined) macro may be applied. This Smartport</p><p><a href='https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_09.html'> View Smartport in the Administration Guide</a></p></div> <div class="icon-band icon-guide"><i class=" "></i> <p>settings for your 10G Cisco Business 350 series switch. Click on the link below to access the tool. https://www.cisco.com/c/en/us/support/docs/smb/switches/Cisco-Business-Switching/kmgmt-2799-switch-stack-selector-cbs.html Note You cannot stack the legacy switches with the new Cisco Business stackable switches. If you are stacking the legacy switches, consult the following link:</p><p><a href='https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html'> View Get To Know Your Switch in the Administration Guide</a></p></div><div class="icon-band icon-guide"><i class=" "></i> <p>and Reset button are located on the front panel of the switch, as well as the following components: Cisco Business 350 Series Model Note Models may differ within the CBS 350 series and this is just a representation of a model within the series. There are 2 device types with different console interface: Console port with RJ-45 and mini USB connector if both are connected the Mini USB has precedence over the RJ-45 RJ-45 connector only type of console. The console interface connects a serial cable</p><p><a href='https://www.cisco.com/c/en/us/td/docs/switches/lan/csbms/CBS_250_350/Administration-Guide/cbs-350/cbs_350_chapter_01.html'> View Get To Know Your Switch in the Administration Guide</a></p></div> </details><div  class="feedbackContainer"><div id='thumbsContainer'><h4>Helpful?</h4><button id="thumbsUp"  class="fa fa-thumbs-up"></button><button id="thumbsDown" class="fa fa-thumbs-down"></button></div> </div>  </div>`;

				var qaPairs = [
					{
						beforeText: 'Upgrade Firmware on a Switch',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Objective' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Objective</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>Summarize the key points of this section</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'Applicable Devices | Software Version Sx300 Series | 1.4.7.06 (Download latest)',
						fullyGuided: false,
						mode: 'Lightly Guided',
						dataSection: 'Objective'
					},
					{
						beforeText: 'Step 2. Choose the exact model from the drop-down list.',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 2' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 2</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: 'Step 3. Click Switch Firmware.',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 2'
					},
					{
						beforeText: 'Switch Firmware',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 3' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 3</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'Step 4. The page will show the latest firmware version of your switch and the size of the file',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 3'
					},
					{
						beforeText: 'button',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 4' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 4</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: 'Make sure to copy the file to your TFTP folder.',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 4'
					},
					{
						beforeText:
							'Step 1 Select the link for the latest version of firmware using the appropriate link above',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 1' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 1</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: 'Step 2 Choose the exact model from the drop-down list',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 1'
					},
					{
						beforeText:
							'Step 1 Connect your computer to the switch using a console cable and launch a terminal emulator application to access the switch CLI',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 1 CLI' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 1 CLI</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: 'In this example, PuTTY is used as the terminal emulator application.',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 1 CLI'
					},
					{
						beforeText: 'Open',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Step 2 CLI' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 2 CLI</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: 'Step 3. Log in to the switch CLI using your own User Name and Password.',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 2 CLI'
					},
					{
						beforeText: 'CBS350#sh ver',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='CBS350#sh ver' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>CBS350#sh ver</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'In the example image below the switch used is the SG350X and the following information is shown', // no after text
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'CBS350#sh ver'
					},
					{
						beforeText:
							'Step 6. Upload the latest firmware file from your TFTP folder to the switch by entering the following:',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='CBS350#sh ver' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Step 6</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'CBS350#boot system tftp://192.168.100.108/image/image_tesla_Sx250-350_Sx350X-550X_2.2.8.4.bin', // no after text
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'Step 6'
					},
					{
						beforeText: 'CBS350#sh ver',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='CBS350#sh ver' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>CBS350#sh ver</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'Step 9 Check the firmware information The page should show both the old and new image files but should indicate that the old image file will be inactive after reboot and the new image file will be active after reboot',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'CBS350#sh ver'
					},
					{
						beforeText: 'CBS350#sh ver',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='CBS350#sh ver' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>CBS350#sh ver</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>I don't understand this step</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button></div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText:
							'Step 15 Check the image information displayed It should now show that the active image is the latest version',
						fullyGuided: true,
						mode: 'Fully Guided',
						dataSection: 'CBS350#sh ver'
					},

					{
						beforeText:
							'You should now have successfully upgraded the firmware on your switch through the CLI',
						qaText: `<details class='detailsGetSupport s-5e5kg2sOboz_' style='' data-section='Conclusion' ><summary tabindex='0' class='s-5e5kg2sOboz_'><span id='stepNumberBreadcrumb' class='s-5e5kg2sOboz_'>?</span> <h3 style='display:inline;'>Get Support <p style='color:#999899; display:inline;'>Conclusion</p></h3></summary> <div class='messageWell s-5e5kg2sOboz_' style='height: auto;'> <h1 style='text-align:center;'>Need Answers?</h1><h3  style='text-align:center;margin-top:-1em;margin-bottom:4em;'>choose from our options below</h3></div>
                  <div class='genericSupportButtons s-5e5kg2sOboz_'><details class='custom-details s-5e5kg2sOboz_' id='detailsFaqlike' style='border:#d2d2d2 1px solid; margin:0;'  open=''><summary class='s-5e5kg2sOboz_'></summary><div class='buttonWell'> <button class='button s-5e5kg2sOboz_' id='staticAnswer1' tabindex='0' class='question-button'>Summarize the key points of this section</button><button class='button s-5e5kg2sOboz_' tabindex='0' class='question-button' id='staticAnswer2' class='question-button'>I need help troubleshooting</button><button  tabindex='0' id='staticAnswer3' class='question-button button'>Show Best Practices</button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer1'>What happens if I enable the Smartport feature? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer2'>How do I know if I have manual VLAN configurations? </button><button class='question-button s-5e5kg2sOboz_' tabindex='0' id='dynamicAnswer3'>What happens if I disable the Smartport feature? </button>   </div></details>`,
						staticAnswer1: mockedUpAnswer,
						staticAnswer2: mockedUpAnswer,
						staticAnswer3: mockedUpAnswer,
						dynamicAnswer1: mockedUpAnswer,
						dynamicAnswer2: mockedUpAnswer,
						dynamicAnswer3: mockedUpAnswer,
						afterText: '', // no after text
						fullyGuided: false,
						mode: 'Lightly Guided',
						dataSection: 'Conclusion'
					}
				];

				// Simulate successful response
				resolve(qaPairs);

				let supportDivs = {}; // An object to store all getSupportDivs

				for (let [index, pair] of qaPairs.entries()) {
					let beforeText = prepareText(pair.beforeText);
					let afterText = prepareText(pair.afterText);

					let allNodes = getTextNode(wrapper);

					for (let i = 0; i < allNodes.length; i++) {
						let node = allNodes[i];
						var text = prepareText(node.textContent);

						if (text.includes(beforeText)) {
							let nextText = '';

							for (let j = i + 1; j < allNodes.length && nextText.length < afterText.length; j++) {
								nextText += ' ' + prepareText(allNodes[j].textContent);
								nextText = nextText.trim();
							}
							// console.log(
							//   "afterText from just after resolve qaPairs: ",
							//   afterText
							// );

							if (nextText.startsWith(afterText) || afterText === '') {
								let newElement = document.createElement('div');
								newElement.innerHTML = pair.qaText;
								newElement.className = 'getSupportDiv';

								// Set a unique id for each newElement based on its index
								newElement.id = 'getSupportDiv' + index;

								// Add the div to the supportDivs object
								supportDivs['getSupportDiv' + index] = newElement;

								// set the div display: none
								// sizzle spot for the omnibutton
								// newElement.style.visibility = "hidden";
								// newElement.style.height = 0;

								if (pair.dataSection) {
									newElement.setAttribute('data-section', pair.dataSection);
								}

								if (pair.mode) {
									newElement.setAttribute('data-mode', pair.mode);
								}

								// Check if the node has a sibling
								if (node.parentNode.nextSibling) {
									// If it does, insert the new element before the sibling
									node.parentNode.parentNode.insertBefore(newElement, node.parentNode.nextSibling);
								}
								// Check if the parent node has a sibling
								else if (node.parentNode.parentNode.nextSibling) {
									// If it does, insert the new element before the sibling
									node.parentNode.parentNode.parentNode.insertBefore(
										newElement,
										node.parentNode.parentNode.nextSibling
									);
								}
								// If neither the node nor its parent has a sibling
								else {
									// Append the new element as the last child of the parent's parent's parent
									node.parentNode.parentNode.parentNode.appendChild(newElement);
								}
							}
						}
					}
				}
			}, 1000);
			// 1 second delay
		});
	}

	function createMap(qaPairs) {
		// Loop through all the objects in the qaPairs array
		qaPairs.forEach((pair, index) => {
			// Destructure the object
			var {
				beforeText,
				qaText,
				staticAnswer1,
				staticAnswer2,
				staticAnswer3,
				dynamicAnswer1,
				dynamicAnswer2,
				dynamicAnswer3,
				afterText,
				mode,
				dataSection
			} = pair;

			// Create a new object with the destructured data
			var pairData = {
				beforeText,
				qaText,
				staticAnswer1,
				staticAnswer2,
				staticAnswer3,
				dynamicAnswer1,
				dynamicAnswer2,
				dynamicAnswer3,
				afterText,
				mode,
				dataSection
			};

			// Add the new object to the map with the corresponding getSupportDiv id as the key
			qaPairsMap.set('getSupportDiv' + index, pairData);
		});
	}

	function useMap(id, dataSection) {
		var data = qaPairsMap.get(id) || searchMapForDataSection(dataSection); // Use the provided id or section to get the data
		if (data) {
			return data; // Return the data if it's found
		} else {
			console.log('No data found for id ' + id + ' or section ' + dataSection);
			return null;
		}
	}

	function searchMapForDataSection(dataSection) {
		for (let [key, value] of qaPairsMap.entries()) {
			if (value.dataSection === dataSection) {
				// Replace 'dataSection' with the actual property you're looking for
				console.log('searchMapForDataSection: Found data for section ' + dataSection);
				return value;
			}
		}
		return null;
	}

	function prepareText(text) {
		return text
			.toLowerCase()
			.replace(/\s+/g, ' ') // Replace sequences of whitespace characters with a single space
			.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove special characters
			.trim(); // Trim whitespace from start and end
	}

	// This function is designed to get all text nodes within a given HTML node.
	function getTextNode(node, result = []) {
		// We first check if the node is not null or undefined.
		if (node) {
			// Check if the node is an Element node.
			if (node.nodeType === Node.ELEMENT_NODE) {
				// Add an exception for divs with class 'getSupportDiv'
				if (node.classList.contains('getSupportDiv')) {
					return result;
				}
			}
			// If the node is a text node, we add it to the result array.
			if (node.nodeType === Node.TEXT_NODE) {
				result.push(node);
			}
			// If the node is not a text node, we iterate over its children and recursively call the function on them.
			else {
				for (var child of node.childNodes) {
					getTextNode(child, result);
				}
			}
		}
		// The function returns the array of text nodes.
		return result;
	}

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	//Sanitize the HTML while preserving our ability to produce rich content. Adds URL validator for 'a' and 'img' tags.
	function sanitizeHTML(html) {
		var parser = new DOMParser();
		var doc = parser.parseFromString(html, 'text/html');
		var allowedTags = [
			'b',
			'i',
			'u',
			'p',
			'em',
			'strong',
			'a',
			'li',
			'ul',
			'ol',
			'pre',
			'code',
			'table',
			'thead',
			'tbody',
			'tfoot',
			'tr',
			'th',
			'td',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'blockquote',
			'img',
			'svg',
			'hr',
			'dd',
			'dt',
			'dl'
		];
		var elements = doc.body.getElementsByTagName('*');

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			if (allowedTags.indexOf(element.tagName.toLowerCase()) === -1) {
				element.parentNode.removeChild(element);
				i--;
			} else {
				// If the tag is 'a', validate the 'href' attribute
				if (element.tagName.toLowerCase() === 'a') {
					var href = element.getAttribute('href');
					// Check if href is a valid URL and contains 'cisco.com'
					if (!/^https?:\/\/[^\/\s]+\/?.*$/.test(href) || !href.includes('cisco.com')) {
						element.removeAttribute('href');
					}
				}
				// If the tag is 'img', validate the 'src' attribute
				else if (element.tagName.toLowerCase() === 'img') {
					var src = element.getAttribute('src');
					// Check if src is a valid URL and contains 'cisco.com'
					if (!/^https?:\/\/[^\/\s]+\/?.*$/.test(src) || !src.includes('cisco.com')) {
						element.removeAttribute('src');
					}
				}
			}
		}

		return doc.body.innerHTML;
	}

	// Select the node that will be observed for mutations
	// let targetNode = document.body;

	// Options for the observer (which mutations to observe)
	let config = { childList: true, subtree: true };

	let callback = function (mutationsList, observer) {
		let hasRun = false;
		// Function to process each mutation
		const processMutation = (mutation) => {
			// If the function has run before, or if the mutation type isn't 'childList', return and stop execution
			if (hasRun || mutation.type !== 'childList') return;

			// For each node added by the mutation
			mutation.addedNodes.forEach((node) => {
				// If the node isn't an element, or doesn't contain the class 'getSupportDiv', return and stop execution
				if (node.nodeType !== Node.ELEMENT_NODE || !node.classList.contains('getSupportDiv'))
					return;

				if (document.getElementById('toggleBtn').length > 0) {
				}
				// Logging information
				// console.log("mutation.type", mutation.type);
				// console.log("mutation.target", mutation.target);
				// console.log("found getSupportDiv");

				// Get all elements with the class 'getSupportDiv'
				const getSupportDivs = Array.from(document.getElementsByClassName('getSupportDiv'));
				// console.log("getSupportDivs", getSupportDivs);

				// Get the button element
				const button = document.getElementById('getSupportBtn');

				// If there are any 'getSupportDiv' elements
				if (getSupportDivs.length > 0) {
					// console.log("button from mutation callback", button);
				}
			});

			// Set 'hasRun' to true to prevent the function from running again
			hasRun = true;
		};

		// For each mutation in the list, run the 'processMutation' function
		for (let mutation of mutationsList) {
			processMutation(mutation);
		}
	};

	function decodeHtml(html) {
		var txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	}
	function resetForm() {
		// locate the current getSupportDiv and style the button

		let dialogUp = document.getElementById('thumbsUpDialog');
		let dialogDown = document.getElementById('thumbsDownDialog');

		// // grab the span for dialogUp and set its innerText to blank
		// let spanUp = document.getElementById("spanUp");
		// spanUp.innerText = "";

		// // now the same for thumbsDownDialog
		// let spanDown = document.getElementById("spanDown");
		// spanDown.innerHTML = "";

		// let data = useMap(getSupportDivId);
		// if (!data) {
		//   console.log("No data found for id " + getSupportDivId);
		//   return;
		// }
		// console.log("data", data);

		// const detailsTag = getSupportDiv.querySelector("details");
		// // now we have detailsTag we need to style the feedback button that was clicked
		// console.log("detailsTag", detailsTag);
		// console.log("detailsTag.children", detailsTag.children);

		// Reset the form
		var checkboxes = document.querySelectorAll('.DialogFeedbackButtons');
		checkboxes.forEach((checkbox) => {
			checkbox.checked = false;
		});
		document.getElementById('textarea').value = '';
		document.getElementById('textarea2').value = '';

		// let dialog = document.querySelector("#thumbsDownDialog");

		try {
			dialogUp.close();
		} catch (e) {
			console.log(e);
		}

		try {
			dialogDown.close();
		} catch (e) {
			console.log(e);
		}
	}

	function addFeedbackListeners() {
		body.addEventListener('click', function (event) {
			// console.log("feedback button feedbacklistener placed");
			if (event.target.matches('.fa.fa-thumbs-up')) {
				// Get id of parent getSupportDiv
				let id = event.target.closest('.getSupportDiv').id;

				// style the button to show it has been clicked
				event.target.style.background = '#d2d2d2';

				// Here you can handle the thumbs up click
				// console.log("Thumbs up clicked in " + id);

				// now that we have the id of the getSupportDiv, we can select the dialog element and show it
				let getSupportDiv = document.getElementById(id);

				// now we have the getSupportDiv, grab span with a qaPair id inside of the dialog and change the inner text of the span to be the id of the getSupportDiv

				let dialog = document.querySelector('#thumbsUpDialog');

				let span = dialog.querySelector('span');

				// get the section of the getSupportDiv that was clicked
				let section = getSupportDiv.getAttribute('data-section');
				span.innerText = '';
				// Get the preceding div > h3 text content
				let previousDiv = getSupportDiv.previousElementSibling;
				let assistantDivs = getSupportDiv.querySelectorAll('.question');
				let lastAssistantDiv = assistantDivs[assistantDivs.length - 1];
				let h3Text = lastAssistantDiv.querySelector('h3').textContent;
				// match the h3 text content of the assistantDiv to the h3 text content of the previous div

				// console.log("h3Text", h3Text);
				span.innerText += `${section} / ${h3Text} `;

				dialog.show();
				dialog.style.opacity = 1;

				// set the button attribute to disabled
				event.target.setAttribute('disabled', true);

				// TODO: Add code to send the thumbs up to the server including destructured getSupportDiv/QApairs for logging performance
			} else if (event.target.matches('.fa.fa-thumbs-down')) {
				let id = event.target.closest('.getSupportDiv').id;

				// style the button to show it has been clicked
				event.target.style.background = '#d2d2d2';

				// Here you can handle the thumbs up click
				// console.log("Thumbs down clicked in " + id);

				// now that we have the id of the getSupportDiv, we can select the dialog element and show it
				let getSupportDiv = document.getElementById(id);

				let dialog = document.querySelector('#thumbsDownDialog');
				let span = dialog.querySelector('span');
				// get the section of the getSupportDiv that was clicked
				let section = getSupportDiv.getAttribute('data-section');

				// Get the preceding div > h3 text content
				let previousDiv = getSupportDiv.previousElementSibling;
				// console.log("previous div is ", previousDiv);
				span.innerText = '';
				let assistantDivs = getSupportDiv.querySelectorAll('.question');
				let lastAssistantDiv = assistantDivs[assistantDivs.length - 1];
				let h3Text = lastAssistantDiv.querySelector('h3').textContent;
				// match the h3 text content of the assistantDiv to the h3 text content of the previous div

				// console.log("h3Text", h3Text);
				span.innerText += `${section} / ${h3Text} `;

				dialog.show();
				dialog.style.opacity = 1;
				// set the button attribute to disabled
				event.target.setAttribute('disabled', true);
				// Handle the thumbs down click
				// console.log("Thumbs down clicked in " + id);
			}
		});
	}

	function addOmniButtonListener() {
		// if getSupportBtn is clicked, scroll to the next getSupportDiv and open the details tag contained within that section
		const omniButton = document.getElementById('getSupportBtn');
		// console.log("currentSection    under omnibutton" + currentSection);

		omniButton.addEventListener('click', (event) => {
			// Scroll to the active 'getSupportDiv'
			// const activeDiv = getSupportDivs[activeDivIndex];

			const getSupportDivs = Array.from(document.getElementsByClassName('getSupportDiv'));

			if (event.target) {
				// strip  Get Support from the button text
				currentSection = event.target.innerText.replace('? Get Support ', '');
			}

			// get the get support div with the data-section attribute that matches the current section
			const activeDiv = getSupportDivs.find(
				(div) => div.getAttribute('data-section') === currentSection
			);

			let activeDivId = activeDiv.id;
			let data = useMap(activeDivId);
			console.log(data.qaText);

			let getSupportWidgetContent = document.getElementById('getSupportWidgetContent');

			// add class class="getSupportDiv" to the div
			getSupportWidgetContent.classList.add('getSupportDiv');
			data.qaText = decodeHtml(data.qaText);
			let sourcedAnswer = data.qaText;

			let dialog = document.querySelector('#getSupportWidgetContainer');
			console.log('dialog', dialog);
			dialog.show();
			dialog.style.opacity = 1;

			sourcedAnswer = sourcedAnswer + `<button id="closeDialogButton">&times;</button>`;

			getSupportWidgetContent.innerHTML = sourcedAnswer;

			// Get unescaped HTML
			let unescapedHTML = getSupportWidgetContent.innerHTML;
			console.log('unescapedHTML', unescapedHTML);
			getSupportWidgetContent.innerHTML = unescapedHTML;

			const detailsTag = getSupportWidgetContent.querySelector('details');

			addFeedbackListeners();
			addOmniButtonWellListeners();
			addCloseButtonListener();

			console.log('closeDialogButton', document.getElementById('closeDialogButton'));

			console.log('getSupportWidgetContent', getSupportWidgetContent);
			if (detailsTag) {
				detailsTag.open = true;
			} else {
				detailsTag.open = false;
			}

			// console.log("getSupportDivHiddenCheck", getSupportDivHiddenCheck);
			// if (getSupportDivHiddenCheck)
			//   activeDiv.scrollIntoView({
			//     behavior: "smooth",
			//     block: "end",
			//   });
			// detailsGetSupport
		});
	}

	function addOmniButtonWellListeners() {
		let buttons = document.querySelectorAll('.buttonWell button');

		// Section for managing the click listeners for the static and dynamic questions.

		// get all buttons and attach the click listener

		buttons.forEach(function (button, i, event) {
			button.addEventListener('click', function (event) {
				console.log('event.target:', event.target);
				console.log('.getSupportWidgetContent', event.target.closest('.getSupportDiv'));
				if (!event.target.dataset.clicked) {
					// handle the first click
					let getSupportDiv = event.target.closest('.getSupportDiv');

					console.log('Button ' + getSupportDiv + ' first clicked!');
					let id = event.target.closest('.getSupportDiv').id;
					console.log(' id from button well click listener is ', id);
					// find the id of the button clicked
					let buttonId = event.target.id;

					console.log('From button well click listener, buttonId is ', buttonId, 'and id is: ', id);
					event.target.style.color = '#888';
					event.target.style.border = '#888 1px solid';
					event.target.style.background = '';

					let getSupportDivId = id;
					let detailsTag = getSupportDiv.querySelector('details');
					console.log(qaPairsMap);
					let dataSection = detailsTag.dataset.section;
					console.log('dataSection:', dataSection);

					// use even.target.dataset.section to get the section of the button clicked

					let data = useMap(id, dataSection);
					if (!data) {
						console.log('No data found for id ' + getSupportDivId);
						return;
					}
					console.log('data', data);

					// const detailsTag = getSupportDiv.querySelector("details");
					let messageWell = detailsTag.querySelector('.messageWell');

					let question = event.target.innerText;
					let questionHTML = document.createElement('div');

					//add question class to the newly created element
					questionHTML.classList.add('question');
					questionHTML.innerHTML = `<h3 style='background:rgba(155,215,255,0.5);color:#2b5592;width:fit-content; padding:1.5em;margin:1em 0;border-radius:10px;'>${question}</h3>`;

					messageWell.appendChild(questionHTML);

					// need to locate  buttonId within data
					let buttonData;
					if (data.hasOwnProperty(buttonId)) {
						buttonData = data[buttonId];
						console.log('Button Data: ', buttonData);
					} else {
						console.log(`No data found for buttonId ${buttonId}`);
					}

					// console.log(data.qaText);
					let answer = buttonData;
					console.log('buttonId', buttonId);
					// get buttonID and find that within data
					let qaPairsDetectedAnswer = data[buttonId];

					let answerHTML = document.createElement('div');
					answerHTML.innerHTML = qaPairsDetectedAnswer;

					// console.log("answerHTML", answerHTML);
					messageWell.appendChild(answerHTML);

					// In this event the question and answer have already been added to the DOM, we just need to scroll messageWell until the appropriate question and answer are scrolled into view
					let scrollHeight = messageWell.scrollHeight;
					var currentScroll = messageWell.scrollTop;
					var totalSteps = 100; // adjust this number to control the speed of the animation
					var currentStep = 0;

					// cubic easing out function
					function easeOutCubic(t) {
						return --t * t * t + 1;
					}

					function animateScroll() {
						var progress = currentStep / totalSteps; // calculate progress as a percentage
						var easeProgress = easeOutCubic(progress); // apply easing function
						var scrollDistance = easeProgress * (scrollHeight - currentScroll); // calculate scroll distance based on eased progress

						messageWell.scrollTop = currentScroll + scrollDistance; // apply scroll distance

						if (currentStep < totalSteps) {
							currentStep++;
							window.requestAnimationFrame(animateScroll);
						}
					}

					animateScroll();

					event.target.dataset.clicked = 'true'; // mark the button as clicked

					event.target.addEventListener('mouseover', function (e) {
						let style = window.getComputedStyle(e.target);
						e.target.style.backgroundColor = style.backgroundColor;
					});

					event.target.addEventListener('mouseout', function (e) {
						e.target.style.backgroundColor = '';
						e.target.style.borderRadius = '6px';
					});
				} else {
					let getSupportDiv = event.target.closest('.getSupportDiv');

					console.log('Button ' + getSupportDiv + ' second clicked!');
					let id = event.target.closest('.getSupportDiv').id;
					// find the id of the button clicked
					let buttonId = event.target.id;

					console.log('From button well click listener, buttonId is ', buttonId, 'and id is: ', id);
					event.target.style.color = '#888';
					event.target.style.border = '#888 1px solid';
					event.target.style.background = '';

					console.log('buttonId from top of click listener is ', buttonId);

					let getSupportDivId = id;

					let data = useMap(getSupportDivId);
					if (!data) {
						console.log('No data found for id ' + getSupportDivId);
						return;
					}
					console.log('data', data);

					const detailsTag = getSupportDiv.querySelector('details');
					let messageWell = detailsTag.querySelector('.messageWell');

					// Perform scroll animation on the first click

					console.log('getSupportDiv:', getSupportDiv);
					console.log('.assistant elements:', getSupportDiv.querySelectorAll('.assistant'));

					// match the buttonId to the id of the assistant div

					let specificDiv = messageWell.querySelector('.question'); // replace .specific-div with the selector of the div you want to scroll to
					let scrollHeight = messageWell.scrollHeight;
					var currentScroll = messageWell.scrollTop;
					var totalSteps = 100; // adjust this number to control the speed of the animation
					var currentStep = 0;

					// cubic easing out function
					function easeOutCubic(t) {
						return --t * t * t + 1;
					}

					function animateScroll() {
						var progress = currentStep / totalSteps; // calculate progress as a percentage
						var easeProgress = easeOutCubic(progress); // apply easing function
						var scrollDistance = easeProgress * (scrollHeight - currentScroll); // calculate scroll distance based on eased progress

						messageWell.scrollTop = currentScroll + scrollDistance; // apply scroll distance

						if (currentStep < totalSteps) {
							currentStep++;
							window.requestAnimationFrame(animateScroll);
						}
					}

					animateScroll();
				}
			});
		});
	}

	function addButtonWellListeners() {
		let buttons = document.querySelectorAll('.buttonWell button');

		// Section for managing the click listeners for the static and dynamic questions.

		// get all buttons and attach the click listener

		buttons.forEach(function (button, i, event) {
			button.addEventListener('click', function (event) {
				if (!event.target.dataset.clicked) {
					// handle the first click
					let getSupportDiv = this.closest('.getSupportDiv');

					console.log('Button ' + getSupportDiv + ' first clicked!');
					let id = event.target.closest('.getSupportDiv').id;
					// find the id of the button clicked
					let buttonId = this.id;

					console.log('From button well click listener, buttonId is ', buttonId, 'and id is: ', id);
					this.style.color = '#888';
					this.style.border = '#888 1px solid';
					this.style.background = '';

					let getSupportDivId = id;

					let data = useMap(getSupportDivId);
					if (!data) {
						console.log('No data found for id ' + getSupportDivId);
						return;
					}
					console.log('data', data);

					const detailsTag = getSupportDiv.querySelector('details');
					let messageWell = detailsTag.querySelector('.messageWell');

					let question = this.innerText;
					let questionHTML = document.createElement('div');

					//add question class to the newly created element
					questionHTML.classList.add('question');
					questionHTML.innerHTML = `<h3 style='background:rgba(155,215,255,0.5);color:#2b5592;width:fit-content; padding:1.5em;margin:1em 0;border-radius:10px;'>${question}</h3>`;

					messageWell.appendChild(questionHTML);

					// console.log(data.qaText);
					let answer = data.qaText;
					console.log('buttonId', buttonId);
					// get buttonID and find that within data
					let qaPairsDetectedAnswer = data[buttonId];

					let answerHTML = document.createElement('div');
					answerHTML.innerHTML = qaPairsDetectedAnswer;

					// console.log("answerHTML", answerHTML);
					messageWell.appendChild(answerHTML);

					// In this event the question and answer have already been added to the DOM, we just need to scroll messageWell until the appropriate question and answer are scrolled into view
					let scrollHeight = messageWell.scrollHeight;
					var currentScroll = messageWell.scrollTop;
					var totalSteps = 100; // adjust this number to control the speed of the animation
					var currentStep = 0;

					// cubic easing out function
					function easeOutCubic(t) {
						return --t * t * t + 1;
					}

					function animateScroll() {
						var progress = currentStep / totalSteps; // calculate progress as a percentage
						var easeProgress = easeOutCubic(progress); // apply easing function
						var scrollDistance = easeProgress * (scrollHeight - currentScroll); // calculate scroll distance based on eased progress

						messageWell.scrollTop = currentScroll + scrollDistance; // apply scroll distance

						if (currentStep < totalSteps) {
							currentStep++;
							window.requestAnimationFrame(animateScroll);
						}
					}

					messageWell.appendChild(answerHTML);
					animateScroll();

					// animateScroll();

					event.target.dataset.clicked = 'true'; // mark the button as clicked

					this.addEventListener('mouseover', function (e) {
						let style = window.getComputedStyle(e.target);
						e.target.style.backgroundColor = style.backgroundColor;
					});

					this.addEventListener('mouseout', function (e) {
						e.target.style.backgroundColor = '';
						e.target.style.borderRadius = '6px';
					});
				} else {
					let getSupportDiv = this.closest('.getSupportDiv');

					console.log('Button ' + getSupportDiv + ' second clicked!');
					let id = event.target.closest('.getSupportDiv').id;
					// find the id of the button clicked
					let buttonId = this.id;

					console.log('From button well click listener, buttonId is ', buttonId, 'and id is: ', id);
					this.style.color = '#888';
					this.style.border = '#888 1px solid';
					this.style.background = '';

					console.log('buttonId from top of click listener is ', buttonId);

					let getSupportDivId = id;

					let data = useMap(getSupportDivId);
					if (!data) {
						console.log('No data found for id ' + getSupportDivId);
						return;
					}
					console.log('data', data);

					const detailsTag = getSupportDiv.querySelector('details');
					let messageWell = detailsTag.querySelector('.messageWell');

					// Perform scroll animation on the first click

					console.log('getSupportDiv:', getSupportDiv);
					console.log('.assistant elements:', getSupportDiv.querySelectorAll('.assistant'));

					// match the buttonId to the id of the assistant div

					let specificDiv = messageWell.querySelector('.question'); // replace .specific-div with the selector of the div you want to scroll to
					let scrollHeight = messageWell.scrollHeight;
					var currentScroll = messageWell.scrollTop;
					var totalSteps = 100; // adjust this number to control the speed of the animation
					var currentStep = 0;

					// cubic easing out function
					function easeOutCubic(t) {
						return --t * t * t + 1;
					}

					function animateScroll() {
						var progress = currentStep / totalSteps; // calculate progress as a percentage
						var easeProgress = easeOutCubic(progress); // apply easing function
						var scrollDistance = easeProgress * (scrollHeight - currentScroll); // calculate scroll distance based on eased progress

						messageWell.scrollTop = currentScroll + scrollDistance; // apply scroll distance

						if (currentStep < totalSteps) {
							currentStep++;
							window.requestAnimationFrame(animateScroll);
						}
					}

					animateScroll();
				}
			});
		});
	}

	function addModeToggleListner() {
		let mode = 'Fully Guided';

		document.getElementById('toggleBtn').addEventListener('click', function () {
			let guidedModesDivs = document.getElementsByClassName('getSupportDiv');
			const modeIconLightlyGuided = document.querySelector('.modeIconLightlyGuided');
			const modeIconFullyGuided = document.querySelector('.modeIconFullyGuided');

			// Toggle the mode default to Fully Guided
			mode = mode === 'Fully Guided' ? 'Lightly Guided' : 'Fully Guided';

			Array.from(guidedModesDivs).forEach((div) => {
				// Check if details tag is open
				const details = div.querySelector('details');
				if (details && details.open) {
					// If details tag is open, don't change display
					return;
				}

				// Set display property based on the mode
				// div.style.display = mode === "Fully Guided" ? "block" : "none";

				// if mode is fully guided, set div display to block
				// if mode is lightly guided, set div visibility to hidden
				if ((div.style.display = mode === 'Fully Guided')) {
					div.style.opacity = '1';
					div.style.display = 'block';
					div.style.visibility = 'visible';
					div.style.height = 'auto';
				} else if ((div.style.display = mode === 'Lightly Guided')) {
					div.style.opacity = '0';
					div.style.visibility = 'hidden';
					div.style.height = '0px';
				}
			});

			// Control the visibility of the getSupportBtn and mode icons based on the mode
			if (mode === 'Fully Guided') {
				// document.getElementById("getSupportBtn").style.display = "inline";
				modeIconLightlyGuided.style.display = 'none';
				modeIconFullyGuided.style.display = 'flex';
				this.style.background = '#1d69cc';
				this.style.color = 'white';
			} else {
				// lightly guided
				// document.getElementById("getSupportBtn").style.display = "none"; // Hide getSupportBtn
				modeIconLightlyGuided.style.display = 'flex';
				modeIconFullyGuided.style.display = 'none';
				this.style.background = 'white';
				this.style.color = '#1d69cc';
			}
		});
	}

	function addScrollOmniButtonListener() {
		// add a click listener to get the id of the getSupportDiv that was clicked
		document.body.addEventListener('click', function (event) {
			// console.log("feedback button feedbacklistener placed");

			let getSupportDiv;
			if (event.target.matches('.getSupportDiv')) {
				// Get id of parent getSupportDiv
				let id = event.target.id;

				// Here you can handle the thumbs up click
				// console.log("getSupportDiv clicked in " + id);

				// now that we have the id of the getSupportDiv, we can select the dialog element and show it
				getSupportDiv = document.getElementById(id);
			}
		});

		let button = document.getElementById('getSupportBtn');
		// Set the HTML of the button
		let firstSection = document.querySelector('.getSupportDiv').getAttribute('data-section');

		button.innerHTML = `<span id="stepNumberBreadcrumb" style=''>?</span> Get Support ${firstSection}`;

		// Add a scroll event listener to the window
		window.addEventListener('scroll', () => {
			const getSupportDivs = Array.from(document.getElementsByClassName('getSupportDiv'));
			// Find the 'getSupportDiv' element that is closest to the middle of the screen
			let { closestSection } = getSupportDivs.reduce(
				(acc, div) => {
					const rect = div.getBoundingClientRect();
					const divCenter = rect.top + rect.height / 2;
					const screenCenter = window.innerHeight / 2;
					const distance = Math.abs(screenCenter - divCenter);
					return distance < acc.closestDistance
						? {
								closestDistance: distance,
								closestSection: div.getAttribute('data-section')
							}
						: acc;
				},
				{ closestDistance: Infinity, closestSection: null }
			);

			// If there is a closest section, set the HTML of the button to reflect that
			if (closestSection) {
				button.innerHTML = `<span id="stepNumberBreadcrumb" >?</span> Get Support ${closestSection}`;
			}
		});
	}

	function updateStepNumberBreadcrumb(text) {
		const stepNumberBreadcrumb = document.getElementById('stepNumberBreadcrumb');

		// Create a new span for the new text
		const newStep = document.createElement('span');
		newStep.classList.add('step');
		newStep.textContent = text;

		// Add it to the breadcrumb
		stepNumberBreadcrumb.appendChild(newStep);

		// Start the animation
		newStep.style.animation = 'move 1s forwards';

		// Remove the old step after the animation
		setTimeout(() => {
			const oldStep = stepNumberBreadcrumb.querySelector('span.step:not(:last-child)');
			if (oldStep) {
				stepNumberBreadcrumb.removeChild(oldStep);
			}
		}, 1000); // 1000ms is the duration of the animation
	}

	function addCloseButtonListener() {
		let closeButton = document.getElementById('closeDialogButton');
		closeButton.addEventListener('click', function () {
			let dialog = document.querySelector('#getSupportWidgetContainer');
			dialog.close();
		});
	}
</script>

<svelte:body bind:this={body} />

<div id="eot-doc-wrapper" style="position: relative" bind:this={wrapper}>
	<div>
		<dialog id="getSupportWidgetContainer">
			<div id="backgroundDecoration">
				<div
					id="getSupportWidgetContent"
					transition:slide={{ duration: 1000, delay: 200, easing: cubicIn }}
				/>
			</div>
		</dialog>
	</div>

	<dialog id="thumbsUpDialog">
		<div class="dialogContainer">
			<form method="dialog" onsubmit="resetForm(); return false;">
				<div class="modal-content">
					<h2 style="margin-bottom: 0; color: #333">Please provide additional feedback</h2>
					<span id="qaPair" style="color: #58585b; margin: 0 0 2em 0" />
					<div class="DialogFeedbackButtonsContainer">
						<input type="checkbox" id="option1" class="DialogFeedbackButtons" name="option1" />
						<label for="option1" class="feedbackButton">Exactly what I was looking for</label>
						<input type="checkbox" id="option2" class="DialogFeedbackButtons" name="option2" />
						<label for="option2" class="feedbackButton">Saved me time</label>
						<input type="checkbox" id="option3" class="DialogFeedbackButtons" name="option3" />
						<label for="option3" class="feedbackButton">Helped me solve my own issue</label>
					</div>
					<textarea placeholder="Let us know what we can do even better" id="textarea" />
					<div class="dialogControls">
						<button class="closeButton" type="submit">Close</button>
						<button class="submitButton" onclick="" type="submit">Submit</button>
					</div>
				</div>
			</form>
		</div>
	</dialog>

	<dialog id="thumbsDownDialog">
		<div class="dialogContainer">
			<form method="dialog" onsubmit="resetForm(); return false;">
				<div class="modal-content">
					<h2 style="margin-bottom: 0; color: #333">
						We're sorry to hear that. Can you provide more feedback?
					</h2>
					<span id="qaPair" style="color: #58585b; margin: 0 0 2em 0" />
					<div class="DialogFeedbackButtonsContainer">
						<input type="checkbox" id="option4" class="DialogFeedbackButtons" name="option4" />
						<label for="option4" class="feedbackButton">Error in content accuracy</label>

						<input type="checkbox" id="option5" class="DialogFeedbackButtons" name="option5" />
						<label for="option5" class="feedbackButton">Took too much time</label>

						<input type="checkbox" id="option6" class="DialogFeedbackButtons" name="option6" />
						<label for="option6" class="feedbackButton">Didn't solve my issue</label>
					</div>
					<textarea
						style="max-width: 1000px; height: 100px; padding: 1em"
						placeholder="Let us know what we can do to improve"
						id="textarea2"
					/>
					<div class="dialogControls">
						<button class="closeButton" type="submit">Close</button>
						<button class="submitButton" onclick="" type="submit">Submit</button>
					</div>

					<div class="dialogFooter">
						<div class="dialogFooterText">
							<p>Tip: Check the sources to this question for related support content.</p>
							<p>Additional resources:</p>
							<ul>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Contact Support >
									</a>
								</li>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Help Center >
									</a>
								</li>
								<li>
									<a
										href="https://www.cisco.com/c/en/us/support/web/tsd-cisco-small-business-support-center-contacts.html"
										>Product Documentation >
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</form>
		</div>
	</dialog>

	<div id="buttonContainer">
		<button class="button" id="getSupportBtn"
			><span id="stepNumberBreadcrumb">?</span> Get Support</button
		>

		<button class="button" id="toggleBtn">
			<div class="modeIconFullyGuided">
				<svg
					in:fade={{ duration: 1000 }}
					width="45"
					height="45"
					style="margin: 0"
					viewBox="0 0 45 45"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M28.544 5.3132C28.4954 5.24783 28.4322 5.19473 28.3594 5.15815C28.2866 5.12158 28.2063 5.10253 28.1248 5.10254H16.8748C16.7652 5.10254 16.6583 5.13706 16.5694 5.20119C16.4805 5.26533 16.414 5.35583 16.3794 5.45987L10.7544 22.3349C10.7282 22.4134 10.721 22.497 10.7335 22.5788C10.746 22.6606 10.7777 22.7383 10.8261 22.8054C10.8745 22.8726 10.9382 22.9273 11.0118 22.965C11.0855 23.0027 11.1671 23.0223 11.2498 23.0223H19.6126L16.3626 39.2725C16.3394 39.3886 16.3563 39.5091 16.4105 39.6143C16.4647 39.7195 16.5531 39.8032 16.6611 39.8516C16.7691 39.9001 16.8904 39.9104 17.005 39.8808C17.1197 39.8513 17.2209 39.7837 17.2921 39.6891L34.1671 17.2921C34.2252 17.215 34.2608 17.1232 34.2699 17.0271C34.279 16.9309 34.2613 16.8341 34.2187 16.7474C34.176 16.6607 34.1102 16.5876 34.0285 16.536C33.9468 16.4845 33.8525 16.4566 33.7559 16.4555L25.4494 16.3605L28.6253 5.77518C28.6486 5.69716 28.6534 5.61477 28.6393 5.53457C28.6252 5.45436 28.5926 5.37856 28.544 5.3132ZM24.2494 16.7247C24.2262 16.8022 24.2213 16.8841 24.2351 16.9638C24.2489 17.0436 24.281 17.1191 24.3289 17.1843C24.3769 17.2495 24.4393 17.3027 24.5113 17.3397C24.5833 17.3766 24.6629 17.3964 24.7438 17.3973L32.7111 17.4885L17.8364 37.2307L20.7621 22.6024C20.7773 22.5266 20.7754 22.4484 20.7567 22.3734C20.738 22.2984 20.7029 22.2285 20.6539 22.1687C20.6049 22.1089 20.5432 22.0608 20.4733 22.0277C20.4035 21.9947 20.3271 21.9775 20.2498 21.9775H11.9747L17.2514 6.14734H27.4228L24.2494 16.7247Z"
						fill="white"
					/>
				</svg>
				<span class="s-mwcRLS6Z5zzs">Fully Guided</span>
			</div>
			<div class="modeIconLightlyGuided" style="display: none">
				<svg
					in:fade={{ duration: 1000, easing: cubicIn }}
					width="45"
					height="45"
					style="margin: 0"
					viewBox="0 0 45 45"
					fill="#1d69cc"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M12.375 22.9218H14.1306L14.1515 30.3763C14.1518 30.5016 14.2019 30.6217 14.2906 30.7102C14.3794 30.7987 14.4996 30.8484 14.625 30.8484H31.4675C31.4786 30.8487 31.4889 30.8517 31.5 30.8517C31.9247 30.8512 32.3318 30.6823 32.6321 30.382C32.9324 30.0817 33.1013 29.6746 33.1018 29.2499V22.8976C34.9581 22.7748 36.694 21.9352 37.9425 20.5561C39.1911 19.1769 39.8545 17.3664 39.7926 15.5071C39.7307 13.6477 38.9483 11.8853 37.6107 10.5923C36.2732 9.2993 34.4853 8.57698 32.625 8.578H12.772C12.7227 8.14049 12.5969 7.71504 12.4004 7.32103L14.0966 5.62488L13.5 5.02832L11.9345 6.59388C11.3788 5.9165 10.606 5.45218 9.74706 5.27968C8.88812 5.10718 7.99595 5.23712 7.22189 5.64747C6.44784 6.05781 5.83956 6.72329 5.50025 7.53101C5.16095 8.33873 5.1115 9.23896 5.3603 10.079C5.6091 10.919 6.14082 11.6471 6.86528 12.1398C7.58973 12.6324 8.4623 12.8593 9.33498 12.7819C10.2076 12.7045 11.0267 12.3276 11.6531 11.7152C12.2796 11.1028 12.6749 10.2925 12.772 9.42176H32.625C34.2617 9.42099 35.8349 10.0547 37.0141 11.1897C38.1933 12.3247 38.8866 13.8726 38.9484 15.5081C39.0101 17.1436 38.4355 18.7394 37.3452 19.96C36.2549 21.1807 34.7339 21.9312 33.1018 22.0538V14.6249C33.1018 14.5623 33.0895 14.5002 33.0656 14.4424C33.0416 14.3845 33.0065 14.3319 32.9622 14.2877C32.9179 14.2434 32.8654 14.2082 32.8075 14.1843C32.7496 14.1603 32.6876 14.148 32.625 14.1481H15.9181C15.8555 14.148 15.7934 14.1603 15.7356 14.1843C15.6777 14.2082 15.6251 14.2434 15.5809 14.2877C15.5366 14.3319 15.5015 14.3845 15.4775 14.4424C15.4536 14.5002 15.4412 14.5623 15.4413 14.6249V16.3662L14.5882 16.3643H14.5871C14.5248 16.3642 14.463 16.3765 14.4055 16.4004C14.3479 16.4242 14.2956 16.4592 14.2516 16.5033C14.2076 16.5475 14.1728 16.5999 14.1491 16.6575C14.1254 16.7151 14.1133 16.7769 14.1136 16.8392L14.1283 22.078H12.375C10.4729 22.078 8.64871 22.8336 7.30372 24.1786C5.95873 25.5236 5.20313 27.3478 5.20312 29.2499C5.20313 31.152 5.95873 32.9762 7.30372 34.3212C8.64871 35.6662 10.4729 36.4218 12.375 36.4218H32.228C32.3358 37.3862 32.8088 38.2727 33.5498 38.8993C34.2909 39.5258 35.2437 39.8449 36.2126 39.7909C37.1815 39.7369 38.093 39.3139 38.7598 38.6089C39.4267 37.9039 39.7982 36.9703 39.7982 35.9999C39.7982 35.0295 39.4267 34.0959 38.7598 33.3908C38.093 32.6858 37.1815 32.2629 36.2126 32.2089C35.2437 32.1549 34.2909 32.4739 33.5498 33.1005C32.8088 33.7271 32.3358 34.6136 32.228 35.578H12.375C10.6967 35.578 9.08709 34.9113 7.90034 33.7245C6.71359 32.5378 6.04688 30.9282 6.04688 29.2499C6.04688 27.5716 6.71359 25.962 7.90034 24.7752C9.08709 23.5885 10.6967 22.9218 12.375 22.9218ZM9 11.953C8.49727 11.9559 8.00213 11.8304 7.56147 11.5884C7.12081 11.3464 6.74923 10.9959 6.48192 10.5701C6.21461 10.1443 6.06043 9.65733 6.03397 9.15529C6.00752 8.65325 6.10966 8.15277 6.33074 7.70124C6.55181 7.24972 6.8845 6.86211 7.29728 6.57513C7.71006 6.28815 8.18927 6.1113 8.68951 6.06133C9.18976 6.01136 9.69449 6.08992 10.1559 6.28958C10.6173 6.48923 11.0201 6.80337 11.3261 7.20224L9 9.52832L7.875 8.40332L7.27844 8.99988L8.70172 10.4232C8.74089 10.4623 8.78739 10.4934 8.83856 10.5146C8.88974 10.5358 8.9446 10.5468 9 10.5468C9.0554 10.5468 9.11026 10.5358 9.16144 10.5146C9.21262 10.4934 9.25911 10.4623 9.29828 10.4232L11.7561 7.96538C11.8839 8.29543 11.9506 8.64596 11.9531 8.99988C11.9522 9.78282 11.6408 10.5334 11.0872 11.0871C10.5336 11.6407 9.78294 11.9521 9 11.953ZM16.3949 15.1017H32.1482V29.2499C32.1482 29.4218 32.0799 29.5867 31.9583 29.7082C31.8368 29.8298 31.6719 29.8981 31.5 29.8981C31.3281 29.8981 31.1632 29.8298 31.0417 29.7082C30.9201 29.5867 30.8518 29.4218 30.8518 29.2499V28.1249H30.8485V16.8749C30.8485 16.7495 30.7987 16.6293 30.7102 16.5405C30.6216 16.4517 30.5015 16.4017 30.3761 16.4014L16.3949 16.3685V15.1017ZM29.9015 17.3473V28.1249H29.8982V29.2499C29.8988 29.4746 29.947 29.6967 30.0398 29.9014H15.0974L15.0617 17.3124L29.9015 17.3473ZM36 33.0468C36.5841 33.0468 37.155 33.22 37.6407 33.5444C38.1263 33.8689 38.5048 34.3302 38.7283 34.8698C38.9518 35.4094 39.0103 36.0032 38.8964 36.576C38.7824 37.1489 38.5012 37.6751 38.0882 38.0881C37.6752 38.5011 37.149 38.7823 36.5761 38.8963C36.0033 39.0102 35.4095 38.9517 34.8699 38.7282C34.3303 38.5047 33.8691 38.1262 33.5446 37.6406C33.2201 37.1549 33.0469 36.584 33.0469 35.9999C33.0478 35.2169 33.3592 34.4663 33.9128 33.9127C34.4664 33.3591 35.2171 33.0477 36 33.0468Z"
						fill="#1d69cc"
					/>
					<path d="M28.125 19.7729H16.875V20.7266H28.125V19.7729Z" fill="white" />
					<path d="M28.125 23.1479H16.875V24.1016H28.125V23.1479Z" fill="white" />
					<path d="M24.75 26.5229H16.875V27.4766H24.75V26.5229Z" fill="white" />
				</svg>
				<span class="s-mwcRLS6Z5zzs">Lightly Guided</span>
			</div>
		</button>
	</div>

	<h2>Objective</h2>
	<p>
		The firmware is the program that controls the operation and functionality of the switch. It is
		the combination of software and hardware that has program code and data stored in it in order
		for the device to function.
	</p>
	<p>
		Upgrading the firmware improves the performance of the device, which could provide enhanced
		security, new features, and bug fixes. This process is also necessary if you encounter the
		following:
	</p>
	<ul>
		<li>Frequent network disconnection or intermittent connection using the switch</li>
		<li>Slow connection</li>
	</ul>
	<p>
		You can upgrade the firmware of the switch through its web-based utility or through the Command
		Line Interface (CLI).
	</p>
	<p>
		This article aims to show you how to upgrade the firmware on your switch through the CLI. If you
		are a beginner, you may want to upgrade the firmware using the Graphical User Interface (GUI).
		This article covers the task of having to update the boot code.
		<a
			href="https://www.cisco.com/c/en/us/support/docs/smb/switches/cisco-small-business-300-series-managed-switches/smb5862-Upgrade-Firmware-200-300-Switches.html"
			>How to Upgrade Firmware on 200/300 Series Switches</a
		>
	</p>
	<p>
		Here is a second article that that explains how to upgrade the firmware using the web-based
		utility.
		<a
			href="https://www.cisco.com/c/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/smb5304-upgrade-firmware-on-a-switch.html"
			>Upgrade Firmware on a Switch</a
		>
	</p>
	<h3>Applicable Devices | Software Version</h3>
	<ul>
		<li>
			Sx300 Series | 1.4.7.06 (<a href="https://software.cisco.com/download/home/283019611"
				>Download latest</a
			>)
		</li>
		<li>
			Sx350 Series | 2.2.8.04 (<a href="https://software.cisco.com/download/home/286311197/"
				>Download latest</a
			>)
		</li>
		<li>
			SG350X Series | 2.2.8.04 (<a href="https://software.cisco.com/download/home/286311197"
				>Download latest</a
			>)
		</li>
		<li>
			Sx500 Series | 1.4.7.06 (<a href="https://software.cisco.com/download/home/284099526"
				>Download latest</a
			>)
		</li>
		<li>
			Sx550X Series | 2.2.8.04 (<a href="https://software.cisco.com/download/home/284099526"
				>Download latest</a
			>)
		</li>
	</ul>

	<h2>Upgrade Firmware on a Switch through the CLI</h2>
	<h3>Download the Latest Firmware</h3>
	<p>
		In preparation for the upgrade process, download first the latest firmware of the switch. Follow
		the instructions below:
	</p>
	<p>
		You can choose whether to encrypt the password or not. Hit the space bar on the keyboard and add
		a question mark to view the available commands. In this example sha-512 is used as the
		encryption on the password.
	</p>
	<p>
		Step 1. Select the link for the latest version of firmware using the appropriate link above.
	</p>
	<p>Step 2. Choose the exact model from the drop-down list.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step2.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step2.png"
			style="width: 321px; height: 316px"
		/></a
	>

	<p>Step 3. Click <b>Switch Firmware</b>.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step3.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step3.png"
			style="width: 244px; height: 110px"
		/></a
	>
	<p>
		Step 4. The page will show the latest firmware version of your switch and the size of the file.
		Click the <b>Download</b> button.
	</p>

	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step4.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step4.png"
			style="width: 644px; height: 130px"
		/></a
	>
	<div class="cdt-note">
		<p>Make sure to copy the file to your TFTP folder.</p>
	</div>
	<h3>Upgrade the Firmware through the CLI</h3>
	<p>
		Step 1. Connect your computer to the switch using a console cable and launch a terminal emulator
		application to access the switch CLI.
	</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step1.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step1.png"
			style="width: 227px; height: 202px"
		/></a
	>
	<div class="cdt-note">
		<p>In this example, PuTTY is used as the terminal emulator application.</p>
	</div>
	<p>
		Step 2. In the PuTTY Configuration window, choose <b>Serial</b> as the Connection type and enter
		the default speed for the serial line which is 115200. Then, click <b>Open</b>.
	</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step2a.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step2a.png"
			style="width: 453px; height: 437px"
		/></a
	>
	<p>Step 3. Log in to the switch CLI using your own User Name and Password.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step3a.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step3a.png"
			style="width: 200px; height: 58px"
		/></a
	>
	<div class="cdt-note">
		<p>
			The default username and password is cisco/cisco. In this example, the default User Name
			cisco, and a personal password is used.
		</p>
	</div>
	<p>
		Step 4. Once you are on the CLI, enter the privileged exec mode and check the firmware version
		your switch is currently using as well as the location where the image is installed, and other
		information by entering the following:
	</p>
	<kbd class="kbd-cdt cCN_CmdName" data-label="click to copy command">CBS350#sh ver</kbd>

	<p>
		In the example image below, the switch used is the SG350X and the following information is
		shown:
	</p>
	<ul>
		<li>The switch is running firmware version 2.2.5.68</li>
		<li>The image is installed in the flash directory</li>
		<li>The MD5 hash string</li>
		<li>The time and date the image is loaded to the switch</li>
	</ul>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step4aa.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step4aa.png"
			style="width: 653px; height: 120px"
		/></a
	>
	<p>
		Step 5. Browse through your TFTP folder and run the TFTP server in the background in preparation
		for the upgrade process.
	</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step5.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step5.png"
			style="width: 499px; height: 320px"
		/></a
	>
	<p>
		Step 6. Upload the latest firmware file from your TFTP folder to the switch by entering the
		following:
	</p>

	<kbd class="kbd-cdt cCN_CmdName" data-label="click to copy command"
		>CBS350#boot system tftp://192.168.100.108/image/image_tesla_Sx250-350_Sx350X-550X_2.2.8.4.bin</kbd
	>

	<p><b>Note:</b> In this example, the IP address of the TFTP server used is 192.168.100.108.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step6a.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step6a.png"
			style="width: 579px; height: 32px"
		/></a
	>
	<p>Step 7. Wait until the page shows that the operation has been completed.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step7.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step7.png"
		/></a
	>
	<p>
		Step 8. (Optional) To verify that the new image file has been successfully loaded, check your
		switch firmware information again by entering the following:
	</p>
	<kbd class="kbd-cdt cCN_CmdName" data-label="click to copy command">CBS350#sh ver</kbd>

	<p>
		Step 9. Check the firmware information. The page should show both the old and new image files
		but should indicate that the old image file will be inactive after reboot and the new image file
		will be active after reboot.
	</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step9.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step9.png"
			style="width: 579px; height: 188px"
		/></a
	>
	<p>Step 10. Reboot the switch by entering the following:</p>
	<kbd class="kbd-cdt cCN_CmdName" data-label="click to copy command">CBS350#reload</kbd>

	<p>Step 11. Enter <b>Y</b> in the message prompt to continue.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step11.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step11.png"
		/></a
	>
	<p>Step 12. Wait for a few minutes while the system is shutting down and rebooting.</p>
	<p>Step 13. Once the system has rebooted, log in to the switch again.</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step13.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step13.png"
			style="width: 167px; height: 66px"
		/></a
	>
	<p>Step 14. Verify the if the new image file is now active by entering the following:</p>

	<kbd class="kbd-cdt cCN_CmdName" data-label="click to copy command">CBS350#sh ver</kbd>

	<p>
		Step 15. Check the image information displayed. It should now show that the active image is the
		latest version.
	</p>
	<a
		href="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step15.png"
		class="show-image-alone"
		title="Related image, diagram or screenshot."
		><img
			alt=""
			src="https://www.cisco.com/content/dam/en/us/support/docs/smb/switches/cisco-550x-series-stackable-managed-switches/images/gss-cliupgrade-05102017-step15.png"
			style="width: 579px; height: 155px"
		/></a
	>
	<p>You should now have successfully upgraded the firmware on your switch through the CLI.</p>

	<a
		href="#"
		class="backToTop-link"
		title="Top"
		data-targetselector="body"
		style="position: absolute; bottom: 15px; right: 15px; left: auto"
		><span /><img
			class="preload"
			src="https://www.cisco.com/etc/designs/cdc/fw/i/responsive/Default-bTop-36.svg"
			alt="Back to Top"
		/></a
	>
</div>

<style>
	:global(.detailsGetSupport) {
		margin-left: 40px;
		/* z-index: -1; */

		transition: all 0.3s ease-in-out;
	}
	#getSupportWidgetContent {
		background: white;
		padding: 1em 0 0 0;
		width: 750px;
		animation: slideInFromright 0.5s ease-out forwards;
		position: fixed;
		right: 8px;
		bottom: 155px;
		z-index: 9999;
		background: transparent;
		border: none;
	}

	:global(.getSupportDiv > details > div.messageWell) {
		background-image: radial-gradient(
				75.83% 78.18% at 51.72% 100%,
				rgba(56, 96, 190, 0.03) 0%,
				rgba(100, 187, 227, 0.03) 65.24%,
				rgba(223, 223, 223, 0) 100%
			),
			conic-gradient(
				from 180deg at 50% 50%,
				rgba(56, 96, 190, 0) 0deg,
				rgba(56, 96, 190, 0.02) 360deg
			);
	}

	:global(#getSupportWidgetContent > details) {
		border-radius: 16px;
		background-color: white;

		background-image: radial-gradient(
				75.83% 78.18% at 51.72% 100%,
				rgba(56, 96, 190, 0.03) 0%,
				rgba(100, 187, 227, 0.03) 65.24%,
				rgba(223, 223, 223, 0) 100%
			),
			conic-gradient(
				from 180deg at 50% 50%,
				rgba(56, 96, 190, 0) 0deg,
				rgba(56, 96, 190, 0.02) 360deg
			);
	}
	:global(.avatar-container) {
		/* width: 240px;
  height: 200px; */
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.dialogFooter {
		/* background: #1d69cc; */
		color: #898989;
		border-radius: 0 0 16px 16px;
		/* margin: 0; */
		padding: 1em;
		border: #1d69cc 1px solid;
	}
	#getSupportWidgetContainer {
		position: fixed;
		z-index: 9999; /* or fixed, if needed */
	}

	:global(#closeDialogButton) {
		position: absolute;
		top: -25px;
		left: -20px;
		background: white;
		border-radius: 35px;
		color: #aaa;
		font-size: 41px;
		font-weight: bold;
		background: none;
		border: none;
		z-index: 10000;
	}
	:global(.dialogFooter #closeDialogButton:hover),
	:global(#closeDialogButton:focus) {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
	:global(.avatar) {
		width: 100%;
		height: auto;
		border-radius: 50%;
	}
	:global(#contentReviewedBySpan) {
		color: gray;
	}
	:global(#sources > h3) {
		margin-left: 0;
	}

	:global(.author-name) {
		/* margin-top: 10px; */
		margin-left: 1em;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
	:global(#reviewerDiv > img) {
		width: 75px;
		height: 90px;
		margin: 1em 0 0 0;
	}
	:global(#reviewerDiv) {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	:global(#thumbsContainer) {
		display: flex;
		flex-direction: row;
		gap: 1em;
		align-items: center;
	}

	:global(.getSupportDiv) {
		transition: all 0.5s ease;
		border-radius: 16px;
	}
	/* .getSupportDiv > details > div.messageWell.s-5e5kg2sOboz_ > div > div > p {
  margin-top: -1;
} */
	/* feedbackContainer styled to the right side of the container */
	:global(.feedbackContainer) {
		display: flex;

		gap: 1em;
		z-index: 1000;
		/* margin: 1.5em; */
		justify-items: end;
		justify-content: end;
		align-items: center;
		height: auto;
	}

	:global(#thumbsUp:before),
	:global(#thumbsDown:before) {
		color: #2b5592;
	}

	:global(div > details > summary > h3 > p) {
		color: gray;
		display: inline;
	}
	:global(.btn) {
		font-size: 24px;
		padding: 1em;

		border: none;
		border-radius: 5px;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	:global(#thumbsUp),
	:global(#thumbsDown) {
		border: #d2d2d2 1px solid;
		padding: 1em;
		border-radius: 16px;
		transition: all 0.3s ease-in-out;
		cursor: pointer;
		height: 48px;
	}
	#thumbsUpDialog,
	#thumbsDownDialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9999; /* Ensure it sits on top of other content */

		/* other style properties as needed */
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		box-shadow:
			0 10px 20px rgba(0, 0, 0, 0.19),
			0 6px 6px rgba(0, 0, 0, 0.23);

		background-color: #fefefe;
		border: none;
		border-radius: 1rem;
	}

	:global(#thumbsUp:hover),
	:global(#thumbsDown:hover) {
		border: #2b5592 1px solid;
		background-color: #d0e0f8;
		color: white;
	}

	@keyframes slideInFromBottom {
		0% {
			transform: translateY(-50px);
			opacity: 0.5;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes slideInFromright {
		0% {
			transform: translateX(50px);
			opacity: 0.5;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	:global(.detailsGetSupport:hover) {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
	}
	:global(details.dropdown) {
		border: 1px solid var(--border-gray-2);
		/* border-radius: 16px; */
		background-color: #fff;
		font-family: inherit;
		font-size: var(--font-size-base);
		color: #333;
	}

	/* summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
    } */

	:global(.center) {
		display: grid;
		place-items: center;
	}

	:global(.row-flex > .center > svg) {
		width: 3.5em;
		height: auto;
	}

	:global(summary::marker) {
		appearance: none;
	}

	:global(details.dropdown) {
		list-style: none;
		/* border-radius: 16px; */
		background-color: #fff;
		font-family: inherit;
		font-size: var(--font-size-base);
		color: #333;
		padding: 1em 1.5em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		box-shadow:
			rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
			rgba(0, 0, 0, 0.14) 0 6px 10px 0,
			rgba(0, 0, 0, 0.12) 0 1px 18px 0;
	}

	.row-flex {
		display: flex;
		align-items: flex-start;
	}

	.full {
		width: 100%;
		margin-top: 2em;
	}

	.full iframe {
		width: 100%;
		min-height: 100vh;
		overflow-y: visible;
	}

	.title {
		margin-left: clamp(0.5em, 0.75em, 3.24em);
	}

	.ionicon {
		height: 2em;
		width: 2em;
		fill: #333;
	}

	.up {
		transform: rotate(0deg);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.drop {
		transform: rotate(180deg);
		transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.dropdown-content {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-top: none;
		border-bottom: 1px solid #dfdfdf;
		width: 100%;
		margin-bottom: 1em;
	}

	.closeButton {
		background: white;
		color: #888;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: transparent 1px solid;
		border: transparent 1px solid;
	}
	.closeButton:hover {
		border: #888 1px solid;
	}
	.submitButton {
		background: #1d69cc;
		margin: 1px;
		border: #1d69cc 1px solid;
		color: white;
		width: fit-content;
		padding: 1em 2em;
		border-radius: 8px;
		border: 0;
	}

	:global(#getSupportWidgetDialog details) {
		border-right: 3px solid #1d69cc;

		/* padding: 1em; */
		border: #d2d2d2 1px solid;
		margin-right: 0;

		margin: 1em;
		/* box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0; */
		/* margin-top: 1em; */
		border-radius: 16px;
		position: relative;
		border-right: 3px solid #1d69cc;
	}
	:global(#getSupportWidgetDialog details details) {
		border-radius: 0 0 16px 16px;
		background: white;
	}

	.DialogFeedbackButtons {
		display: none; /* Hide the checkbox */
	}
	.feedbackButton:hover {
		border-radius: 12px;
		color: #1d69cc;
		border: #1d69cc 1px solid;
		background: rgba(155, 215, 255, 0.5);
	}
	.feedbackButton {
		/* Style the label as a button */
		padding: 10px 20px;
		border: 1px solid #333;
		border-radius: 6px;
		display: inline-block;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
	}

	.DialogFeedbackButtons:checked + .feedbackButton {
		/* Change appearance when checkbox is checked */
		border: 1px solid rgba(155, 215, 255, 0.5);
		background-color: rgba(155, 215, 255, 0.5);
		border-radius: 10px;
		color: #2b5592;
	}

	.DialogFeedbackButtons {
		border: #888 1px solid;
		color: #888;
		background: white;
		padding: 0.5em 1em;
		border-radius: 4px;
	}
	.DialogFeedbackButtonsContainer,
	.dialogControls {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		justify-content: flex-start;
		gap: 1em;
		flex-wrap: wrap;
	}
	.dialogControls {
		justify-content: flex-end;
	}
	.modal-content * {
		margin: 0.5em 0;
	}
	.modal-content {
		/* center modal-content on the screen */

		margin: 1em; /* 15% from the top and centered */
		padding-top: 1em;
		gap: 1em;

		display: grid;
		flex-direction: column;
	}

	dialog {
		border: none;

		/* max-width: clamp(350px, 100%, 1000px); */
	}
	dialog textarea {
		width: 100%;
		height: 100px;
		border-radius: 8px;
		border: #d2d2d2 1px solid;
		padding: 1em;
		resize: none;
	}
	.dialogContainer {
		display: flex;
		flex-direction: column;

		/* display:none; */
	}
	dialog::backdrop {
		background-color: hsl(250, 100%, 50%, 0.25);
	}
	.video-card {
		max-width: clamp(200px, 100%, 600px);
		background-color: white;
		display: inline-block;
		position: relative;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid #d2d3d7;
		transition: all 0.3s ease-in-out;
		scroll-snap-align: start;
		align-self: center;
		margin-bottom: 2em;
		max-height: 336px;
	}

	.vid-card-iframe {
		width: 100%;
		height: clamp(200px, 250px, 300px);
	}

	.video-text-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.video-card-title {
		padding: 0 1em;
		color: var(--cisco-dark-blue);
		margin: 0 0 0.6em 0;
		font-weight: 700;
		font-size: var(--font-size-md);
		line-height: 1.286;
	}

	#video-card-description {
		padding: 0 1em 1em 1em;
		color: rgb(88, 91, 99);
		margin: 0 0 1em 0;
		display: -webkit-box;
		display: inline-block;
		font-weight: 800;
		overflow: hidden;
		font-family: 'CiscoSansThin';
	}

	/* Hover section */
	.video-card:hover {
		box-shadow: 0px 4px 20px rgb(0 0 0 / 15%);
		transition: all 0.5s ease-in-out;
	}

	:link {
		text-decoration: none;
		color: var(--cisco-blue);
	}

	@media only screen and (min-width: 401px) and (max-width: 768px) {
		summary.dropdown-summary {
			max-height: 80px;
		}
		.vid-card-iframe {
			width: 100%;
			height: 55%;
		}
		.video-card {
			width: 250px;
			height: 250px;
			border-radius: 16px;
		}

		.video-card-title {
			padding: 0.5em 0.5em 5em 0.5em;
			font-weight: 700;
		}
	}

	:global(.genericSupportButtons) {
		display: flex;
		align-items: flex-start;
		gap: 1em;
		justify-content: space-evenly;
	}

	:global(.questions) {
		display: flex;
		flex-flow: row wrap;
		align-items: flex-start;
		justify-content: space-evenly;
	}

	:global(#detailsFaqlike) {
		/* padding: 1em 1.5em; */
		/* border: #d2d2d2 1px solid; */
		border-radius: 0 0 5px 5px;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		/* margin: 1em; */
		color: var(--text-color-black3);
		/* font-family: "CiscoSansTTBold"; */
		background: white;
	}
	:global(.get-support-contain) {
		position: relative;
		z-index: 0;
		pointer-events: none;
	}
	:global(.messageWell h2) {
		/* font-family: "CiscoSansTTBold"; */
		font-size: 2em;

		text-align: center;
		/* text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); */
		/* padding: 20px; */
		/* margin: 0 auto; */
		/* max-width: 1500px; */
		line-height: 1em;
		font-weight: 700;
		margin: 6em 0 0 0;
		font-style: normal;
	}
	:global(.messageWell h1) {
		font-family: 'Arial', sans-serif; /* You can replace this with your preferred font family */
		font-size: var(
			--font-size-md
		); /* Adjust this based on how large you want the hero text to be */

		color: #333; /* Makes the text color white */
		text-align: center; /* Centers the text */

		max-width: 1500px; /* Prevents the text block from becoming too wide on large screens */
		line-height: 2.8em;
		font-weight: 700;
		margin: 0em 0 0 0;
		background: -webkit-linear-gradient(left, #1d69cc, #2196f3);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	:global(.messageWell) {
		margin: 1em 0 0 0;
		overflow: hidden;

		transition: all 0.5s ease-out;
		border-radius: 5px 5px 0 0;
		/* background: #efefef; */
		/* background: radial-gradient(
      75.83% 78.18% at 51.72% 100%,
      rgba(56, 96, 190, 0.03) 0%,
      rgba(100, 187, 227, 0.03) 65.24%,
      rgba(223, 223, 223, 0) 100%
    ),
    conic-gradient(
      from 180deg at 50% 50%,
      rgba(56, 96, 190, 0) 0deg,
      rgba(56, 96, 190, 0.02) 360deg
    ); */

		/* mix-blend-mode: color-burn; */
		min-height: 30dvh;
		/* height: auto; */
		max-height: 35dvh;
		overflow: auto;
		/* scroll-snap-type: y mandatory; */
		padding: 1em 1em 5em 1em;
	}
	:global(.messageWell.open) {
		/* background: #efefef; */
		/* background: radial-gradient(
      75.83% 78.18% at 51.72% 100%,
      rgba(56, 96, 190, 0.03) 0%,
      rgba(100, 187, 227, 0.03) 65.24%,
      rgba(223, 223, 223, 0) 100%
    ),
    conic-gradient(
      from 180deg at 50% 50%,
      rgba(56, 96, 190, 0) 0deg,
      rgba(56, 96, 190, 0.02) 360deg
    ); */

		mix-blend-mode: color-burn;

		/* height: auto; */
		max-height: 50dvh;
		overflow: auto;
		/* scroll-snap-type: y mandatory; */
		padding: 1em 1em 5em 1em;
	}
	:global(.messageWell.open > *) {
		scroll-snap-align: start;
	}
	:global(.user) {
		background-color: var(--cisco-dark-blue);
		color: var(--text-white-1);
		padding: 1.5em;
		max-width: fit-content;
	}

	:global(.detailsGetSupport > div.messageWell.open > div > div > details > *) {
		margin: 1em 0;
	}

	:global(.assistant) {
		background-color: #f2f2f2;
		border-radius: 10px;
		padding: 1.5em;
		/* margin: 1em 0; */
		color: var(--font-gray);
		margin-bottom: 0;
	}
	/* .assistant of nth kind */
	:global(.assistant:nth-of-type(even)) {
		background-color: #fff;
		border-radius: 10px;
		padding: 1em;
		margin: 1em 0;
		color: var(--font-gray);
		margin-bottom: 0;
	}

	:global(details) {
		/* background-color: #fff; */
		/* font-family: inherit; */
		/* font-size: var(--font-size-base); */
		color: #333;
		padding: 1em;
		border: #d2d2d2 1px solid;
		-webkit-transition: all 0.25s ease-in;
		-o-transition: all 0.25s ease-in;
		transition: all 0.25s ease-in;
		margin: 1em;
		/* box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px, rgba(0, 0, 0, 0.14) 0 6px 10px 0,
            rgba(0, 0, 0, 0.12) 0 1px 18px 0; */
		/* margin-top: 1em; */
		border-radius: 0 16px 16px 0;

		position: relative;
		background-color: var(--menu-background-gray);
	}
	:global(#sources) {
		margin: 1em 0 0 0;
		padding: 0;
	}
	:global(.buttonWell) {
		display: flex;
		align-items: flex-start;
		flex-direction: row;
		justify-content: space-evenly;
		flex-wrap: wrap;
		gap: 1em;
	}
	.button,
	:global(.question-button),
	:global(#detailsFaqlike > div > button) {
		display: inline;
		border: #333 1px solid;
		color: #333;
		background-color: white;
		padding: 0.5em;
		border-radius: 6px;
		text-align: center;
		font-size: var(--font-size-base);
		cursor: pointer;
		/* font-family: ciscosansthin; */
		/* margin: 0.5em 0; */
		text-decoration: none;
		transition: all 0.5s ease-in-out;
	}

	:global(summary::marker) {
		appearance: none;
	}

	:global(details summary::-webkit-details-marker),
	:global(details summary::marker) {
		display: none;
		content: '';
	}

	.button:hover,
	:global(#detailsFaqlike > div > button:hover),
	.submitButton:hover {
		background-color: rgba(155, 215, 255, 0.5);
		color: #2b5592;
		border-radius: 12px;
		border: #2b5592 1px solid;
	}

	details {
		/* border-left: 3px solid #1d69cc; */
	}
	#eot-doc-wrapper {
		margin-bottom: 50em;
	}

	#eot-doc-wrapper h2 {
		color: #2b5592;
		margin-top: 1.5em;
	}

	#eot-doc-wrapper h3 {
		color: #888;
	}

	#eot-doc-wrapper a[href],
	:global(#eot-doc-wrapper abbr) {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		font-weight: 700;
	}

	#eot-doc-wrapper a[href]:hover,
	:global(#eot-doc-wrapper abbr:hover) {
		color: #64bbe3;
		-webkit-text-decoration-color: #2b5592;
		text-decoration-color: #2b5592;
		transition: 0.3s;
	}

	#eot-doc-wrapper a {
		color: #2b5592;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
		text-underline-position: below;
		transition: 0.3s;
	}

	#eot-doc-wrapper #context-selector-tab-container a:not(.active) {
		color: #64bbe3;
	}

	#eot-doc-wrapper .cdt-note a[href] {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}

	#eot-doc-wrapper .cdt-note a[href]:hover {
		color: #6cc04a;
		-webkit-text-decoration-color: #64bbe3;
		text-decoration-color: #64bbe3;
	}

	#eot-doc-wrapper .cdt-best-practice a[href] {
		color: #6cc04a;
	}

	#eot-doc-wrapper .cdt-best-practice a[href]:hover {
		color: #64bbe3;
		-webkit-text-decoration-color: #6cc04a;
		text-decoration-color: #6cc04a;
	}

	:global(#eot-doc-wrapper samp) {
		color: #fff;
	}

	#eot-doc-wrapper .kbd-cdt p {
		color: #64bbe3;
	}

	#eot-doc-wrapper p {
		line-height: 1.25em;
		/* margin: 1.5em 40px; */
		/* text-align: justify; */
	}

	:global(#eot-doc-wrapper blockquote) {
		font-size: 1.5em;
		border-top: 0.25em #2b5592 solid;
		border-bottom: 0.25em #2b5592 solid;
		color: #2b5592;
		font-weight: 600;
		padding: 1.5em 1em;
		margin: 1.5em 40px;
	}

	/* #eot-doc-wrapper kbd {
	  display: block;
	  font-size: 1.25em;
	  height: auto;
	  background-color: #0d274d;
	  color: #64bbe3;
	  border-radius: 5px;
	  padding: 1.5em;
	  margin: 1.5em 40px;
	  box-shadow: 0 0 16px 0 rgba(43, 85, 146, .2)
	} */

	#eot-doc-wrapper li {
		color: #58585b;
	}

	#eot-doc-wrapper li p {
		margin: 0;
	}

	:global(#eot-doc-wrapper ol) {
		-webkit-padding-start: 1px;
		padding-inline-start: 1px;
	}

	:global(#eot-doc-wrapper ol),
	#eot-doc-wrapper ul {
		list-style: none;
	}

	/* #eot-doc-wrapper ul {
      margin-left: 40px;
    } */

	#eot-doc-wrapper ul li p {
		display: contents;
	}

	#eot-doc-wrapper ul li p a {
		display: contents;
	}

	#eot-doc-wrapper ul li ul li {
		display: contents;
	}

	#eot-doc-wrapper ul li::before {
		content: '\25cf';
		color: #64bbe3;
		font-weight: 900;
		font-size: 1.15em;
		display: inline-block;
		width: 1em;
		text-align: left;
	}

	#eot-doc-wrapper ol {
		margin-left: 40px;
	}

	#eot-doc-wrapper .cdt-count li {
		counter-increment: step-counter;
		margin-bottom: 10px;
	}

	#eot-doc-wrapper .cdt-count li::before {
		content: counter(step-counter);
		margin-right: 8px;
		font-size: 80%;
		border: #64bbe3 2px solid;
		color: #58585b;
		font-weight: 700;
		padding: 4px 8px;
		border-radius: 15px;
		text-align: center;
	}

	:global(#eot-doc-wrapper #context-selector-tab-container) {
		height: 3rem;
		margin: 0;
		white-space: nowrap;
		word-wrap: normal;
		border-bottom: 0.0625rem solid #dfdfdf;
		/* font-size: 1.5em; */
	}

	/* #eot-doc-wrapper details h3 {
  margin-left: 1em;
} */

	#eot-doc-wrapper #context-selector-tab-container a:hover {
		text-decoration: none;
	}

	@media (hover: hover) and (pointer: fine) {
		#eot-doc-wrapper #context-selector-tab-container a:hover:not(.active) {
			background-color: #f2f2f2;
			border-radius: 5px;
		}

		#context-selector-tab-container:hover:after {
			margin-left: 1em;
			content: '\21d4 Toggle content';
			-webkit-animation: fadeout 0.3s linear;
			animation: fadeout 0.3s linear;
			color: #2b5592;
		}

		#eot-doc-wrapper #cdt-details:hover:after {
			content: ' \21d4 Toggle content';
			color: #2b5592;
			-webkit-animation: fadeout 0.3s linear;
			animation: fadeout 0.3s linear;
			font-size: 0.75em;
		}

		#eot-doc-wrapper .kbd-cdt {
			display: block;
			font-size: 1.25em;
			height: auto;
			background-color: #dfdfdf;
			color: var(--text-color-blue1);
			border-radius: 12px;
			padding: 1.5em;
			margin: 1.5em 40px;
			box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		}

		#eot-doc-wrapper .kbd-cdt p {
			padding: 0;
			margin: 0;
		}

		#eot-doc-wrapper .kbd-cdt:hover {
			background-color: #c2c2c2;
			cursor: copy;
		}

		#eot-doc-wrapper .kbd-cdt:hover:after {
			content: attr(data-label);
			display: grid;
			justify-content: end;
			align-content: flex-start;
			height: 0;
		}

		#eot-doc-wrapper .KBDCDTCOPY:after {
			display: grid;
			place-items: center;
			color: #ffa000;
			content: '  Copied! ';
		}

		@-webkit-keyframes fadeout {
			0% {
				opacity: '100%';
			}

			50% {
				opacity: '50%';
			}

			100% {
				opacity: '0%';
			}
		}

		@keyframes fadeout {
			0% {
				opacity: '100%';
			}

			50% {
				opacity: '50%';
			}

			100% {
				opacity: '0%';
			}
		}

		#eot-doc-wrapper #cdt-details:hover {
			background-color: #f2f2f2;
			transition: background-color 0.3s ease-in-out;
			border-radius: 5px;
		}

		#eot-doc-wrapper #CDT-Tag-Container a:hover {
			transition: 0.3s;
			background-color: #64bbe3;
			border-radius: 5px;
			transform: translateY(-0.5rem);
		}
	}

	#eot-doc-wrapper #cdt-details {
		font-size: 1.5em;
		font-weight: 600;
		padding: 0.25em 0.25em 0.25em 0.5em;
		transition: background-color 0.3s ease-in-out;
	}

	/* #eot-doc-wrapper details {
      border-left: 3px solid #2b5592;
    } */

	#eot-doc-wrapper .active {
		border-bottom: 0.1875rem solid #64bbe3;
		color: #58585b;
	}

	.context-selector-tab {
		transition: all 0.3s ease;
		cursor: pointer;
		display: inline-block;
		height: 2.875rem;
		line-height: 2.9375rem;
		padding: 0 0.625rem;
		white-space: nowrap;
	}

	#eot-doc-wrapper .cdt-note:before {
		color: #64bbe3;
		content: '\1F6C8  Note:';
		font-size: 1.2em;
		font-weight: 700;
		line-height: 2em;
	}

	#eot-doc-wrapper .cdt-note {
		background-color: #0d274d;
		padding: 1.5em;
		color: #fff;
		margin: 1.5em 40px;
		border-radius: 5px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		border-left: #64bbe3 5px solid;
	}

	#eot-doc-wrapper .cdt-note p {
		margin: auto 0;
		color: #fff;
	}

	#eot-doc-wrapper .cdt-software-alert p {
		margin: 1.5em 0;
	}

	#eot-doc-wrapper #cdt-software-alert-button {
		padding: 0.5em 1.5em;
		background-color: #6cc04a;
		color: #fff;
		border-radius: 25px;
		margin: 0.5em;
		text-decoration: none;
	}

	#eot-doc-wrapper #cdt-software-alert-button:hover {
		background-color: #ffa000;
		color: #fff;
	}

	#eot-doc-wrapper .cdt-software-alert:before {
		color: #ffa000;
		content: '\2913  Download Notice:';
		font-size: 1.2em;
		font-weight: 700;
		line-height: 2em;
		transition: all 0.3s ease;
	}

	#eot-doc-wrapper .cdt-software-alert {
		background-color: #0d274d;
		padding: 1.5em;
		color: #fff;
		margin: 1.5em 40px;
		border-radius: 5px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		border-left: #ffa000 5px solid;
	}

	#eot-doc-wrapper .cdt-best-practice:before {
		color: #6cc04a;
		content: '\272A  Best Practice:';
		font-size: 1.2em;
		font-weight: 700;
		line-height: 2em;
		transition: all 0.3s ease;
	}

	#eot-doc-wrapper .cdt-best-practice {
		background-color: #0d274d;
		padding: 1.5em;
		color: #fff;
		margin: 1.5em 40px;
		border-radius: 5px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
		border-left: #6cc04a 5px solid;
	}

	#eot-doc-wrapper .cdt-best-practice p {
		margin: auto 0;
		color: #fff;
	}

	#eot-doc-wrapper ol {
		list-style-position: initial;
	}

	#eot-doc-wrapper kbd,
	#eot-doc-wrapper table,
	#eot-doc-wrapper video {
		margin-left: 40px;
		transition: all 0.3s ease;
	}

	#eot-doc-wrapper li li {
		margin-left: 0;
	}

	#eot-doc-wrapper img {
		max-width: calc(100% - 80px);
		height: auto;
		margin: 1.5em 40px;
		border-radius: 5px;
		/* box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2); */
	}

	#eot-doc-wrapper svg {
		max-width: calc(100% - 80px);
		height: auto;
		margin: 1.5em 40px;
		border-radius: 5px;
	}

	#eot-doc-wrapper table {
		border-collapse: collapse;
		max-width: calc(100% - 80px) !important;
		margin: 1.5em 40px;
		box-shadow: 0 0 16px 0 rgba(43, 85, 146, 0.2);
	}

	#eot-doc-wrapper td,
	#eot-doc-wrapper th {
		text-align: left;
		word-break: keep-all;
		border-radius: 0;
	}

	#eot-doc-wrapper tr {
		border: 0;
		text-align: left;
		padding: 10px;
	}

	#eot-doc-wrapper th p {
		background-color: #0d274d;
		color: #fff !important;
		text-align: center;
		vertical-align: middle;
		font-size: 1.05em;
		border-left: 0;
		border-top: 0;
		border-right: 0;
		padding: 1em;
	}

	#eot-doc-wrapper th {
		background-color: #0d274d;
		color: #fff !important;
		text-align: center;
		vertical-align: middle;
		font-size: 1.05em;
		border-left: 0;
		border-top: 0;
		border-right: 0;
		padding: 1em;
	}

	#eot-doc-wrapper table th:last-child {
		border-top-right-radius: 5px;
	}

	#eot-doc-wrapper table th:first-child {
		border-top-left-radius: 5px;
	}

	#eot-doc-wrapper tr:nth-child(odd) {
		background-color: #c4d6ed;
	}

	#eot-doc-wrapper td > p {
		margin-left: 0;
	}

	#eot-doc-wrapper th > p {
		margin-left: 0;
	}

	#eot-doc-wrapper th > p {
		margin: 0;
		text-align: left;
	}

	#eot-doc-wrapper .Vid-Card-CDT {
		border-radius: 1px;
		border-top: 30px solid #64bbe3;
		box-shadow:
			-1px 0 2px 0 rgba(0, 0, 0, 0.15),
			1px 0 2px 0 rgba(0, 0, 0, 0.15),
			0 1px 1px 0 rgba(0, 0, 0, 0.24);
		padding: 16px;
		margin-bottom: 1em;
		width: calc(100% - 80px);
		position: relative;
		margin: auto;
		margin-bottom: 2em;
	}

	#eot-doc-wrapper .Vid-Card-CDT > h2 {
		margin-bottom: 1em;
	}

	#eot-doc-wrapper .videoWrapper {
		position: relative;
		padding-bottom: 56.25%;
		padding-top: 25px;
		height: 0;
		margin-bottom: 1em;
	}

	#eot-doc-wrapper .videoWrapper iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 95%;
		height: 95%;
	}

	@media screen and (max-width: 768px) {
		#eot-doc-wrapper blockquote,
		#eot-doc-wrapper kbd,
		#eot-doc-wrapper p,
		#eot-doc-wrapper table,
		#eot-doc-wrapper video {
			line-height: 1.25em;
			margin: 1.5em 20px;
		}

		#eot-doc-wrapper img,
		#eot-doc-wrapper kbd,
		#eot-doc-wrapper table {
			box-shadow: none;
		}

		#eot-doc-wrapper p {
			margin: 1.5em 20px;
			padding: 0;
			line-height: 1.25em;
			word-break: break-word;
		}

		#eot-doc-wrapper img {
			max-width: 100%;
			height: auto;
			margin: 1.5em 0;
			border-radius: 0;
		}

		#eot-doc-wrapper svg {
			max-width: 100%;
			height: auto;
			margin: 1.5em 0;
			border-radius: 0;
		}

		#eot-doc-wrapper blockquote {
			font-size: 1.5em;
			border-top: 0.25em #2b5592 solid;
			border-bottom: 0.25em #2b5592 solid;
			color: #2b5592;
			font-weight: 600;
			padding: 1.5em;
			margin-top: 1.5em;
			margin-bottom: 1.5em;
			width: calc(100% - 20px);
		}

		#eot-doc-wrapper th {
			padding: 0.5em;
		}

		#eot-doc-wrapper table th:last-child {
			border-top-right-radius: 0;
		}

		#eot-doc-wrapper table th:first-child {
			border-top-left-radius: 0;
		}

		#eot-doc-wrapper td > p {
			font-size: 0.75em;
			padding: 0;
			margin: 0;
			line-height: 1.1em;
		}

		#eot-doc-wrapper th p {
			font-size: 0.75em;
			margin: 0;
			padding: 0;
			text-align: left;
			word-break: break-word;
		}

		#eot-doc-wrapper table {
			border-collapse: collapse;
			max-width: 100% !important;
			letter-spacing: 2.5;
			margin: 1.5em auto;
			word-break: break-word;
		}

		#eot-doc-wrapper td,
		#eot-doc-wrapper th {
			box-sizing: border-box;
			text-align: left;
		}

		#eot-doc-wrapper tr {
			border: 2px solid #dfdfdf;
			text-align: left;
			border-left: solid #dfdfdf 2px;
			border-top: solid #dfdfdf 2px;
		}

		#eot-doc-wrapper .cdt-best-practice,
		#eot-doc-wrapper .cdt-note,
		#eot-doc-wrapper .cdt-software-alert {
			max-width: 100%;
			margin: 1.5em 0;
			border-radius: 0;
			box-shadow: none;
		}

		#eot-doc-wrapper kbd {
			max-width: 100%;
			margin: 1.5em 0;
			border-radius: 0;
			box-shadow: none;
		}
	}

	#eot-doc-wrapper #cdt-vid-card-button:hover {
		transition: width 0.3s;
		width: 600px;
	}

	#eot-doc-wrapper #CDT-vid-iframe:hover {
		transition: width 0.3s;
		width: 600px;
	}

	#eot-doc-wrapper #CDT-vid-iframe {
		background-color: #2b5592;
		min-height: 350px;
	}

	#eot-doc-wrapper #CDT-vid-iframe .active-vid {
		min-width: 100%;
	}

	#eot-doc-wrapper #cdt-vid-card-button {
		background: linear-gradient(
			90deg,
			#64bbe3 0,
			rgba(71, 135, 186, 0.795833) 51.04%,
			#64bbe3 100%
		);
		border-radius: 0 0 5px 5px;
		display: block;
		height: 2em;
		text-align: center;
		color: #fff;
		line-height: 2em;
		text-decoration: none;
	}

	#eot-doc-wrapper #cdt-vid-card-button:before {
		content: '\25B6 ';
		padding: 0.25em;
		margin-right: 8px;
	}

	#eot-doc-wrapper #CDT-Tag-Container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-content: center;
		margin: 3em 40px;
	}

	#eot-doc-wrapper #CDT-Tag-Container-Button {
		padding: 0.5em 1.5em;
		background-color: #2b5592;
		color: #fff;
		border-radius: 25px;
		margin: 0.5em;
		text-decoration: none;
	}

	.icon-article {
		background-color: #4caf50; /* Green color for article */
	}

	.icon-guide {
		/* background-color: #2196f3; */

		border-left: #2196f3 5px solid;
	}

	.icon-video {
		background-color: #f44336; /* Red color for video */
	}

	.icon-cli-guide {
		background-color: #9c27b0; /* Purple color for CLI guide */
	}
	.icon-band {
		padding: 0.5em 0 0 1em;
	}
	.icon-band a {
		margin-top: 1em;
	}

	#stepNumberBreadcrumb {
		display: inline-block;
		text-align: center;
		line-height: 1.75em;
		font-weight: bold;
		font-size: 1.25em;
		width: 1.75em;
		height: 1.75em;
		color: #888;
		border-radius: 35px;
		aspect-ratio: 1/1;
		margin-right: 0.5em;
		border: #888 1px solid;
	}
	#toggleBtn {
		width: fit-content;
		align-items: end;
		border: #1d69cc 1px solid;
		margin: 1em 0 0 0;
	}
	#buttonContainer {
		position: fixed;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: 1fr;
		/* gap: 1em; */
		z-index: 1000;
		width: 400px;
		margin: 0.5em;
		justify-items: end;
		transition: width 0.3s ease-in-out;
	}
	#getSupportBtn {
		transition: all 0.3s ease-in-out;
		transition: width 0.3s ease-in-out;
		width: 100%;
	}

	/* select the first .button only */
	#buttonContainer > .button:first-child {
		background: white;
		color: #888;
		border: #888 1px solid;
		transition: all 0.3s ease-in-out;
	}
	#buttonContainer > .button:first-child:hover {
		background: #d0e0f8;
		color: #1d69cc;
		border: #d0e0f8 1px solid;
	}

	.button {
		right: 0;
		bottom: 0;
		background-color: #1d69cc;
		color: #fff;
		border-radius: 25px;
		text-decoration: none;
		font-size: 1.15em;
		/* padding: 0.75em; */
		transition: all 0.3s ease-in-out;
	}
	.modeIconFullyGuided,
	.modeIconLightlyGuided {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 1em;
	}
</style>
