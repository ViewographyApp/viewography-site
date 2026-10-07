# Updating What's New for a new TestFlight build

Do this when a new build reaches testers, not before.

1. **Current build card:** set the heading to the new `S{n}E{n} · Title` and the small line to `Version X.Y (build)`.
2. **Release notes:** turn "Coming in the next beta" into a new release entry at the top of "Release notes", tagged Apple iOS beta. Leave "Coming in the next beta" empty or remove it until there's something in testing.
3. **Previous builds:** move the build that was current into the collapsible "Previous builds" section at the bottom of the page (a `<details>` element, closed by default, newest first). Create the section the first time (S2E5 release, moving S2E4).
4. Copy `whats-new.html` to `whats-new/index.html` so both routes match.
5. Check the page at phone width, then push to main.
