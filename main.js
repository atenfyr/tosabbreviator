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

require('./config.js');

let homedir = require('os').homedir();
if (!fs.existsSync(homedir + '/tosabbreviator')) {
    fs.mkdirSync(homedir + '/tosabbreviator');
}
homedir = homedir + '/tosabbreviator/';

if (!fs.existsSync(homedir + 'main.config')) {
	fs.writeFileSync(homedir + 'main.config', '{}');
}

let doneCount = 0;
let config = JSON.parse(fs.readFileSync(homedir + 'main.config'));
let waitingForKey, ynPrompt, disabled, pathError, hasCrashed, developmentKey, justGotUpdate = false;

let defaultlink = "C:/Program Files (x86)/Steam/steamapps/common/Town of Salem/XMLData/Localization/en-US/";
let savelink = defaultlink;

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
						if (forceChanges[result["Entries"]["Entry"][i]["id"][0]]) {
							log.info('Overriding data for entry %s in Game.xml', result["Entries"]["Entry"][i]["id"][0]);
							result["Entries"]["Entry"][i]["Text"][0] = forceChanges[result["Entries"]["Entry"][i]["id"][0]];
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
							for (var j in caseSensitive) {
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "g"), caseSensitive[j]);
							}
							for (var j in nonCaseSensitive) {
								result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "gi"), nonCaseSensitive[j]);
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
								for (var j in dangerWords) {
									if (text.toLowerCase().indexOf(dangerWords[j].toLowerCase()) !== -1) {
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
							if (guiChanges[result["Entries"]["Entry"][i]["id"]]) {
								log.info('Overriding data for entry %s in Gui.xml', result["Entries"]["Entry"][i]['id']);
								result["Entries"]["Entry"][i]["Text"][0] = guiChanges[result["Entries"]["Entry"][i]["id"]];
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
									result["Entries"]["Entry"][i]["Text"][0] = ("- Target: %name%\n- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniqueRoles[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!"));
								} else {
									result["Entries"]["Entry"][i]["Text"][0] = ("- Abbr: " + (abbreviations[role] || "Error!") + "\n- " + ((uniqueRoles[role])?"Unique":"Not unique") + "\n- Priority: " + (priority[role] || "Error!"));
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
								for (var j in caseSensitive) {
									result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "g"), caseSensitive[j]);
								}
								for (var j in nonCaseSensitive) {
									result["Entries"]["Entry"][i]["Text"][0] = result["Entries"]["Entry"][i]["Text"][0].replace(new RegExp(j, "gi"), nonCaseSensitive[j]);
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
                    if (!justGotUpdate) {
                        console.log('\nNote: A new version of tosabbreviator is available. Press the "F" key to download it.');
                    }
                    justGotUpdate = true;
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
    if (config['downloadlink'] && !justGotUpdate) {
        console.log('\nNote: A new version of tosabbreviator is available. Press the "F" key to download it.');
        justGotUpdate = true;
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