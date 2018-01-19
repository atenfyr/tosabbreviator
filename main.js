/*
	tosabbreviator
	Written by Atenfyr
*/

const fs = require('fs-extra');
const path = require('path');
const xml2js = require('xml2js');
const prompt = require('prompt-sync')();
const jf = require('jsonfile');

const homedir = require('os').homedir();

if (!fs.existsSync(homedir + '/.tosabbreviator')) {
	fs.writeFileSync(homedir + '/.tosabbreviator', '{}');
}

let config = JSON.parse(fs.readFileSync(homedir + '/.tosabbreviator'));

let version = '2.0.0';
let writtenFor = 8298;
let waitingForKey = false;
let ynPrompt = false;

let savelink = "C:/Program Files (x86)/Steam/steamapps/common/Town of Salem/XMLData/Localization/en-US/"

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
	"An Amne": "An amne",
	"An Arso": "An arso",
	"Your target's defense was too strong to kill": "Your target was immune",
	"The jester will get his revenge from the grave": "Good job, you lynched the Jester",
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
}
let changes2 = { // Not case sensitive
	"not suspicious":"ns/gf",
	"is a member of the Mafia": "is in the Mafia",
	"a member of the Mafia": "the Mafia",
	"a member of the %role%": "the %role%",
	"nursed you back to health": "healed you",
	"nursed them back to health": "healed them",
	"fought off your attacker": "protected you",
	"fought off their attacker": "protected them",
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
	"Framer": "Framer/Vamp/Jest (Hex Master)",
	"Vampire": "Framer/Vamp/Jest (Hex Master)",
	"Jester": "Framer/Vamp/Jest (Hex Master)",
	"HexMaster": "Framer/Vamp/Jest/Hex Master",
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
	"Mafioso": "N/A",
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
	"Jailor": "Jailor",
	"GuardianAngel": "GA",
	"Sheriff": "N/A",
	"Executioner": "Exe",
	"Werewolf": "WW",
	"Poisoner": "N/A",
	"Framer": "N/A",
	"Vampire": "Vamp",
	"Jester": "Jest",
	"HexMaster": "Hex",
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
	"Jester Wins": "Jest Wins",
	"JuggernautFeedback1": "You can now attack every night.",
	"JuggernautFeedback2": "You now have Basic defense.",
	"JuggernautFeedback3": "You can now Rampage.",
	"JuggernautFeedback4": "You now have Unstoppable attack.",
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
	"102": "Result: WW",
	"104": "You can attack tonight.",
	"126": "You were attacked by the CL.",
	"145": "Not enough good roles to have a vision.",
	"146": "Not enough people alive to have a vision.",
	"168": "Result: Coven",
	"169": "You cannot resurrect this role.",
	"170": "You cannot remember a unique role.", 
	"Coven31": "Results: Vig/Vet/Mafioso/Pirate/Ambusher",
	"Coven32": "Results: Med/Janitor/Retri/Necro/Trapper",
	"Coven33": "Results: Surv/VH/Medusa/Psy",
	"Coven37": "Results: Framer/Vamp/Jest/Hex Master (possibly framed)"
}
let forceDangerous = [
	107, 108
];

let dangerwords = ["haunt", "consume", "control", "lynch", "staked", "die", "shot", "douse", "fire", "murder", "attack", "kill", "execute", "suicide", "guilt", "bm", "rb", "immune", "transport"];

let doneCount = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function displayHeader() {
	console.log('---tosabbreviator v' + version + '---');
	console.log('----Written by Atenfyr----\n')
}
function waitForKey(cb) {
	console.log('\nPress any key to continue.');
	doneCount = 0;
	waitingForKey = true;
}

function revertConv() {
	if (!fs.existsSync(savelink + 'Game.BACKUP') || !fs.existsSync(savelink + 'Gui.BACKUP')) {
		console.log('Backup files are not present. You can do this in Steam; right-click Town of Salem\nin your games menu, click "Properties," click on the tab "Local Files," and click "Verify Integrity of Game Files."');
	} else {
		console.log("Restoring backups..");
		fs.unlinkSync(savelink + 'Game.xml');
		fs.copySync(path.resolve(__dirname, (savelink + 'Game.BACKUP')), savelink + 'Game.xml');
		fs.unlinkSync(savelink + 'Game.BACKUP');
		console.log("1 out of 3 files completed.");

		fs.unlinkSync(savelink + 'Gui.xml');
		fs.copySync(path.resolve(__dirname, (savelink + 'Gui.BACKUP')), savelink + 'Gui.xml');
		fs.unlinkSync(savelink + 'Gui.BACKUP');
		console.log("2 out of 3 files completed.");

		if (fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
			fs.unlinkSync(savelink + '../GameLanguage.xml');
			fs.copySync(path.resolve(__dirname, (savelink + '../GameLanguage.BACKUP')), savelink + '../GameLanguage.xml');
			fs.unlinkSync(savelink + '../GameLanguage.BACKUP');
		}
		console.log("3 out of 3 files completed.");
		console.log('Successfully restored all backups.');
	}
}
function doConversion() {
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
				if (cb) {
					return cb(latestN)
				} else {
					console.log("Installed: " + latestN);
					console.log("Updated as of: " + writtenFor);
					if (latestN > writtenFor) {
						console.log("This tool is outdated. If possible, fetch the latest one.");
					} else if (writtenFor > latestN) {
						console.log("Your Town of Salem version is outdated.");
					} else {
						console.log("You're good to go!");
					}
					waitForKey();
				}
			}
		}
	});
}


var parser = new xml2js.Parser();
function lower(pp) {
	var fn = path.parse(pp)["base"];
	fs.readFile(pp, function(err, data) {
		parser.parseString(data, function (err, result) {
			if (fn == "Game.BACKUP") {
				for (var i in result["Entries"]["Entry"]) {
					if (forcechanges[result["Entries"]["Entry"][i]["id"][0]]) {
						result["Entries"]["Entry"][i]["Text"][0] = forcechanges[result["Entries"]["Entry"][i]["id"][0]];
						if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Result: ") != -1) || (result["Entries"]["Entry"][i]["Text"][0].indexOf("Results: ") != -1)) {
							result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";
						}
					} else if (result["Entries"]["Entry"][i]["id"][0].substring(0,10) == "SpyResult_") {
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
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0] + ' (' + (investResults[nonAbbreviatedRole] || "Error!").replace(/\(/g, '[').replace(/\)/g, ']') + ')';
						} else if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Your target could be a") != -1)) {
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace("Your target could be a ", "Results: ").replace("Your target could be an ", "Results: ").replace(/\, /g, "/").replace(/or /g, "");
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].slice(0, -1);
							result["Entries"]["Entry"][i]["Color"][0] = "0x549BF2";
						}
					}
											
					/*
					0x549BF2 (Light Blue) = Investigative result
					0xFFFF00 (Red) = Dangerous
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
								result["Entries"]["Entry"][i]["Color"] = "0xFF0000";
							} else if (!danger) {
								result["Entries"]["Entry"][i]["Color"] = "0x808080";
							}
						}
					}
				}
			} else if (fn == "Gui.BACKUP") {
				for (var i in result["Entries"]["Entry"]) {
					if (result["Entries"]["Entry"][i]["Text"] && result["Entries"]["Entry"][i]["id"]) {
						if (guichanges[result["Entries"]["Entry"][i]["id"]]) {
							result["Entries"]["Entry"][i]["Text"][0] = guichanges[result["Entries"]["Entry"][i]["id"]];
						} else if ((result["Entries"]["Entry"][i]["id"][0].indexOf("RoleCardAbility") != -1)) {
							let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAbility", "").replace(/\d/g, '');
							result["Entries"]["Entry"][i]["Text"][0] = investResults[role] || "Error!";
						} else if ((result["Entries"]["Entry"][i]["id"][0].indexOf("RoleCardAttribute") != -1)) {
							let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAttribute", "").replace(/\d/g, '');
							if (role == "Executioner") {
								result["Entries"]["Entry"][i]["Text"][0] = ("- Target: %name%\n- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniques[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!") + " (1 is highest possible)");
							} else {
								result["Entries"]["Entry"][i]["Text"][0] = ("- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniques[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!") + " (1 is highest possible)");
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
			}
			var builder = new xml2js.Builder({"headless": true});
			var xml = builder.buildObject(result);
			fs.writeFile(savelink + (fn.replace('BACKUP', 'xml')), '<?xml version="1.0" encoding="utf-8"?>\n<!-- Parsed by tosabbreviator v' + version + ' -->\n' + xml, function() {
				doneCount++;
				console.log(doneCount + ' out of 3 files completed.');
				if (doneCount == 3) {
					console.log('Finished conversion.');
					waitForKey();
				}
			})
		});
	});
}

console.clear();
displayHeader();

if (config['steampath']) {
	if (config['steampath'] != 'default') {
		savelink = config['steampath'] + '/steamapps/common/Town of Salem/XMLData/Localization/en-US/';
	}
} else {
	let pathprefix = prompt('Steam Path (press enter for default) (e.g. C:\\Program Files (x86)\\Steam): ');
	if (pathprefix) {
		let lastchar = pathprefix.substring(pathprefix.length-1,pathprefix.length);
		if (lastchar == "\\" || lastchar == "/") {
			pathprefix = pathprefix.substring(0,pathprefix.length-1);
		}
		savelink = pathprefix + '/steamapps/common/Town of Salem/XMLData/Localization/en-US/';
		if (!(fs.existsSync(savelink))) {
			console.log('Invalid path. Please run this tool again and retry.');
			process.exit();
		}
		config['steampath'] = pathprefix;
	} else {
		config['steampath'] = 'default';
	}
	jf.writeFileSync(homedir + '/.tosabbreviator', config);
}

console.clear();
displayHeader();
doVersionCheck(function(v) {
	if (config["latest"]) {
		if (v != config["latest"]) {
			if (fs.existsSync(savelink + 'Game.BACKUP')) {
				fs.unlinkSync(savelink + 'Game.BACKUP');
			}
			if (fs.existsSync(savelink + 'Gui.BACKUP')) {
				fs.unlinkSync(savelink + 'Gui.BACKUP');
			}
			if (fs.existsSync(savelink + '../GameLanguage.BACKUP')) {
				fs.unlinkSync(savelink + '../GameLanguage.BACKUP');
			}
			console.log('\nNote: Town of Salem has updated, and all backup files have been removed.');
		}
	}
	config["latest"] = v;
	jf.writeFileSync(homedir + '/.tosabbreviator', config);
});
console.log("Keybinds:\n  c		convert files and exit this tool\n  v		display town of salem version\n  r		revert any conversions done\n  p		repair a broken installation\n  e		exit this tool");
process.stdin.addListener("data", function(d) {
	if (d) {
		if (waitingForKey) {
			console.clear();
			displayHeader();
			console.log("Keybinds:\n  c		convert files and exit this tool\n  v		display town of salem version\n  r		revert any conversions done\n  p		repair a broken installation\n  e		exit this tool");
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
				case 'e':
					process.exit();
					break;
			}
		}
	}
});
process.stdin.setRawMode(true);
process.stdin.resume();