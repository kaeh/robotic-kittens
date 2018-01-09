violetLog = function(msg) { console.log('%c'+msg, 'color: #C728FF;');}
getResource = function(resourceName) {
	return gamePage.resPool.get(resourceName);
}
isAlmostFilled = function(resource) {
	return resource.value / resource.maxValue > 0.95;
}
craftAll = function(resourceName, craftName) {
	var resource = getResource(resource);
	if (isAlmostFilled(resource) && gamePage.workshop.getCraft(craftName).unlocked) {
		violetLog('Crafting ' + craftName);
		gamePage.craftAll(craftName);
	}
}

function automation_init() {
	window.automation = {
		sendHunters: function() {
			var catpower = getResource('manpower');
		 	if (isAlmostFilled(catpower)) {
				violetLog('Sending hunters.');
			 	$("a:contains('Send hunters')").click();
			 	if (gamePage.workshop.getCraft('parchment').unlocked) {gamePage.craftAll('parchment'); }
			 	if (gamePage.workshop.getCraft('manuscript').unlocked) { gamePage.craftAll('manuscript'); }
			 	if (gamePage.workshop.getCraft('compedium').unlocked) { gamePage.craftAll('compedium'); }
			 	// if (gamePage.workshop.getCraft('blueprint').unlocked) { gamePage.craftAll('blueprint'); }
		 	}
		},
		minMaxCraft: function() {
			// Wood craft
			var catnip = getResource('catnip');
			// Do not refine if production is negative or it's winter or it's past mid autumn
			var shooldRefine = !(catnip.perTickCached < 0 || gamePage.calendar.getCurSeason().name === 'winter' || (gamePage.calendar.getCurSeason().name === 'autumn' && gamePage.calendar.day > 50));
			if (shooldRefine && isAlmostFilled(catnip)) {
				violetLog('Crafting wood');
				gamePage.craftAll('wood');
			}
			// Beam craft
			craftAll('wood', 'beam');
			// Slab craft
			craftAll('minerals', 'slab');
			// Steel & Plate craft
			var coal = getResource('coal');
			var iron = getResource('iron');
			if (isAlmostFilled(coal)) {
				violetLog('Crafting steel');
				gamePage.craftAll('steel');
			}
			else if (isAlmostFilled(iron)) {
				violetLog('Crafting steel and plate');
				gamePage.craftAll('steel');
				gamePage.craftAll('plate');
			}

		},
		minMaxPromotion: function() {
			var gold = getResource('gold');
			if (isAlmostFilled(gold)) {
				violetLog('Promoting kittens');
				gamePage.village.promoteKittens();
			}
		},
		minMaxFaith: function() {
			var faith = getResource('faith');
			if (isAlmostFilled(faith)) {
				violetLog('PRAISE THE SUN !');
				gamePage.religion.praise();
			}
		},
		observeSky: function() {
			if ($('#observeBtn')[0]) {
				$('#observeBtn').click();
				violetLog('Observing the sky.');
			}
		}
	}

	gamePage.timer.addEvent(dojo.hitch(this, function() {
    	automation.observeSky();
    	automation.sendHunters();
    	automation.minMaxCraft();
    	automation.minMaxPromotion();
    	automation.minMaxFaith();
	}), 3); // Once per 3 ticks

	violetLog('Automation initiliazed.');
}

if(window.automation === undefined) {
	automation_init();
}