import type { Comic } from '@skripta/ui'

// Crypto & security xkcd comics for the home page gallery (random start).
// xkcd by Randall Munroe, CC BY-NC 2.5; images from imgs.xkcd.com, hover texts from the xkcd JSON API.
export const XKCD: Comic[] = [
  { src: '/xkcd/538.png', width: 448, height: 274, scale: 1, title: "xkcd 538: Security", alt: "Actual actual reality: nobody cares about his secrets.  (Also, I would be hard-pressed to find that wrench for $5.)", href: 'https://xkcd.com/538/' },
  { src: '/xkcd/221.png', width: 400, height: 144, scale: 1, title: "xkcd 221: Random Number", alt: "RFC 1149.5 specifies 4 as the standard IEEE-vetted random number.", href: 'https://xkcd.com/221/' },
  { src: '/xkcd/936.png', width: 1480, height: 1202, scale: 2, title: "xkcd 936: Password Strength", alt: "To anyone who understands information theory and security and is in an infuriating argument with someone who does not (possibly involving mixed case), I sincerely apologize.", href: 'https://xkcd.com/936/' },
  { src: '/xkcd/1553.png', width: 1466, height: 564, scale: 2, title: "xkcd 1553: Public Key", alt: "I guess I should be signing stuff, but I've never been sure what to sign. Maybe if I post my private key, I can crowdsource my decisions about what to sign.", href: 'https://xkcd.com/1553/' },
  { src: '/xkcd/1286.png', width: 946, height: 1081, scale: 2, title: "xkcd 1286: Encryptic", alt: "It was bound to happen eventually. This data theft will enable almost limitless [xkcd.com/792]-style password reuse attacks in the coming weeks. There's only one group that comes out of this looking smart: Everyone who pirated Photoshop.", href: 'https://xkcd.com/1286/' },
  { src: '/xkcd/424.png', width: 493, height: 527, scale: 1, title: "xkcd 424: Security Holes", alt: "True story: I had to try several times to upload this comic because my ssh key was blacklisted.", href: 'https://xkcd.com/424/' },
  { src: '/xkcd/1181.png', width: 488, height: 459, scale: 2, title: "xkcd 1181: PGP", alt: "If you want to be extra safe, check that there's a big block of jumbled characters at the bottom.", href: 'https://xkcd.com/1181/' },
  { src: '/xkcd/1121.png', width: 983, height: 507, scale: 2, title: "xkcd 1121: Identity", alt: "Not sure why I just taught everyone to flawlessly impersonate me to pretty much anyone I know. Just remember to constantly bring up how cool it is that birds are dinosaurs and you'll be set.", href: 'https://xkcd.com/1121/' },
  { src: '/xkcd/153.png', width: 500, height: 518, scale: 1, title: "xkcd 153: Cryptography", alt: "If you got a big keyspace, let me search it.", href: 'https://xkcd.com/153/' },
  { src: '/xkcd/177.png', width: 740, height: 469, scale: 1, title: "xkcd 177: Alice and Bob", alt: "Yet one more reason I'm barred from speaking at crypto conferences.", href: 'https://xkcd.com/177/' },
  { src: '/xkcd/1354.png', width: 1280, height: 2727, scale: 2, title: "xkcd 1354: Heartbleed Explanation", alt: "Are you still there, server? It's me, Margaret.", href: 'https://xkcd.com/1354/' },
  { src: '/xkcd/257.png', width: 500, height: 397, scale: 1, title: "xkcd 257: Code Talkers", alt: "As far as I can tell, Navajo doesn't have a common word for 'zero'.  do-neh-lini means 'neutral'.", href: 'https://xkcd.com/257/' },
  { src: '/xkcd/792.png', width: 480, height: 1189, scale: 1, title: "xkcd 792: Password Reuse", alt: "It'll be hilarious the first few times this happens.", href: 'https://xkcd.com/792/' },
  { src: '/xkcd/1820.png', width: 933, height: 1671, scale: 2, title: "xkcd 1820: Security Advice", alt: "Never give your password or bank account number to anyone who doesn't have a blue check mark next to their name.", href: 'https://xkcd.com/1820/' },
  { src: '/xkcd/2522.png', width: 1038, height: 589, scale: 2, title: "xkcd 2522: Two-Factor Security Key", alt: "The bruises on my fingertips are my proof of work.", href: 'https://xkcd.com/2522/' },
]
