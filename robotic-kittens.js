violetLog = function(msg) {console.log('%c'+msg, 'color: #C728FF;');};
getResource = function(resourceName) {
	return gamePage.resPool.get(resourceName);
};
isAlmostFilled = function(resource) {
	return resource.value / resource.maxValue > 0.95;
};
craftAll = function(resourceName, craftName) {
	var resource = getResource(resourceName);
	if (isAlmostFilled(resource) && gamePage.workshop.getCraft(craftName).unlocked) {
		violetLog('Crafting ' + craftName);
		gamePage.craftAll(craftName);
	}
};
getAutomationPref = function() {
	var localStoragePref = JSON.parse(window.localStorage.getItem('roboticKittensAutomation'));

	return localStoragePref ? localStoragePref : {
		catnip: {
			id: 'automatizeCatnip',
			optionLabel: 'Automatize catnip gathering',
			value: false
		},

		hunt: {
			id: 'automatizeHunt',
			optionLabel: 'Automatize hunting',
			value: false
		},
		parchment: {
			id: 'automatizeParchment',
			optionLabel: 'Automatize parchment craft',
			value: false
		},
		manuscript: {
			id: 'automatizeManuscript',
			optionLabel: 'Automatize manuscript craft',
			value: false
		},
		compedium: {
			id: 'automatizeCompedium',
			optionLabel: 'Automatize compedium craft',
			value: false
		},
		blueprint: {
			id: 'automatizeBlueprint',
			optionLabel: 'Automatize blueprint craft',
			value: false
		},

		wood: {
			id: 'automatizeWood',
			optionLabel: 'Automatize wood craft',
			value: false
		},
		beam: {
			id: 'automatizeBeam',
			optionLabel: 'Automatize beam craft',
			value: false
		},
		slab: {
			id: 'automatizeSlab',
			optionLabel: 'Automatize slab craft',
			value: false
		},
		steel: {
			id: 'automatizeSteel',
			optionLabel: 'Automatize steel craft',
			value: false
		},
		plate: {
			id: 'automatizePlate',
			optionLabel: 'Automatize plate craft',
			value: false
		},

		promotion: {
			id: 'automatizePromotion',
			optionLabel: 'Automatize kittens promotion',
			value: false
		},

		praise: {
			id: 'automatizePraise',
			optionLabel: 'Automatize PRAISE THE SUN',
			value: false
		},

		observe: {
			id: 'automatizeObserve',
			optionLabel: 'Automatize observing the sky',
			value: false
		}
	};
};
saveAutomationPref = function() {
	window.localStorage.setItem('roboticKittensAutomation', JSON.stringify(roboticKittens.automatize));
	violetLog('Robotic Kittens options saved.');
}

function roboticKittensInit() {
	window.roboticKittens = {
		automatize: getAutomationPref(),

		sendHunters: function() {
			var catpower = getResource('manpower');
		 	if (roboticKittens.automatize.hunt.value && isAlmostFilled(catpower)) {
				violetLog('Sending hunters.');
			 	$("a:contains('Send hunters')").click();
			 	if (gamePage.workshop.getCraft('parchment').unlocked && roboticKittens.automatize.parchment.value) {gamePage.craftAll('parchment'); }
			 	if (gamePage.workshop.getCraft('manuscript').unlocked && roboticKittens.automatize.manuscript.value) { gamePage.craftAll('manuscript'); }
			 	if (gamePage.workshop.getCraft('compedium').unlocked && roboticKittens.automatize.compedium.value) { gamePage.craftAll('compedium'); }
			 	if (gamePage.workshop.getCraft('blueprint').unlocked && roboticKittens.automatize.blueprint.value) { gamePage.craftAll('blueprint'); }
		 	}
		},
		minMaxCraft: function() {
			// Wood craft
			if (roboticKittens.automatize.wood.value) {
				var catnip = getResource('catnip');
				// Do not refine if production is negative or it's winter or it's past mid autumn
				var shooldRefine = !(catnip.perTickCached < 0 || gamePage.calendar.getCurSeason().name === 'winter' || (gamePage.calendar.getCurSeason().name === 'autumn' && gamePage.calendar.day > 50));
				if (shooldRefine && isAlmostFilled(catnip)) {
					violetLog('Crafting wood');
					gamePage.craftAll('wood');
				}
			}
			// Beam craft
			if (roboticKittens.automatize.beam.value) { craftAll('wood', 'beam'); }
			// Slab craft
			if (roboticKittens.automatize.slab.value) { craftAll('minerals', 'slab'); }
			// Steel & Plate craft
			var coal = getResource('coal');
			var iron = getResource('iron');
			if (roboticKittens.automatize.steel.value && isAlmostFilled(coal)) {
				violetLog('Crafting steel');
				gamePage.craftAll('steel');
			}
			else if (roboticKittens.automatize.steel.value && roboticKittens.automatize.plate.value && isAlmostFilled(iron)) {
				violetLog('Crafting steel and plate');
				gamePage.craftAll('steel');
				gamePage.craftAll('plate');
			}

		},
		minMaxPromotion: function() {
			if (!roboticKittens.automatize.promotion.value) { return; }

			var gold = getResource('gold');
			if (isAlmostFilled(gold)) {
				violetLog('Promoting kittens');
				gamePage.village.promoteKittens();
			}
		},
		minMaxFaith: function() {
			if (!roboticKittens.automatize.praise.value) { return; }

			var faith = getResource('faith');
			if (isAlmostFilled(faith)) {
				violetLog('PRAISE THE SUN !');
				gamePage.religion.praise();
			}
		},
		observeSky: function() {
			if (!roboticKittens.automatize.observe.value) { return; }

			if ($('#observeBtn')[0]) {
				$('#observeBtn').click();
				violetLog('Observing the sky.');
			}
		},

		constructOptionsHtml: function() {
			// Create popin
			var roboticKittensOptsPopin = document.createElement('div');
			roboticKittensOptsPopin.setAttribute('id', 'roboticKittensPopin');
			roboticKittensOptsPopin.setAttribute('class', 'dialog help');
			roboticKittensOptsPopin.setAttribute('style', 'height: 380px; margin-top: -190px; display: none;');
			$(roboticKittensOptsPopin).append('<a href="#" class="close" onclick="$(\'#roboticKittensPopin\').hide();" style="position: absolute; top: 10px; right: 15px;">close</a>');
			$(roboticKittensOptsPopin).insertAfter('#optionsDiv');
			$('#headerLinks .links-block').prepend('<a href="#" onclick="$(\'#roboticKittensPopin\').show();">Robotic Kittens</a> | ');

			// Create our div
			$(roboticKittensOptsPopin).append('<h4>Robotic Kittens</h4>');
			// Add options
			$.each(roboticKittens.automatize, function(index, automation) {
				// Create hidden input
				var input = document.createElement('input');
				input.setAttribute('id', automation.id);
				input.setAttribute('type', 'checkbox');
				if (automation.value) {
					input.setAttribute('checked', 'checked');
				}
				$(input).click(function() {
					// Update automation on click
					automation.value = $(this).prop('checked');
					saveAutomationPref();
				});
				$(roboticKittensOptsPopin).append(input);

				// Create label
				$(roboticKittensOptsPopin).append('<label for="' + automation.id + '">' + automation.optionLabel + '</label>');
				$(roboticKittensOptsPopin).append('<br/>');
			});
		}
	}

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		// Auto gathering
		if (roboticKittens.automatize.catnip.value) {
    		gamePage.bld.gatherCatnip();
		}
	}), 1); // Once per 1 ticks (1/3 second)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
    	roboticKittens.observeSky();
	}), 3); // Once per 3 ticks (1 second)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		roboticKittens.sendHunters();
    	roboticKittens.minMaxCraft();
	}), 6); // Once per 6 ticks (2 seconds)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		roboticKittens.minMaxPromotion();
    	roboticKittens.minMaxFaith();
	}), 15); // Once per 15 ticks (5 seconds)

	// Construct HTML options
	roboticKittens.constructOptionsHtml();

	violetLog('Robotic Kittens initiliazed.');
}

if(window.roboticKittens === undefined) {
	roboticKittensInit();
}
