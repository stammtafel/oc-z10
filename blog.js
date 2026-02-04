document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("blog-tiles");
  if (!container) {
    console.error("blog-tiles container not found");
    return;
  }

  try {
    const response = await fetch("blog/blogindex.json");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const entries = await response.json();

    entries.forEach(entry => {
      const a = document.createElement("a");
      a.className = "tile";
      a.href = `blog/${entry.file}`;

      a.innerHTML = `
        <h2>${entry.title}</h2>
        <p>${entry.description}</p>
      `;

      container.appendChild(a);
    });

  } catch (err) {
    console.error("Failed to load blogindex.json", err);
    container.innerHTML = "<p>Blog konnte nicht geladen werden.</p>";
  }
});

