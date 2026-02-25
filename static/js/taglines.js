// only run on index
if (window.location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", () => {
    const taglines = [
        "Reticulating splines",
        "Rendering [object Object]",
        "Spawning goroutines",
        "Piping everything to grep",
        "Looking for the 10mm socket",
        "Attempting to center a div",
        "Letting the magic smoke out",
        "Figuring out how to exit Vim",
        "Waxing the snowboard",
        "Tinning wires",
        "Blaming DNS",
        "Recording macros",
        "Pushing to production on a Friday",
        "Sowing the seeds",
        "Containerizing the monolith",
        "Untangling audio cables",
        "Resolving merge conflicts",
        "Optimizing server tick rate",
        "Compiling shaders",
      ],
      taglineEl = document.getElementById("tagline"),
      setNewTagline = () => {
        const currentText = taglineEl.textContent;
        let newText = currentText;
        // don't pick the exact same tagline twice in a row
        while (newText === currentText) {
          newText = taglines[Math.floor(Math.random() * taglines.length)];
        }
        taglineEl.textContent = `${newText}...`;
      };
    // set random tagline on load
    setNewTagline();
    // allow cycling through taglines manually :)
    taglineEl.addEventListener("click", () => setNewTagline());
  });
}
