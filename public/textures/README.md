# Earth texture

`earth-topography.svg` is the bundled, offline-safe physical map. It uses a 2:1
equirectangular projection and includes recognizable coastlines, ice, deserts,
forests, and the major mountain systems. Keeping the texture local also prevents
the globe from becoming blank when a third-party image server is unavailable.

The map is an original project asset, informed by public-domain physical maps.
It is combined at render time with procedural moving-scale cloud detail, ocean
specular reflection, atmospheric Fresnel light, and night-side settlement lights;
no external texture service is required.
