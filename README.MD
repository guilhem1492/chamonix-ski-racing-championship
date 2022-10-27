# Chamonix Ski Racing Championship 2022

A ski racing simulation based on HTML canvas, using: HTML, CSS, and JavaScript. This is the first of the three projects of my Ironhack WebDev Bootcamp (fall 2022).
The player must drive the skier through the gates. The entire run to victory lasts 3 minutes. The timer displays the time remaining before the finish line. If the player miss a gate, the game is over. She or he can try again with one click.

# DEMO

https://guilhem1492.github.io/chamonix-ski-racing-championship/

# About implementation

This implementation uses the following:

- 6 classes to build the moving images, the game area and its logic.
- An empty array where the gates positions are pushed randomly from another array of three strings: "left", "center" and "right".
- A class method who detects if the skier's y axis doesn't equal the gate y axis, so that the game continue if the skier is passing on the gates and stops if not.
- Click, keydown and keyup EventListeners.
- A reusable function starting and restarting the game, deleting the unncessary buttons, resetting the timer to three minutes and the main audio theme current time to zero.

# Possible improvements

- The window.onload audio play function doesn't work due to DOM exception.
- The difficulty level could be lowered or increased on demand (settings og the frames speed and the gates's spacing).
- Adding a counter increasing after every gate passed by the skier, so the player get a scoring.

# Sources and credits

https://fontsfree.net/arcade-2-font-download.html
https://www.spriters-resource.com/
https://www.istockphoto.com/fr/vectoriel/pixel-art-arbre-de-neige-gm501258458-81242371
https://pixabay.com/sound-effects/search/game/
https://www.youtube.com/watch?v=o7pML9YzOYg
https://www.youtube.com/watch?v=rgUksX6eM0Y
