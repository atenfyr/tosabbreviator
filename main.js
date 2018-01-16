/*
	TOSAbbreviator
	Written by Atenfyr
*/

const fs = require('fs-extra');
const path = require('path');
const xml2js = require('xml2js');
const args = require('minimist')(process.argv.slice(2));
const prompt = require('prompt-sync')();
const jf = require('jsonfile');

if (!fs.existsSync('./.tosabbreviator')) {
	fs.writeFileSync('./.tosabbreviator', '{}');
}

let config = JSON.parse(fs.readFileSync('./.tosabbreviator'));

let version = '1.0.0'
let writtenFor = 8298;
let waitingForKey = false;

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
	"You could not get over the guilt of killing a town member. You shot yourself":  "You shot yourself over the guilt of killing another town member",
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
	"BG/GF": "bg/gf"
}
let changes2 = { // Not case sensitive
	"not suspicious":"ns/gf",
	"is a member of the Mafia": "is in the Mafia",
	"a member of the Mafia": "the Mafia",
	"a member of the %role%": "the %role%",
	"nursed you back to health": "healed you",
	"nursed them back to health": "healed them",
	"fought off your attacker": "protected you", // new
	"fought off their attacker": "protected them", // new
	"their defense was too strong": "they were immune",
	"your defense was too strong": "you were immune",
	" you can feel your heart breaking.": "",
	" you will die tomorrow unless you are cured.": " You will die tomorrow, if not cured.",
	" they will die tomorrow unless cured.": "",
	"You feel a mystical power dominating you. ": "",
	"Someone threatened to reveal your secrets. You are bm'd": "You were bm'd",
	" but you were": ", but you were",
	" but they were": ", but they were",
	" but you are": ", but you are",
	" but they are": ", but they are",
	" but someone": ", but someone",
	" You committed suicide over the guilt.": "",
	"Someone occupied your night. ": "",
	"hauled off to jail": "jailed",
	" in gasoline": "",
	" in gas": "",
	"gasoline": "gas",
	" to another location": "",
	"!": "."
}
let forcechanges = {
	"0": "Result: Mafia",
	"1": "Result: ns/gf",
	"2": "Result: Cult",
	"3": "Result: SK",
	"29": "Result: Juggernaut",
	"37": "Results: Framer/Vamp/Jest (possibly framed)",
	"53": "Result: Mayor",
	"65": "Result: GF",
	"72": "Result: Jest",
	"102": "Result: WW",
	"104": "You can attack tonight.",
	"149": "Result: PB",
	"150": "Result: Pestilence",
	"155": "Result: CL",
	"156": "Result: Hex Master",
	"157": "Result: Necro",
	"158": "Result: Poisoner",
	"159": "Result: Medusa",
	"Coven31": "Results: Vig/Vet/Mafioso/Pirate/Ambusher",
	"Coven32": "Results: Med/Janitor/Retri/Necro/Trapper",
	"Coven33": "Results: Surv/VH/Medusa/Psy",
	"Coven37": "Results: Framer/Vamp/Jest/Hex Master (possibly framed)"
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
	"Juggernaut": "N/A"
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
	"Pestilence": "Pest/Pesti",
	"Bodyguard": "BG",
	"Godfather": "GF",
	"Arsonist": "Arso",
	"Crusader": "Crus (uncommon)",
	"Vigilante": "Vig",
	"Veteran": "Vet",
	"Mafioso": "N/A",
	"Pirate": "N/A",
	"Ambusher": "N/A",
	"Medium": "Med",
	"Janitor": "Jan (somewhat uncommon)",
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
	"HexMaster": "Hex (uncommon)",
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
	"Youngest": "New"
}
let dangerwords = ["You did not perform your day ability.", "You did not perform your night ability.", "haunt", "consume", "control", "lynch", "staked", "die", "shot", "douse", "set on fire", "murder", "attack", "kill", "execute", "suicide", "guilt", "mafia", "serial killer", "bm", "rb", "immune", "transport"];

let doneCount = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function displayHeader() {
	console.log('---TOSAbbreviator v' + version + '---');
	console.log('---Written by Atenfyr---\n')
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
function doVersionCheck() {
	let latestN = 0;
	fs.readFile(savelink + '\\PatchNotes\\PatchNotes.xml', function(err, data) {
		let dsplit = data.toString().split("\n");
		for (var i in dsplit) {
			if (dsplit[i].indexOf("<Version>") != -1) {
				latestN = Number(dsplit[i].replace(/[\D]/g, ""));
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
							result["Entries"]["Entry"][i]["Color"][0] = "0x0090EB";
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
						result["Entries"]["Entry"][i]["Color"][0] = "0x0090EB";
					} else if (result["Entries"]["Entry"][i]["Text"]) {
						for (var j in changes) {
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "g"), changes[j]);
						}
						for (var j in changes2) {
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "gi"), changes2[j]);
						}
						if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Your target") !== -1) && (result["Entries"]["Entry"][i]["Text"][0].indexOf("They must be") !== -1)) {
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(/.+(\They must be a )/g, "Result: ").replace(/.+(\They must be an )/g, "Result: ");
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].substring(0, result["Entries"]["Entry"][i]["Text"][0].length-1);
							result["Entries"]["Entry"][i]["Color"][0] = "0x0090EB";
						} else if ((result["Entries"]["Entry"][i]["Text"][0].indexOf("Your target could be a") != -1)) {
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace("Your target could be a ", "Results: ").replace("Your target could be an ", "Results: ").replace(/\, /g, "/").replace(/or /g, "");
							result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].substring(0, result["Entries"]["Entry"][i]["Text"][0].length-1);
							result["Entries"]["Entry"][i]["Color"][0] = "0x0090EB";
						}
					}
											
					/*
					0x0090EB (Dark Cyan) = Investigative result
					0xFFFF00 (Red) = Dangerous
					0x808080 (Grey) = Other
					*/
					if (result["Entries"]["Entry"][i]["Color"] && result["Entries"]["Entry"][i]["id"][0] != "81" && result["Entries"]["Entry"][i]["id"][0] != "100") {
						if ((result["Entries"]["Entry"][i]["Color"][0] != "0x0090EB") && (result["Entries"]["Entry"][i]["Color"][0] != "0x00FF00")) {
							var text = result["Entries"]["Entry"][i]["Text"][0];
							var danger = false;
							for (var j in dangerwords) {
								if (text.toLowerCase().indexOf(dangerwords[j].toLowerCase()) !== -1) {
									result["Entries"]["Entry"][i]["Color"] = "0xFF0000";
									danger = true;
									break;
								}
							}
							
							if (result["Entries"]["Entry"][i]["id"][0] == "102") {
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
							let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAbility", "");
							result["Entries"]["Entry"][i]["Text"][0] = investResults[role] || "Error!";
						} else if ((result["Entries"]["Entry"][i]["id"][0].indexOf("RoleCardAttribute") != -1)) {
							let role = result["Entries"]["Entry"][i]["id"][0].replace("RoleCardAttribute", "");
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
			fs.writeFile(savelink + (fn.replace('BACKUP', 'xml')), '<?xml version="1.0" encoding="utf-8"?>\n<!-- Parsed by TOSAbbreviator v' + version + ' -->\n' + xml, function() {
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
		if (pathprefix.substring(pathprefix.length-1,pathprefix.length) == "\\") {
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
	jf.writeFileSync('./.tosabbreviator', config);
}

console.clear();
displayHeader();
console.log("Keybinds:\n  c		convert files and exit this tool\n  v		display town of salem version\n  r		revert any conversions done\n  e		exit this tool");

process.stdin.addListener("data", function(d) {
	if (d) {
		if (waitingForKey) {
			console.clear();
			displayHeader();
			console.log("Keybinds:\n  c		convert files and exit this tool\n  v		display town of salem version\n  r		revert any conversions done\n  e		exit this tool");
			waitingForKey = false;
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
				case 'e':
					process.exit();
					break;
			}
		}
	}
});
process.stdin.setRawMode(true);
process.stdin.resume();