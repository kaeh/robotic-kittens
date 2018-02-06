var violetLog = function(msg) {
    console.log('%cBip... ' + msg + ' Boop...', 'color: #C728FF;');
};
String.prototype.capitalizeEachWords = function()
{
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
var getResource = function(resourceName) {
    return gamePage.resPool.get(resourceName);
};
var isAlmostFilled = function(resource) {
    return resource.value / resource.maxValue > 0.95;
};
var craftAll = function(resourceName, craftName) {
    var resource = getResource(resourceName);
    if (isAlmostFilled(resource) && gamePage.workshop.getCraft(craftName).unlocked) {
        violetLog('Crafting ' + craftName);
        gamePage.craftAll(craftName);
    }
};
var getAutomationPref = function() {
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
        scaffold: {
            id: 'automatizeScaffold',
            optionLabel: 'Automatize Scaffold craft',
            value: false
        },
        tradeShip: {
            id: 'automatizeTradeShip',
            optionLabel: 'Automatize Trade ship craft',
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
        gear: {
            id: 'automatizeGear',
            optionLabel: 'Automatize gear craft',
            value: false
        },
        plate: {
            id: 'automatizePlate',
            optionLabel: 'Automatize plate craft',
            value: false
        },
        alloy: {
            id: 'automatizeAlloy',
            optionLabel: 'Automatize alloy craft',
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
        },

        buildings: {
            ids: [],
            displayed: '',
            hide: true
        }
    };
};
var saveAutomationPref = function() {
    window.localStorage.setItem('roboticKittensAutomation', JSON.stringify(roboticKittens.automatize));
    violetLog('Robotic Kittens options saved.');
};
var currentTabIsBonfire = function() {
    return gamePage.tabs[0].domNode.classList.toString().indexOf('activeTab') >= 0;
};

function roboticKittensInit() {
    window.roboticKittens = {
        automatize: getAutomationPref(),

        sendHunters: function() {
            var catpower = getResource('manpower');
            if (roboticKittens.automatize.hunt.value && isAlmostFilled(catpower)) {
                violetLog('Sending hunters.');
                $('a:contains("Send hunters")').click();
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
            // Scaffold craft
            if (roboticKittens.automatize.scaffold.value) { gamePage.craftAll('scaffold'); }
            if (roboticKittens.automatize.tradeShip.value) { gamePage.craftAll('ship'); }
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
            if (roboticKittens.automatize.gear.value) { gamePage.craftAll('gear'); }
            if (roboticKittens.automatize.alloy.value) { gamePage.craftAll('alloy'); }
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
        autoBuild: function() {
            // Only click if there is buildings to autobuild and building is available.
            if (currentTabIsBonfire() && roboticKittens.automatize.buildings.ids.length > 0) {
                roboticKittens.automatize.buildings.ids.forEach(function(building) {
                    var $selector = $('div.btn:not(.disabled)>div.btnContent:contains(' + building + ')');
                    if ($selector.length > 0) {
                        violetLog('Auto building ' + building);
                        $selector.click();
                    }
                });
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
                if (automation.hide) {
                    return;
                }

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
            // Add Auto Builder
            $(roboticKittensOptsPopin).append('<h5>Auto Builder</h5>');
            var autoBuilderInput = document.createElement('textarea');
            autoBuilderInput.setAttribute('id', 'autoBuilderInput');
            autoBuilderInput.value = roboticKittens.automatize.buildings.displayed;
            $(autoBuilderInput).change(function onAutoBuilderChange() {
                // Sanitize input and save building to auto-build
                var acceptedValues = gamePage.bld.buildingsData.map(value => value.label ? value.label.capitalizeEachWords() : value.name.capitalizeEachWords());
                // Intersect accepted values (from bonfire datas) and inputed values
                var sanitizedValues = [...new Set(this.value.split(';').map(x => x.trim().capitalizeEachWords()))].filter(x => new Set(acceptedValues).has(x));
                // Save object
                roboticKittens.automatize.buildings.ids = sanitizedValues;
                roboticKittens.automatize.buildings.displayed = sanitizedValues.join('; ');
                // Reset input value with sanitized input
                this.value = roboticKittens.automatize.buildings.displayed;
                // Save preferences
                saveAutomationPref();
            });
            $(roboticKittensOptsPopin).append(autoBuilderInput);
        }
    };

    setInterval(function() {
        // Auto gathering
        if (roboticKittens.automatize.catnip.value) {
            gamePage.bld.gatherCatnip();
        }
    }, 1); // Once per 1 second

    gamePage.timer.addEvent(dojo.hitch(this, function() {
        roboticKittens.observeSky();
    }), 3); // Once per 3 ticks (1 second)

    gamePage.timer.addEvent(dojo.hitch(this, function() {
        roboticKittens.sendHunters();
        roboticKittens.autoBuild();
        roboticKittens.minMaxCraft();
    }), 6); // Once per 6 ticks (2 seconds)

    gamePage.timer.addEvent(dojo.hitch(this, function() {
        roboticKittens.minMaxPromotion();
        roboticKittens.minMaxFaith();
    }), 60); // Once per 60 ticks (20 seconds)

    // Construct HTML options
    roboticKittens.constructOptionsHtml();

    violetLog('Robotic Kittens initiliazed.');
}

if (window.roboticKittens === undefined) {
    roboticKittensInit();
}
