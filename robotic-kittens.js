violetLog = function(msg) { console.log('%c'+msg, 'color: #C728FF;');};
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

function automation_init() {
	window.automation = {
		automatize: {
			catnip: true,

			hunt: true,
			parchment: true,
			manuscript: false,
			compedium: false,
			blueprint: false,

			wood: true,
			beam: true,
			slab: true,
			steel: true,
			plate: true,

			promotion: true,

			praise: true,

			observe: true
		},

		sendHunters: function() {
			var catpower = getResource('manpower');
		 	if (automation.automatize.hunt && isAlmostFilled(catpower)) {
				violetLog('Sending hunters.');
			 	$("a:contains('Send hunters')").click();
			 	if (gamePage.workshop.getCraft('parchment').unlocked && automation.automatize.parchment) {gamePage.craftAll('parchment'); }
			 	if (gamePage.workshop.getCraft('manuscript').unlocked && automation.automatize.manuscript) { gamePage.craftAll('manuscript'); }
			 	if (gamePage.workshop.getCraft('compedium').unlocked && automation.automatize.compedium) { gamePage.craftAll('compedium'); }
			 	if (gamePage.workshop.getCraft('blueprint').unlocked && automation.automatize.blueprint) { gamePage.craftAll('blueprint'); }
		 	}
		},
		minMaxCraft: function() {
			// Wood craft
			if (automation.automatize.wood) {
				var catnip = getResource('catnip');
				// Do not refine if production is negative or it's winter or it's past mid autumn
				var shooldRefine = !(catnip.perTickCached < 0 || gamePage.calendar.getCurSeason().name === 'winter' || (gamePage.calendar.getCurSeason().name === 'autumn' && gamePage.calendar.day > 50));
				if (shooldRefine && isAlmostFilled(catnip)) {
					violetLog('Crafting wood');
					gamePage.craftAll('wood');
				}
			}
			// Beam craft
			if (automation.automatize.beam) { craftAll('wood', 'beam'); }
			// Slab craft
			if (automation.automatize.slab) { craftAll('minerals', 'slab'); }
			// Steel & Plate craft
			var coal = getResource('coal');
			var iron = getResource('iron');
			if (automation.automatize.steel && isAlmostFilled(coal)) {
				violetLog('Crafting steel');
				gamePage.craftAll('steel');
			}
			else if (automation.automatize.steel && automation.automatize.plate && isAlmostFilled(iron)) {
				violetLog('Crafting steel and plate');
				gamePage.craftAll('steel');
				gamePage.craftAll('plate');
			}

		},
		minMaxPromotion: function() {
			if (!automation.automatize.promotion) { return; }

			var gold = getResource('gold');
			if (isAlmostFilled(gold)) {
				violetLog('Promoting kittens');
				gamePage.village.promoteKittens();
			}
		},
		minMaxFaith: function() {
			if (!automation.automatize.praise) { return; }

			var faith = getResource('faith');
			if (isAlmostFilled(faith)) {
				violetLog('PRAISE THE SUN !');
				gamePage.religion.praise();
			}
		},
		observeSky: function() {
			if (!automation.automatize.observe) { return; }

			if ($('#observeBtn')[0]) {
				$('#observeBtn').click();
				violetLog('Observing the sky.');
			}
		}
	}

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		// Auto gathering
		if (automation.automatize.catnip) {
    		gamePage.bld.gatherCatnip();
		}
	}), 1); // Once per 1 ticks (1/3 second)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
    	automation.observeSky();
	}), 3); // Once per 3 ticks (1 second)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		automation.sendHunters();
    	automation.minMaxCraft();
	}), 6); // Once per 6 ticks (2 seconds)

	gamePage.timer.addEvent(dojo.hitch(this, function() {
		automation.minMaxPromotion();
    	automation.minMaxFaith();
	}), 15); // Once per 15 ticks (5 seconds)

	violetLog('Automation initiliazed.');
}

if(window.automation === undefined) {
	automation_init();
}
