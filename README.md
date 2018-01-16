# tosabbreviator
A tool that converts the Town of Salem language files on the Steam version to display the information you need to play in as few words as possible.

## Installation
# Windows
You can download the latest version of tosabbreviator [here](https://github.com/atenfyr/tosabbreviator/releases). Simply double-click the .exe file, type in your steam path, press the "c" key, and you're done.
# Mac
If you have node.js installed on your system, the source can be downloaded [here](https://github.com/atenfyr/tosabbreviator/archive/master.zip). Simply extract the folder and run "npm run begin" in a command line. Note that the default is intended for Windows, and you will have to put in your own path.
# Other
Town of Salem for Steam is not available on your system yet. However, if it is available in the future, the instructions for Mac should work just as well.

## Changes
Here is a list of all the changes that this tool makes to the language files of Town of Salem.
- All roles except the Jester are abbreviated (in Investigator and Consigliere results, Jester is abbreviated), and "Pestilence, Horseman of the Apocalypse" is shortened to just "Pestilence."
- Blackmailed is abbreviated to BM'd, and roleblocked is abbreviated to RB'd. Not suspicious is abbreviated to ns/gf.
- All exclamation points have been switched out for full stops, as after enough gameplay, none of the status messages warrant overexcitement.
- Role cards have been completely revamped. Role cards show their Investigator results (a role in parentheses means that it only will show up in the Coven expansion), traits such as "RB Immunity", uniqueness, action priority, and their common abbreviation, rather than simply how to play the role.
- The background colour of status messages are no longer nearly always red. Red is reserved for "dangerous" messages, green for messages that involve healing, dark cyan for investigative result messages, and grey for all other messages that do not fit in any of these categories.
- Investigator and Consigliere results show up as "Results: X/Y/Z" and "Result: X" respectively.
- Framer/Vamp/Jest results also state that it is possible that the target was framed.
- Spy and Lookout visit messages say "Mafia visits," "Coven visits," and "Target visited by" rather than "visited by a member of the mafia/coven" and "... visited your target last night!"
- When the Spy bugs a target, it gives the message that would have appeared to the target and puts "On target:" in front, rather than changing all the words to refer to "them" rather than "you."
- When somebody is saved by a Doctor, it says that they were healed rather than "nursed back to health."
- After cleaning as a Janitor, the game simply tells you the role and where to see their will, cutting out all the clutter that is normally in chat after cleaning a target.
- When voting, "Innocent" is abbreviated to "Inno."
- The vampire list now says "New" instead of "Youngest" to refer to the vampire that will visit whoever is voted to be bitten.
- In Lovers mode, when your lover dies, it simply says "Your lover died."
- As an Arsonist, when another Arsonist douses you, the game refers to it as being "doused," instead of being "doused in gas."
- The words "a member of the Mafia/Coven" have been shortened to "the Mafia/Coven."
- When controlled by a Witch, the words "You feel a mystical power dominating you." are cut out, leaving "You were controlled by a Witch."
- When blackmailed, you simply get the status message "You were bm'd," removing the words "Someone threatened to reveal your secrets." Similarly, when roleblocked, the status message says "You were rb'd," removing the words "Someone occupied your night."
- As a Vigilante, if you shoot yourself for killing another townie, you receive the message "You shot yourself over the guilt of killing another townie," rather than "You could not get over the guilt of killing a town member. You shot yourself."
- If you are jailed, the game refers to it as being "jailed," rather than "hauled off to jail."
- When transported, the chat says "You were transported," rather than "You were transported to another location."
- If the person you attack has too high defence, the game will say that they were immune, rather than stating that their defence was too high.
- When you are attacked, but saved by a Bodyguard, the words "fought off your attacker" are replaced with "protected you."
