# Customize People of Bhubaneswar

The playable city shares one XZ plane. Positive X is east and positive Z is south. The roads between junctions are compressed so the walk from KIIT Square to Bindu Sagar takes about three minutes.

## City layout

- `src/game/city/layout.ts` places the original Patia and Saheed Nagar blocks and defines public landmarks, the walking spine, and bus stops.
- `src/game/city/sections.ts` places the new streets, buildings and water from Jayadev Vihar to Old Town. Each section has a rectangular boundary and uses the same road geometry for the 3D ground and the city map.
- `src/game/world/CityLandmark.tsx` models the custom exteriors. Ordinary buildings use the residential, commercial, mixed-use or civic profiles in `src/game/layout.ts`.

Connect new sections at matching street edges. Keep map destinations, resident slots and bus curbs on walkable ground. Use the same dimensions for a storefront and its collider. The city routing tests check reachable destinations and the bus path.

## Local references

- **Saheed Nagar** follows Janpath through Rupali Square and into the lanes toward Bhawani Mall. [Odisha Works Department road inventory](https://works.odisha.gov.in/or/node/50413) · [BMC Bhawani Mall brochure](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_020260215_085149.pdf) · [Rama Devi Women’s University location](https://rdwu.ac.in/AboutusLocation.aspx)
- **Patia** follows KIIT Road and Nandankanan Road down to Patia Square and Infocity. [BMC road and median inventory](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_020240108_105511.pdf) · [KIIT-area survey](https://crdf.org.in/resources/resources/CoE-UT/PAMP/PAMP%20toolkit_Volume%203.pdf) · [KIIT campus reference](https://kiit.ac.in/campuslife/campus/) · [Ama Bus shelters](https://capitalregiontransport.in/)
- **Jayadev Vihar** joins Nandankanan Road and the NH 16 corridor. [BMC road maps](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_020220806_105443.pdf) · [Pal Heights](https://www.palheights.com/discover/pal-heights) · [Kalinga Stadium route map](https://tatasteelbbsr-run.com/onewebmedia/10%20Km%20map.pdf)
- **Janpath and Old Town** follow the Ram Mandir, Master Canteen, Raj Mahal and Kalpana approaches. [Janpath survey](https://cms.bhubaneswarone.in/uploadDocuments/Notice/CitizenInfo_10082016111932AM.pdf) · [BMC Old Town plan](https://cms.bhubaneswarone.in/uploadDocuments/Tender/TenderFile_120200826_142935.pdf) · [Lingaraj Temple](https://odishatourism.gov.in/en/places/lingaraj-temple)

`SignSpec` accepts an English title and an Odia line. The root layout loads Noto Sans Oriya before the canvas paints sign textures. Store names use the game’s sign style. The fictional guest residents use dedicated walkable positions beside the district hangouts and reusable character rigs. Keep saved character IDs valid when changing the roster.

The game follows Indian Standard Time. Use `?time=10:30` and `?time=20:30` to preview daytime and nighttime lighting.

## Hosting and membership

Set the public and admin origins documented in [`.env.example`](.env.example). Configure the matching public origins in the Worker’s `ALLOWED_ORIGINS` for each environment. Apply the forward Bhubaneswar migration to an existing database, or run the generated schema for a fresh Supabase project. Newly issued invites use the `BBS-` prefix and old codes remain redeemable.

Deploy the updated realtime Worker before releasing the connected-city client. The Worker serves the `bhubaneswar` namespace and continues to serve the original Patia and Saheed Nagar rooms for older clients.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the game and optional services.
