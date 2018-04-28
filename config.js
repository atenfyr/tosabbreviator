/*
	tosabbreviator config
	Written by Atenfyr
*/

const version = 'v3.2.1';
const writtenFor = 9069;

const investResults = {
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

const abbreviations = {
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
	"Mafioso": "Maf(i) (ambiguous)",
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

const uniqueRoles = {
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

const priority = {
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

const traits = {
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

const caseSensitive = {
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
}

const nonCaseSensitive = {
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
	"bulconstproof vest": "vest",
	"the Jest": "a Jest",
	"!": "."
}

const guiChanges = {
	"Innocent": "inno",
	"JanitorKnowsRole": "Your target's role was",
	"JanitorKnowsRoleX": "Your target's role was %role%.",
	"ExecutionerConvertedToJester": "Your target has died.",
	"JanitorKnowsWill1": "Check the Graveyard to see your target's last will.",
	"JanitorKnowsWill2": " ",
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
	"JuggernautFeedback3": "You will now Rampage.",
    "JuggernautFeedback4": "You now have Unstoppable attack.",
    "TrapperFeedback1": "A(n) %role% triggered your trap.",
    "PsychicFeedback1": "Evil: %name1%, %name2%, or %name3%",
    "PsychicFeedback2": "Good: %name1%, %name2%",
    "YouWereDueled": "You have been rb'd by a Pirate.",
    "PirateChooseAttackHeader": "Choose your attack:",
    "PirateChooseDefendHeader": "Choose your defense:",
    "PirateChooseAttackWinsAgainst": "Wins against:",
    "PirateAttack1Notice": "You decided to use the rapier.",
    "PirateAttack2Notice": "You decided to use the scimitar.",
    "PirateAttack3Notice": "You decided to use the pistol.",
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
    "YouWereDueled": "You were pirated."
}

const forceChanges = {
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

const forceDangerous = [
	107, 108
]

const dangerWords = [
    "haunt",
    "triggered", 
    "poison", 
    "consume", 
    "control", 
    "lynch", 
    "staked", 
    "die", 
    "shot", 
    "shoot", 
    "douse", 
    "fire", 
    "murder", 
    "attack", 
    "kill", 
    "execute", 
    "suicide", 
    "guilt", 
    "bm", 
    "rb", 
    "roleblock", 
    "immune", 
    "transport",
    "stone"
]

global['version'] = version;
global['writtenFor'] = writtenFor;

global['caseSensitive'] = caseSensitive;
global['nonCaseSensitive'] = nonCaseSensitive;
global['guiChanges'] = guiChanges;
global['forceChanges'] = forceChanges;
global['forceDangerous'] = forceDangerous;
global['dangerWords'] = dangerWords;
global['investResults'] = investResults;
global['abbreviations'] = abbreviations;
global['uniqueRoles'] = uniqueRoles;
global['priority'] = priority;
global['traits'] = traits;