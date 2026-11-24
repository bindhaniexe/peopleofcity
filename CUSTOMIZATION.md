# Customize People of Bhubaneswar

The two maps are authored on a local XZ plane. Each playable district covers 92 × 92 metres. Positive X is east and positive Z is south. Distances are compressed while junctions and landmark order follow the real neighborhoods.

## District files

- `src/game/districts/<id>/layout.ts` holds road and landscape rectangles, building footprints, shops, trees, road paint, and street furniture.
- `index.ts` registers spawn and arrival poses, the portal, landmarks, resident slots, and positional audio.
- `World.tsx` renders the district’s landmark façades. The shared renderer in `src/game/world/World.tsx` draws the ground, kit-built shops, street furniture, and background.

Use the same placement rectangles for visual geometry and colliders. Keep portals, arrivals, and resident slots clear. The district routing tests check connectivity. The picker reads `districts/registry.ts`, while playable districts also register scenes in `world/DistrictWorld.tsx` and rooms in `shared/net/config.ts`.

## Local references

- **Saheed Nagar** follows Janpath through Rupali Square and into the lanes toward Bhawani Mall. [Odisha Works Department road inventory](https://works.odisha.gov.in/or/node/50413) · [BMC Bhawani Mall brochure](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_020260215_085149.pdf) · [Rama Devi Women’s University location](https://rdwu.ac.in/AboutusLocation.aspx)
- **Patia** follows KIIT Road and Nandankanan Road down to Patia Square and Infocity. [BMC road and median inventory](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_020240108_105511.pdf) · [KIIT-area survey](https://crdf.org.in/resources/resources/CoE-UT/PAMP/PAMP%20toolkit_Volume%203.pdf) · [KIIT campus reference](https://kiit.ac.in/campuslife/campus/) · [Ama Bus shelters](https://capitalregiontransport.in/)

`SignSpec` accepts an English title and an Odia line. The root layout loads Noto Sans Oriya before the canvas paints sign textures. Store names use the game’s sign style. The fictional guest residents use dedicated walkable positions beside the district hangouts and reusable character rigs. Keep saved character IDs valid when changing the roster.

The game follows Indian Standard Time. Use `?time=10:30` and `?time=20:30` to preview daytime and nighttime lighting.

## Hosting and membership

Set the public and admin origins documented in [`.env.example`](.env.example). Configure the matching public origins in the Worker’s `ALLOWED_ORIGINS` for each environment. Apply the forward Bhubaneswar migration to an existing database, or run the generated schema for a fresh Supabase project. Newly issued invites use the `BBS-` prefix and old codes remain redeemable.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the game and optional services.
