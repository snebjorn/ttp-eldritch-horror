# Eldritch Horror for Tabletop Playground

An attempt to port [Eldritch Horror](https://steamcommunity.com/sharedfiles/filedetails/?id=2075317062) for Tabletop Simulator to Tabletop Playground

## Useful tools

- [Image Grid](http://www.rw-designer.com/image-grid)
- Gimp plugins:
  - [Export Layers](https://khalim19.github.io/gimp-plugin-export-layers/)
  - [Ofnuts' Gimp Tools](https://sourceforge.net/projects/gimp-tools/files/scripts/)
    - ofn-layer-tiles
    - ofn-tiles
    - clear-layers

## Development

Symlink the src folder to a suitable subfolder in TTP's package location. The package location is by default in `<Tabletop Playground directory>/TabletopPlayground/PersistentDownloadDir`.

```
src/01 Core                   <-    .../PersistentDownloadDir/Eldritch Horror
src/02 Forsaken Lore          <-    .../PersistentDownloadDir/Eldritch Horror - Forsaken Lore
src/03 Mountains of Madness   <-    .../PersistentDownloadDir/Eldritch Horror - Mountains of Madness
src/04 Strange Remnants       <-    .../PersistentDownloadDir/Eldritch Horror - Strange Remnants
src/05 Under the Pyramids     <-    .../PersistentDownloadDir/Eldritch Horror - Under the Pyramids
```

### Windows

On Windows [Link Shell Extension](https://schinagl.priv.at/nt/hardlinkshellext/hardlinkshellext.html) can be used to make life easier. Use Junctions links.
