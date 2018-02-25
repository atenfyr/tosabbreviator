/*
	tosabbreviator
	Written by Atenfyr
*/

const fs = require('fs-extra');
const url = require('url');
const path = require('path');
const xml2js = require('xml2js');
const prompt = require('prompt-sync')();
const jf = require('jsonfile');
const Log = require('log');
const request = require('request');
const openurl = require('openurl');

let homedir = require('os').homedir();

if (!fs.existsSync(homedir + '/tosabbreviator')) {
    fs.mkdirSync(homedir + '/tosabbreviator');
}

homedir = homedir + '/tosabbreviator/';

if (!fs.existsSync(homedir + 'main.config')) {
	fs.writeFileSync(homedir + 'main.config', '{}');
}

let config = JSON.parse(fs.readFileSync(homedir + 'main.config'));

let version = 'v3.2.0';
let writtenFor = 8597;
let waitingForKey, ynPrompt, disabled, pathError, hasCrashed, developmentKey = false;

let defaultlink = "C:/Program Files (x86)/Steam/steamapps/common/Town of Salem/XMLData/Localization/en-US/";
let savelink = defaultlink;

// i am well aware that i should put all of this in another file, but it has to be compilable using nexe
let changes = { // Case sensitive
	"Investigator":"Invest",
	"Lookout":"LO",
	"Psychic":"Psy",
	"Vampire Hunter":"VH",
	"Veteran":"Vet",
	"Vigilante":"Vig",
	"Bodyguard":"BG",
	"Doctor":"Doc",
	"Medium":"Med",
	"Retributionist":"Retri",
	"Transporter":"Trans",
	"Disguiser":"Disg",
	"Hypnotist":"Hypno",
	"Godfather":"GF",
	"Blackmailer":"BMer",
	"Consigliere":"Consig",
	"Amnesiac":"Amne",
	"Guardian Angel":"GA",
	"Survivor":"Surv",
	"Plaguebearer":"PB",
	"Vampire":"Vamp",
	"Executioner":"Exe",
	"Arsonist":"Arso",
	"Juggernaut":"Jugg",
	"a Serial Killer":"an SK",
	"Serial Killer":"SK",
	"Werewolf":"WW",
	"Coven Leader":"CL",
	"Necromancer":"Necro",
	"Potion Master":"PM",
	"Jester":"Jest",
	"Hex Master":"HM",
	"investigator":"invest",
	"lookout":"lo",
	"psychic":"psy",
	"vampire hunter":"vh",
	"veteran":"vet",
	"vigilante":"vig",
	"bodyguard":"bg",
	"doctor":"doc",
	"medium":"med",
	"retributionist":"retri",
	"transporter":"trans",
	"disguiser":"disg",
	"hypnotist":"hypno",
	"godfather":"gf",
	"blackmailer":"bmer",
	"consigliere":"consig",
	"amnesiac":"amne",
	"guardian angel":"ga",
	"survivor":"surv",
	"plaguebearer":"pb",
	"vampire":"vamp",
	"executioner":"exe",
	"arsonist":"arso",
	"juggernaut":"jugg",
	"a serial killer":"an sk",
	"serial killer":"sk",
	"werewolf":"ww",
	"coven leader":"cl",
	"necromancer":"necro",
	"potion master":"pm",
	"jester":"jest",
	"hex master":"hm",
	"An Amne": "An amne",
	"An Arso": "An arso",
	"Your target's defense was too strong to kill": "Your target was immune",
	"town member": "townie",
	"Pestilence, Horseman of the Apocalypse": "Pestilence",
	"Blackmailed": "BM'd",
	"blackmailed": "bm'd",
	"Blackmail": "BM",
	"blackmail": "bm",
	"a LO": "an LO",
	"Role blocked": "RB'd",
	"role blocked": "rb'd",
	"role block": "rb",
	"Role block": "RB",
	"BG/GF": "bg/gf",
	"You are immune": "You were immune",
    "you are immune": "you were immune",
    "Ye": "You",
    "Yer": "Your",
    "ye": "you",
    "yer": "your",
    "th'": "the",
}
let changes2 = { // Not case sensitive
	"not suspicious":"ns/gf",
	"is a member of the Mafia": "is in the Mafia",
	"a member of the Mafia": "the Mafia",
	"a member of the %role%": "the %role%",
	"nursed you back to health": "healed you",
	"nursed them back to health": "healed them",
	"someone fought off your attacker": "a BG protected you",
    "someone fought off their attacker": "a BG protected them",
    "someone protected you": "a Crusader protected you",
    "someone protected them": "a Crusader protected them",
	"their defense was too strong": "they were immune",
	"your defense was too strong": "you were immune",
	" you can feel your heart breaking.": "",
	" you will die tomorrow unless you are cured.": " You will die tomorrow, if not cured.",
	" they will die tomorrow unless cured.": "",
	"You feel a mystical power dominating you. ": "",
	"Someone threatened to reveal your secrets. You are bm'd": "You were bm'd",
	" You committed suicide over the guilt.": "",
	"Someone occupied your night. ": "",
	"hauled off to jail": "jailed",
	" in gasoline": "",
	" in gas": "",
	"gasoline": "gas",
	" to another location": "",
	"bulletproof vest": "vest",
	"the Jest": "a Jest",
	"!": "."
}
let investResults = {
	"Escort": "Escort/Trans/Consort (Hypno)",
	"Transporter": "Escort/Trans/Consort (Hypno)",
	"Consort": "Escort/Trans/Consort (Hypno)",
	"Hypnotist": "Escort/Trans/Consort/Hypno",
	"Doctor": "Doc/Disg/SK (PM)",
	"Disguiser": "Doc/Disg/SK (PM)",
	"SerialKiller": "Doc/Disg/SK (PM)",
	"PotionMaster": "Doc/Disg/SK/PM",
	"Investigator": "Invest/Consig/Mayor (Tracker/PB)",
	"Consigliere": "Invest/Consig/Mayor (Tracker/PB)",
	"Mayor": "Invest/Consig/Mayor (Tracker/PB)",
	"Tracker": "Invest/Consig/Mayor/Tracker/PB",
	"Plaguebearer": "Invest/Consig/Mayor/Tracker/PB",
	"Pestilence": "Invest/Consig/Mayor/Tracker/PB",
	"Bodyguard": "BG/GF/Arso (Crusader)",
	"Godfather": "BG/GF/Arso (Crusader)",
	"Arsonist": "BG/GF/Arso (Crusader)",
	"Crusader": "BG/GF/Arso/Crusader",
	"Vigilante": "Vig/Vet/Mafioso (Pirate/Ambusher)",
	"Veteran": "Vig/Vet/Mafioso (Pirate/Ambusher)",
	"Mafioso": "Vig/Vet/Mafioso (Pirate/Ambusher)",
	"Pirate": "Vig/Vet/Mafioso/Pirate/Ambusher",
	"Ambusher": "Vig/Vet/Mafioso/Pirate/Ambusher",
	"Medium": "Med/Janitor/Retri (Necro/Trapper)",
	"Janitor": "Med/Janitor/Retri (Necro/Trapper)",
	"Retributionist": "Med/Janitor/Retri (Necro/Trapper)",
	"Necromancer": "Med/Janitor/Retri/Necro/Trapper",
	"Trapper": "Med/Janitor/Retri/Necro/Trapper",
	"Survivor": "Surv/VH/Amne (Medusa/Psy)",
	"VampireHunter": "Surv/VH/Amne (Medusa/Psy)",
	"Amnesiac": "Surv/VH/Amne (Medusa/Psy)",
	"Medusa": "Surv/VH/Amne/Medusa/Psy",
	"Psychic": "Surv/VH/Amne/Medusa/Psy",
	"Spy": "Spy/BMer/Jailor (GA)",
	"Blackmailer": "Spy/BMer/Jailor (GA)",
	"Jailor": "Spy/BMer/Jailor (GA)",
	"GuardianAngel": "Spy/BMer/Jailor/GA",
	"Sheriff": "Sheriff/Exe/WW (Poisoner)",
	"Executioner": "Sheriff/Exe/WW (Poisoner)",
	"Werewolf": "Sheriff/Exe/WW (Poisoner)",
	"Poisoner": "Sheriff/Exe/WW/Poisoner",
	"Framer": "Framer/Vamp/Jest (HM)",
	"Vampire": "Framer/Vamp/Jest (HM)",
	"Jester": "Framer/Vamp/Jest (HM)",
	"HexMaster": "Framer/Vamp/Jest/HM",
	"Lookout": "LO/Forger/Witch (CL)",
	"Forger": "LO/Forger/Witch (CL)",
	"Witch": "LO/Forger/Witch",
	"CovenLeader": "LO/Forger/CL",
	"Juggernaut": "No Investigator Result"
}
let abbreviations = {
	"Escort": "N/A",
	"Transporter": "Trans",
	"Consort": "N/A",
	"Hypnotist": "Hypno",
	"Doctor": "Doc",
	"Disguiser": "Disg",
	"SerialKiller": "SK",
	"PotionMaster": "PM",
	"Investigator": "Invest",
	"Consigliere": "Consig",
	"Mayor": "N/A",
	"Tracker": "N/A",
	"Plaguebearer": "PB",
	"Pestilence": "Pest",
	"Bodyguard": "BG",
	"Godfather": "GF",
	"Arsonist": "Arso",
	"Crusader": "N/A",
	"Vigilante": "Vig",
	"Veteran": "Vet",
	"Mafioso": "Maf/mafi (ambiguous)",
	"Pirate": "N/A",
	"Ambusher": "N/A",
	"Medium": "Med",
	"Janitor": "Jan",
	"Retributionist": "Retri",
	"Necromancer": "Necro",
	"Trapper": "N/A",
	"Survivor": "Surv",
	"VampireHunter": "VH",
	"Amnesiac": "Amne",
	"Medusa": "N/A",
	"Psychic": "Psy",
	"Spy": "N/A",
	"Blackmailer": "BMer",
	"Jailor": "N/A",
	"GuardianAngel": "GA",
	"Sheriff": "N/A",
	"Executioner": "Exe",
	"Werewolf": "WW",
	"Poisoner": "N/A",
	"Framer": "N/A",
	"Vampire": "Vamp",
	"Jester": "Jest",
	"HexMaster": "HM",
	"Lookout": "LO",
	"Forger": "N/A",
	"Witch": "N/A",
	"CovenLeader": "CL",
	"Juggernaut": "Jugg"
}
let uniques = {
	"Jailor": true,
	"Mayor": true,
	"Retributionist": true,
	"Veteran": true,
	"Godfather": true,
	"Mafioso": true,
	"Ambusher": true,
	"Juggernaut": true,
	"Plaguebearer": true,
	"Pestilence": true,
	"Pirate": true,
	"Werewolf": true,
	"CovenLeader": true,
	"Necromancer": true,
	"Medusa": true,
	"PotionMaster": true,
	"Poisoner": true,
	"HexMaster": true
}
let priority = {
	"Escort": "2",
	"Transporter": "1",
	"Consort": "2",
	"Hypnotist": "3",
	"Doctor": "1",
	"Disguiser": "5",
	"SerialKiller": "5",
	"PotionMaster": "Unknown",
	"Investigator": "4",
	"Consigliere": "3",
	"Mayor": "N/A",
	"Tracker": "Unknown",
	"Plaguebearer": "5",
	"Pestilence": "5",
	"Bodyguard": "3",
	"Godfather": "3 (command mafioso) or 5 (attack target)",
	"Arsonist": "5",
	"Crusader": "3",
	"Vigilante": "5",
	"Veteran": "1",
	"Mafioso": "5",
	"Pirate": "1",
	"Ambusher": "1",
	"Medium": "1 (seance)",
	"Janitor": "3",
	"Retributionist": "3",
	"Necromancer": "2",
	"Trapper": "1",
	"Survivor": "3",
	"VampireHunter": "5",
	"Amnesiac": "6",
	"Medusa": "Unknown",
	"Psychic": "Unknown",
	"Spy": "6",
	"Blackmailer": "3",
	"Jailor": "5",
	"GuardianAngel": "Unknown",
	"Sheriff": "4",
	"Executioner": "N/A",
	"Werewolf": "5",
	"Poisoner": "Unknown",
	"Framer": "3",
	"Vampire": "5",
	"Jester": "5 (haunt)",
	"HexMaster": "3",
	"Lookout": "4",
	"Forger": "3",
	"Witch": "2",
	"CovenLeader": "2",
	"Juggernaut": "5"
}
let traits = {
	"Escort": ["RB Immunity"],
	"Transporter": ["RB Immunity", "Control Immunity"],
	"Consort": ["RB Immunity"],
	"Hypnotist": [],
	"Doctor": [],
	"Disguiser": [],
	"SerialKiller": ["Kills RBer when RB'd"],
	"PotionMaster": [],
	"Investigator": [],
	"Consigliere": [],
	"Mayor": [],
	"Tracker": ["Ignores Detection Immunity"],
	"Plaguebearer": ["Detection Immunity"],
	"Pestilence": ["RB Immunity", "Detection Immunity"],
	"Bodyguard": [],
	"Godfather": ["Detection Immunity"],
	"Arsonist": ["Detection Immunity"],
	"Crusader": [],
	"Vigilante": [],
	"Veteran": ["RB Immunity on alert", "Control Immunity"],
	"Mafioso": [],
	"Pirate": ["RB Immunity", "Detection Immunity"],
	"Ambusher": ["RB Immunity"],
	"Medium": [],
	"Janitor": [],
	"Retributionist": [],
	"Necromancer": ["RB Immunity"],
	"Trapper": ["RB Immunity", "Ignores Detection Immunity"],
	"Survivor": [],
	"VampireHunter": [],
	"Amnesiac": [],
	"Medusa": [],
	"Psychic": [],
	"Spy": [],
	"Blackmailer": [],
	"Jailor": [],
	"GuardianAngel": [],
	"Sheriff": [],
	"Executioner": ["Detection Immunity"],
	"Werewolf": ["Kills RBer when RB'd", "Detection Immunity on non-Full Moon nights"],
	"Poisoner": [],
	"Framer": [],
	"Vampire": ["Detection Immunity"],
	"Jester": ["Detection Immunity"],
	"HexMaster": [],
	"Lookout": ["Ignores Detection Immunity"],
	"Forger": [],
	"Witch": ["RB Immunity", "Detection Immunity"],
	"CovenLeader": ["RB Immunity"],
	"Juggernaut": ["Detection Immunity"]
}
let guichanges = {
	"Innocent": "inno",
	"JanitorKnowsRole": "Your target's role was",
	"JanitorKnowsRoleX": "Your target's role was %role%.",
	"ExecutionerConvertedToJester": "Your target has died.",
	"JanitorKnowsWill1": "Check the Graveyard to see your target's last will.",
	"JanitorKnowsWill2": "",
	"JailorCantKillAgain": "You can no longer execute.",
	"LobbyMediumDescription": "A secret psychic who talks with the dead.",
	"RoleSelectedDesc_7": "You are a secret psychic who talks with the dead.",
	"TheyVisitedYourTarget": "Target visited by %name%",
	"RoleCardAbility": "Results",
	"RoleCardAbilities": "Results",
	"RoleCardAttributes": "Info",
	"RoleCardAttribute": "Info",
	"UILanguageLabel": "Language",
	"SpyNightAbilityMessageMafia": "Mafia visits: %name%",
	"SpyNightAbilityMessageCoven": "Coven visits: %name%",
	"AmnesiacRememberedRoleX": "An amne has turned into a %role%.",
	"Youngest": "New",
	"XVotesAreNeeded": "Votes needed: %number%",
	"XVotesNeeded": "Votes needed: %number%",
	"DoYouHaveLastWords": "Any last words?",
	"TownPutThemOnTrial": "%name% has been put on trial.",
	"TownMayVoteOnThem": "You may now vote on %name%'s fate.",
	"TownDecidedToLynchThem": "%name% will be lynched by a vote of %x% to %y%.",
	"TownDecidedToPardonThem": "%name% has been pardoned by a vote of %x% to %y%.",
	"TrialsRemainingPlural": "%number% possible trials left.",
	"TrialsRemainingSingle": "1 possible trial left.",
	"TrackerFeedback1": "Target visited %name%",
	"LoverTarget": "%name% is your lover.",
	"RivalTarget": "%name% is your rival.",
	"WeAreVIP": "You are the VIP.",
	"VIPTarget": "%name% is the VIP.",
	"Vampire Wins": "Vamps Win",
	"The Coven Wins": "Coven Wins",
	"JuggernautFeedback1": "You can now attack every night.",
	"JuggernautFeedback2": "You now have Basic defense.",
	"JuggernautFeedback3": "You can now Rampage.",
    "JuggernautFeedback4": "You now have Unstoppable attack.",
    "PirateChooseAttackHeader": "Choose your attack:",
    "PirateChooseDefendHeader": "Choose your defence:",
    "PirateDefend1Notice": "You will try to sidestep.",
    "PirateDefend2Notice": "You will try to backpetal.",
    "PirateDefend3Notice": "You will try to use chainmail.",
    "PirateDuelResultsA21": "You used the scimitar, and your target tried to sidestep. You won.",
    "PirateDuelResultsA23": "You used the scimitar, and your target used chainmail. You lost.",
    "PirateDuelResultsA22": "You used the scimitar, and your target backpedaled. You lost.",
    "PirateDuelResultsA11": "You used the rapier, and your target sidestepped. You lost.",
    "PirateDuelResultsA13": "You used the rapier, and your target used chainmail. You won.",
    "PirateDuelResultsA12": "You used the rapier, and your target backpedaled. You lost.",
    "PirateDuelResultsA31": "You used the pistol, and your target sidestepped. You lost.",
    "PirateDuelResultsA33": "You used the pistol, and your target used chainmail. You lost.",
    "PirateDuelResultsA32": "You used the pistol, and your target backpedaled. You won.",
    "PirateDuelResultsD21": "You tried to sidestep, and the pirate used the scimitar. You lost.",
    "PirateDuelResultsD23": "You used chainmail, and the pirate used the scimitar. You won.",
    "PirateDuelResultsD22": "You backpedaled, and the pirate used the scimitar. You won.",
    "PirateDuelResultsD11": "You sidestepped, and the pirate used the rapier. You won.",
    "PirateDuelResultsD13": "You used chainmail, and the pirate used the rapier. You lost.",
    "PirateDuelResultsD12": "You backpedaled, and the pirate used the rapier. You won.",
    "PirateDuelResultsD31": "You sidestepped, and the pirate used the pistol. You won.",
    "PirateDuelResultsD33": "You used chainmail, and the pirate used the pistol. You won.",
    "PirateDuelResultsD32": "You backpedaled, and the pirate used the pistol. You lost.",
}
let forcechanges = {
	"0": "Result: Mafia",
	"1": "Result: ns/gf",
	"2": "Result: Cult",
	"3": "Result: SK",
	"24": "You were killed by the SK you visited.",
	"29": "Result: Jugg",
	"37": "Results: Framer/Vamp/Jest (possibly framed)",
	"88": "You shot yourself.",
	"98": "You just lynched a Jest.",
	"102": "Result: WW",
	"104": "You can attack tonight.",
	"126": "You were attacked by the CL.",
	"145": "Not enough good roles alive to have a vision tonight.",
	"146": "Not enough people alive to have a vision tonight.",
	"168": "Result: Coven",
	"169": "You cannot resurrect this role.",
    "170": "You cannot remember a unique role.",
    "178": "You attacked the pirate who tried to rb you.",
	"Coven31": "Results: Vig/Vet/Mafioso/Pirate/Ambusher",
	"Coven32": "Results: Med/Janitor/Retri/Necro/Trapper",
	"Coven33": "Results: Surv/VH/Medusa/Psy",
	"Coven37": "Results: Framer/Vamp/Jest/HM (possibly framed)"
}
let forceDangerous = [
	107, 108
];

let dangerwords = ["haunt", "triggered", "poison", "consume", "control", "lynch", "staked", "die", "shot", "shoot", "douse", "fire", "murder", "attack", "kill", "execute", "suicide", "guilt", "bm", "rb", "immune", "transport"];

let doneCount = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function displayHeader() {
	console.log('---tosabbreviator ' + version + '---');
	console.log('----Written by Atenfyr----\n');
}
function waitForKey(terminating) {
	waitingForKey = false;
	if (terminating) {
		console.log('\nPress any key to exit.');

		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.on('data', process.exit.bind(process, 0));
	} else {
		console.log('\nPress any key to continue.');
		doneCount = 0;
		waitingForKey = true;
	}
}

function revertConv() {
	if (!fs.existsSync(savelink + 'Game.BACKUP') && !fs.existsSync(savelink + 'Gui.BACKUP') && !fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
		console.log('Backup files are not present. You can do this in Steam; right-click Town of Salem\nin your games menu, click "Properties," click on the tab "Local Files," and click "Verify Integrity of Game Files."');
	} else {
		disabled = true;
		console.log("Restoring backups..");
		if (fs.existsSync(savelink + 'Game.BACKUP')) {
			fs.unlinkSync(savelink + 'Game.xml');
			fs.copySync(path.resolve(__dirname, (savelink + 'Game.BACKUP')), savelink + 'Game.xml');
			fs.unlinkSync(savelink + 'Game.BACKUP');
		}
		console.log("1 out of 3 files completed.");

		if (fs.existsSync(savelink + 'Gui.BACKUP')) {
			fs.unlinkSync(savelink + 'Gui.xml');
			fs.copySync(path.resolve(__dirname, (savelink + 'Gui.BACKUP')), savelink + 'Gui.xml');
			fs.unlinkSync(savelink + 'Gui.BACKUP');
		}
		console.log("2 out of 3 files completed.");

		if (fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
			fs.unlinkSync(savelink + '../GameLanguage.xml');
			fs.copySync(path.resolve(__dirname, (savelink + '../GameLanguage.BACKUP')), savelink + '../GameLanguage.xml');
			fs.unlinkSync(savelink + '../GameLanguage.BACKUP');
		}
		console.log("3 out of 3 files completed.");
		console.log('Successfully restored all backups.');
		disabled = false;
	}
}
function doConversion() {
	disabled = true;
	if (!fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
		console.log("Backing up files..");
		fs.copySync(path.resolve(__dirname, (savelink + 'Game.xml')), savelink + 'Game.BACKUP');
		console.log("1 out of 3 files completed.");
		fs.copySync(path.resolve(__dirname, (savelink + 'Gui.xml')), savelink + 'Gui.BACKUP');
		console.log("2 out of 3 files completed.");
		fs.copySync(path.resolve(__dirname, (savelink + '../GameLanguage.xml')), savelink + '../GameLanguage.BACKUP');
		console.log("3 out of 3 files completed.");
		console.log("Finished backing up files.\n");
	}
	newLogDir = new Date().toISOString().replace(/\./g, '-').replace(/\:/g, '-') + '.log';
	log = new Log('info', fs.createWriteStream(homedir + newLogDir, 'utf8'));
	log.info('Beginning conversion of game files.');

	console.log("Beginning conversion.");
	lower(savelink + 'Game.BACKUP');
	lower(savelink + 'Gui.BACKUP');
	lower(savelink + '../GameLanguage.BACKUP');
}
function doVersionCheck(cb) {
	let latestN = 0;
	fs.readFile(savelink + '\\PatchNotes\\PatchNotes.xml', function(err, data) {
		let dsplit = data.toString().split("\n");
		for (var i in dsplit) {
			if (dsplit[i].indexOf("<Version>") != -1) {
                latestN = Number(dsplit[i].replace(/[\D]/g, ""));
                latestN2 = config['latestversion'] || version;
                jf.writeFileSync(homedir + 'main.config', config);
				if (cb) {
					return cb(latestN, latestN2);
				} else {
                    console.log('Latest tosabbreviator version: ' + latestN2);
                    console.log('Installed tosabbreviator version: ' + version);
					console.log('\nInstalled Town of Salem version: ' + latestN);
					console.log('Supported Town of Salem version: ' + writtenFor + '\n');
					if (latestN2 == version && latestN > writtenFor) {
                        console.log('You have the latest version of tosabbreviator, but tosabbreviator has not been updated yet. If you have reviewed the patch notes and have not noticed any major change that would disrupt gameplay, you may continue using this version.');
                    } else if (latestN2 != version && writtenFor > latestN) {
                        console.log('Both your version of tosabbreviator and your version of Town of Salem are outdated. Press the "F" key on the homepage to update tosabbreviator.');
                    } else if (latestN2 != version) {
                        console.log('Your version of tosabbreviator is outdated. Press the "F" key on the homepage to update tosabbreviator.');
                    } else if (writtenFor > latestN) {
                        console.log('Your version of Town of Salem is outdated.');
                    } else {
                        console.log('You\'re good to go!');
                    }
					waitForKey();
				}
			}
		}
	});
}
function getPath(menu) {
	if (menu) {
		disabled = true;
		console.clear();
		displayHeader();
	}

	let pathprefix = prompt('Steam Path (press enter for default) (e.g. C:\\Program Files (x86)\\Steam): ');
	if (pathprefix) {
		let lastchar = pathprefix.substring(pathprefix.length-1,pathprefix.length);
		if (lastchar == "\\" || lastchar == "/") {
			pathprefix = pathprefix.substring(0,pathprefix.length-1);
		}
		savelink = pathprefix + '/steamapps/common/Town of Salem/XMLData/Localization/en-US/';
		if (!(fs.existsSync(savelink))) {
			console.clear();
			displayHeader();

			console.log('Failed to find Town of Salem for Steam in that directory.');
			if (!menu) {
				waitForKey(true);
				pathError = true;
				disabled = true;
			}
		} else {
			config['steampath'] = pathprefix;
			process.stdout.write('\nSuccessfully changed Steam path.');
		}
	} else {
		if (!(fs.existsSync(defaultlink))) {
			console.clear();
			displayHeader();

			if (!menu) {
				console.log('The default path does not exist on this system. Please re-run this program and type in your Steam path.');
				waitForKey(true);
				pathError = true;
				disabled = true;
			} else {
				console.log('The default path does not exist on this system.');
			}
		} else {
			config['steampath'] = 'default';
			process.stdout.write('\nSuccessfully changed Steam path.');
		}
	}
	jf.writeFileSync(homedir + 'main.config', config);

	if (menu) {
		disabled = false;
		waitForKey(false);
	}
}

var parser = new xml2js.Parser();
function lower(pp) {
	var fn = path.parse(pp)["base"];
	fs.readFile(pp, function(err, data) {
		try {
			if (hasCrashed) { return; }
			parser.parseString(data, function (err, result) {
				if (fn == "Game.BACKUP") {
					for (var i in result["Entries"]["Entry"]) {
						if (forcechanges[result["Entries"]["Entry"][i]["id"][0]]) {
							log.info('Overriding data for entry %s in Game.xml', result["Entries"]["Entry"][i]["id"][0]);
							result["Entries"]["Entry"][i]["Text"][0] = forcechanges[result["Entries"]["Entry"][i]["id"][0]];
							if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Result: ") != -1) || (result["Entries"]["Entry"][i]["Text"][0].indexOf("Results: ") != -1)) {
								result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";
							}
						} else if (result["Entries"]["Entry"][i]["id"][0].substring(0,10) == "SpyResult_") {
							log.info('Writing spy result for entry %s in Game.xml', result["Entries"]["Entry"][i]["id"][0]);
							var id = result["Entries"]["Entry"][i]["id"][0].substring(10);
							for (var j in result["Entries"]["Entry"]) {
								if (result["Entries"]["Entry"][j]["id"][0] == id) {
									id = j;
									break;
								}
							}
							result["Entries"]["Entry"][i]["Text"][0] = "On target: " + result["Entries"]["Entry"][id]["Text"][0].replace(/On target\: /g, "");
							result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";
						} else if (result["Entries"]["Entry"][i]["Text"]) {
							for (var j in changes) {
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "g"), changes[j]);
							}
							for (var j in changes2) {
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "gi"), changes2[j]);
							}
							if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Your target") !== -1) && (result["Entries"]["Entry"][i]["Text"][0].indexOf("They must be") !== -1)) {
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(/.+(\They must be a )/g, "Result: ").replace(/.+(\They must be an )/g, "Result: ").replace(/.+(\They must be the )/g, "Result: ").replace(/.+(\They must be )/g, "Result: ");
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].slice(0, -1);
								result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";

								let abbreviatedRole = result["Entries"]["Entry"][i]["Text"][0].replace("Result: ", "").trim();
								let nonAbbreviatedRole = abbreviatedRole;
								for (var j in abbreviations) {
									if (abbreviations[j].toLowerCase() == abbreviatedRole.toLowerCase()) {
										nonAbbreviatedRole = j;
										break;
									}
								}

								nonAbbreviatedRole = nonAbbreviatedRole.replace(/\s/g, '');
								log.info('Adding fake invest results for consig/witch results on %s', nonAbbreviatedRole);
								if (!investResults[nonAbbreviatedRole]) {
									log.warning('Could not find invest results for role ' + nonAbbreviatedRole);
								}
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0] + ' (' + (investResults[nonAbbreviatedRole] || "Error!").replace(/\(/g, '[').replace(/\)/g, ']') + ')';
							} else if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Your target could be a") != -1)) {
								log.info('Abbreviating invest results for ID %s in Game.xml', result["Entries"]["Entry"][i]["id"][0]);
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace("Your target could be a ", "Results: ").replace("Your target could be an ", "Results: ").replace(/\, /g, "/").replace(/or /g, "");
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].slice(0, -1);
								result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";
							}
						}
												
						/*
						0xFFFF00 (Red) = Dangerous
						0x00FF00 (Green) = Healing
						0x549BF2 (Light Blue) = Investigative result
						0x808080 (Grey) = Other
						*/
						if (result["Entries"]["Entry"][i]["Color"] && result["Entries"]["Entry"][i]["id"][0] != "81" && result["Entries"]["Entry"][i]["id"][0] != "100") {
							if ((result["Entries"]["Entry"][i]["Color"][0] != "0x549BF2") && (result["Entries"]["Entry"][i]["Color"][0] != "0x00FF00")) {
								var text = result["Entries"]["Entry"][i]["Text"][0];
								var danger = false;
								for (var j in dangerwords) {
									if (text.toLowerCase().indexOf(dangerwords[j].toLowerCase()) !== -1) {
										result["Entries"]["Entry"][i]["Color"] = "0xFF0000";
										danger = true;
										break;
									}
								}
								
								if (forceDangerous.includes(Number(result["Entries"]["Entry"][i]["id"][0]))) {
									log.info('Flagging message %s as dangerous in Game.xml', result["Entries"]["Entry"][i]['Text'][0]);
									result["Entries"]["Entry"][i]["Color"] = "0xFF0000";
								} else if (!danger) {
									log.info('Flagging message %s as mundane in Game.xml', result["Entries"]["Entry"][i]['Text'][0]);
									result["Entries"]["Entry"][i]["Color"] = "0x808080";
								}
							}
							if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("healed") != -1) && result["Entries"]["Entry"][i]["Color"][0] != "0x549BF2") {
								log.info('Flagging message %s as healing in Game.xml', result["Entries"]["Entry"][i]['Text'][0]);
								result["Entries"]["Entry"][i]["Color"] = "0x00FF00";
							}
						}
					}
				} else if (fn == "Gui.BACKUP") {
					for (var i in result["Entries"]["Entry"]) {
						if (result["Entries"]["Entry"][i]["Text"] && result["Entries"]["Entry"][i]["id"]) {
							if (guichanges[result["Entries"]["Entry"][i]["id"]]) {
								log.info('Overriding data for entry %s in Gui.xml', result["Entries"]["Entry"][i]['id']);
								result["Entries"]["Entry"][i]["Text"][0] = guichanges[result["Entries"]["Entry"][i]["id"]];
							} else if (result["Entries"]["Entry"][i]["id"][0].substring(0,3) == "Tip") {
								log.info('Erasing data for tip %s', result["Entries"]["Entry"][i]["id"]);
								result["Entries"]["Entry"][i]["Text"][0] = " ";
							} else if ((result["Entries"]["Entry"][i]["id"][0].indexOf("RoleCardAbility") != -1)) {
								let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAbility", "").replace(/\d/g, '');
								log.info('Overriding investigator results for %s role card', role);
								if (!investResults[role]) {
									log.warning('Could not find invest results for role ' + role);
								}
								result["Entries"]["Entry"][i]["Text"][0] = investResults[role] || "Error!";
							} else if ((result["Entries"]["Entry"][i]["id"][0].indexOf("RoleCardAttribute") != -1)) {
								let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAttribute", "").replace(/\d/g, '');
								log.info('Overriding traits for %s role card', role);
								if (role == "Executioner") {
									result["Entries"]["Entry"][i]["Text"][0] = ("- Target: %name%\n- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniques[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!") + " (1 is highest possible)");
								} else {
									result["Entries"]["Entry"][i]["Text"][0] = ("- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniques[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!") + " (1 is highest possible)");
								}
								if (!abbreviations[role]) {
									log.warning('Could not find an abbreviation for role ' + role);
								}
								if (!priority[role]) {
									log.warning('Could not find a priority for role ' + role);
								}
								for (var j in traits[role]) {
									result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0] + "\n- " + traits[role][j];
								}
							} else {
								for (var j in changes) {
									result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "g"), changes[j]);
								}
								for (var j in changes2) {
									result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "gi"), changes2[j]);
								}
							}
						}
					}
				} else if (fn == "GameLanguage.BACKUP") {
					result["Entries"]["Entry"][1]["Text"][0] = "English (Abbr.)";
					result["Entries"]["Entry"][1]["Description"][0] = "English (Abbr.)";
					fn = "../" + fn;
					log.info('Overriding language name in GameLanguage.xml');
					//forceCrash();
				}
				var builder = new xml2js.Builder({"headless": true});
				var xml = builder.buildObject(result);
				fs.writeFile(savelink + (fn.replace('BACKUP', 'xml')), '<?xml version="1.0" encoding="utf-8"?>\n<!-- Parsed by tosabbreviator ' + version + ' -->\n' + xml, function() {
					doneCount++;
					if (!hasCrashed) {
						console.log(doneCount + ' out of 3 files completed.');
					}
					if (doneCount == 3) {
						console.log('Finished conversion.');
						disabled = false;
						waitForKey();
					}
				})
			});
		} catch(err) {
			log.error('Unexpected error: ' + err);
			console.clear();
			displayHeader();
			console.log('An unexpected error has occurred, and the conversion has halted.\n\nBeginning repair..');
			hasCrashed = true;
			disabled = false;
			if (fs.existsSync(savelink + 'Game.BACKUP')) {
				fs.unlinkSync(savelink + 'Game.BACKUP');
			}
			console.log('1 out of 3 files completed.');
			if (fs.existsSync(savelink + 'Gui.BACKUP')) {
				fs.unlinkSync(savelink + 'Gui.BACKUP');
			}
			console.log('2 out of 3 files completed.');
			if (fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
				fs.unlinkSync(savelink + '../GameLanguage.BACKUP');
			}
			console.log('3 out of 3 files completed.');
			console.log('Repair complete.\n\nPLEASE VERIFY THE INTEGRITY OF YOUR GAME FILES.\nTo do this, right-click Town of Salem in your Steam games menu, click "Properties," click on the tab "Local Files," and click "Verify Integrity of Game Files."');
		}
	});
}

console.clear();
displayHeader();

if (config['steampath']) {
	if (config['steampath'] != 'default') {
		savelink = config['steampath'] + '/steamapps/common/Town of Salem/XMLData/Localization/en-US/';
	}
} else {
	getPath();
}

if (!pathError) {
	console.clear();
    displayHeader();
    console.log("Keybinds:\n  c		convert files and exit this tool\n  v		compare version numbers\n  r		revert any conversions done\n  p		repair a broken installation\n  a		switch path\n  h             open latest release in browser\n  e		exit this tool");

	doVersionCheck(function(v) {
		if (config["latest"]) {
			if (v != config["latest"]) {
				console.log('\nNote: Town of Salem has updated. If possible, it is highly recommended to repair the installation by pressing "P" and to update your version of tosabbreviator.');
			}
		}
		config["latest"] = v;
		jf.writeFileSync(homedir + 'main.config', config);
    });

    if (!config['lastcheck']) {
        config['lastcheck'] = 0;
    }

    if ((Date.now()-config['lastcheck']) >= 1200000) {
        request.get({
            url: 'https://api.github.com/repos/atenfyr/tosabbreviator/releases/latest' + (developmentKey?("?access_token=" + developmentKey):""),
            headers: {'User-Agent': 'tosabbreviator ' + version},
            json: true
        }, function(error, response, body) {
            if (error || response['body']['message']) {
                console.log('\nNote: Failed to check latest tosabbreviator version.');
            } else {
                if (response['body']['tag_name'] !== version) {
                    config['downloadlink'] = response['body']['assets'][0]['browser_download_url'].replace('https://github.com/atenfyr/tosabbreviator/releases/download/', '');
                    console.log('\nNote: A new version of tosabbreviator is available. Press the "F" key to download it.');
                } else {
                    if (config['downloadlink']) {
                        delete config['downloadlink'];
                    }
                }
                config['latestversion'] = response['body']['tag_name'];
                config['lastcheck'] = Date.now();
                jf.writeFileSync(homedir + 'main.config', config);
            }
        });
    }
    if (config['downloadlink']) {
        console.log('\nNote: A new version of tosabbreviator is available. Press the "F" key to download it.');
    }
}

process.stdin.on('data', function(d) {
	if (hasCrashed) {
		process.exit(0);
	} else if (d && !disabled) {
		if (waitingForKey) {
			console.clear();
			displayHeader();
            console.log("Keybinds:\n  c		convert files and exit this tool\n  v		compare version numbers\n  r		revert any conversions done\n  p		repair a broken installation\n  a		switch path\n  h             open latest release in browser\n  e		exit this tool");
			waitingForKey = false;
		} else if (ynPrompt) {
			switch(d.toString().trim()) {
				case 'y':
					console.clear();
					displayHeader();
					console.log("Beginning repairs.");
					if (fs.existsSync(savelink + 'Game.BACKUP')) {
						fs.unlinkSync(savelink + 'Game.BACKUP');
						console.log("Removed Game.BACKUP.");	
					}
					if (fs.existsSync(savelink + 'Gui.BACKUP')) {
						fs.unlinkSync(savelink + 'Gui.BACKUP');
						console.log("Removed Gui.BACKUP.");
					}
					if (fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
						fs.unlinkSync(savelink + '../GameLanguage.BACKUP');
						console.log("Removed GameLanguage.BACKUP.");
					}
					if (fs.existsSync(savelink + 'Game.xml')) {
						fs.unlinkSync(savelink + 'Game.xml');
						console.log("Removed Game.xml.");
					}
					if (fs.existsSync(savelink + 'Gui.xml')) {
						fs.unlinkSync(savelink + 'Gui.xml');
						console.log("Removed Gui.xml.");
					}
					if (fs.existsSync(savelink + '../GameLanguage.xml')) {
						fs.unlinkSync(savelink + '../GameLanguage.xml');
						console.log("Removed GameLanguage.xml.");	
					}
					console.log('Finished repairs.');
					console.log('\nPLEASE VERIFY THE INTEGRITY OF YOUR GAME FILES.\nTo do this, right-click Town of Salem in your Steam games menu, click "Properties," click on the tab "Local Files," and click "Verify Integrity of Game Files."');
					ynPrompt = false;
					waitForKey();
					break;
				case 'n':
					console.clear();
					displayHeader();
					ynPrompt = false;
					waitForKey();
					break;
			}
		} else {
			switch(d.toString().trim()) {
				case 'c':
					console.clear();
					displayHeader();
					doConversion();
					break;
				case 'v':
					console.clear();
					displayHeader();
					doVersionCheck();
					break;
				case 'r':
					console.clear();
					displayHeader();
					revertConv();
					waitForKey();
					break;
				case 'p':
					console.clear();
					displayHeader();
					console.log('Are you sure you want to do this? This will wipe all conversions done! (y/n)');
					ynPrompt = true;
					break;
				case 'a':
					getPath(true);
                    break;
                case 'h':
                    openurl.open('https://github.com/atenfyr/tosabbreviator/releases/latest');
                    break;
                case 'l': // open logs
                    openurl.open("file://" + homedir);
                    break;
                case 'f': // download if available
                    if (config['downloadlink']) {
                        console.clear();
                        displayHeader();
                        console.log('Downloading..');

                        config['downloadlink'] = 'https://github.com/atenfyr/tosabbreviator/releases/download/' + config['downloadlink'];

                        let productionFilename = path.basename(url.parse(config['downloadlink']).pathname);                            
                        request(config['downloadlink']).pipe(fs.createWriteStream(productionFilename)).on('close', function() {
                            console.clear();
                            displayHeader();
                            console.log('Saved to ' + productionFilename);
                            waitForKey();
                        });
                        delete config['downloadlink'];
                        jf.writeFileSync(homedir + 'main.config', config);
                    }
                    break;
				case 'e':
					process.exit();
					break;
			}
		}
	}
});
process.stdin.setRawMode(true);
process.stdin.resume();