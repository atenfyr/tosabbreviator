# tosabbreviator
A tool that converts the Town of Salem language files on the Steam version to display the information you need to play in as few words as possible.

## Installation (Stable)
### Windows
You can download the latest stable version of tosabbreviator [here](https://github.com/atenfyr/tosabbreviator/releases). Simply double-click the .exe file, type in your steam path, press the "c" key, and you're done.
### Mac
You can download the latest version of tosabbreviator [here](https://github.com/atenfyr/tosabbreviator/releases). Note that the mac version of tosabbreviator is untested, and may not work. Alternatively, if you have node.js installed on your system, you can download the source of the latest stable version [here](https://github.com/atenfyr/tosabbreviator/releases). Instead of downloading the .exe file, download the source code as a zip. Extract the folder inside the source zip and run "npm install" and then "node main" in your command line of choice. Note that the default is intended for Windows, and you will have to put in your own path.

## Installation (Experimental)
Assuming that node.js installed, the latest experimental source code can be downloaded with [this link](https://github.com/atenfyr/tosabbreviator/archive/master.zip). After extracting the folder inside the zip file, run "npm install" and then "node main" in your command line of choice inside of the source folder. If you wish to build it into an executable file using nexe, run "node build help" for instructions.

## Changes
Here is a list of all the changes that this tool makes to the language files of Town of Salem.
- All roles are abbreviated in status messages, and "Pestilence, Horseman of the Apocalypse" is shortened to just "Pestilence."
- Blackmailed is abbreviated to BM'd, and roleblocked is abbreviated to RB'd. Not suspicious is abbreviated to ns/gf.
- All exclamation points have been switched out for full stops, as after enough gameplay, none of the status messages warrant overexcitement.
- Role cards have been completely revamped. Role cards show their Investigator results (a role in brackets means that it only will show up in the Coven expansion), traits such as "RB Immunity", uniqueness, action priority, and their common abbreviation, rather than simply how to play the role.
- The background colour of status messages are no longer nearly always red. Red is reserved for "dangerous" messages, green for messages that involve healing, light blue for investigative result messages, and grey for all other messages that do not fit in any of these categories.
- Investigator and Consigliere/Witch results show up as "Results: X/Y/Z" and "Result: X (X/Y/Z)" respectively. Consigliere and Witch results will also the Investigator results of the role that they investigated, and any role in brackets (square brackets for the Consigliere and Witch) signifies that that role will only show up in the Coven expansion.
- The tips that show up on the bottom of the screen when you get your role selected are now disabled.
- Framer/Vamp/Jest results also state that it is possible that the target was framed.
- Spy and Lookout visit messages say "Mafia visits," "Coven visits," and "Target visited by" rather than "visited by a member of the mafia/coven" and "... visited your target last night!"
- When the Spy bugs a target, it gives the message that would have appeared to the target and puts "On target:" in front, rather than changing all the words to refer to "them" rather than "you."
- After cleaning as a Janitor, the game simply tells you the role and where to see their will, cutting out all the clutter that is normally in chat after cleaning a target.
- Many more minor changes that enhance the game just a little bit.