# Earth texture

The globe normally loads NASA's **Blue Marble: Land Surface, Shallow Water, and
Shaded Topography** December 2004 composite directly from NASA Earth Observatory.
It is a 5400×2700, 2:1 equirectangular photographic composite, so coastlines,
terrain, deserts, forests, and polar ice retain the detail of the source imagery
instead of being redrawn as simplified vector shapes.

`earth-topography.svg` remains only as an offline-safe fallback so the globe does
not become blank if NASA's image host cannot be reached. Both textures are
combined at render time with procedural cloud detail, ocean specular reflection,
atmospheric Fresnel light, and night-side settlement lights.

Source: [NASA Earth Observatory, Blue Marble](https://earthobservatory.nasa.gov/features/BlueMarble)

Image credit: NASA Earth Observatory.
