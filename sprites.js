/* Shared editable vector geometry: the HUD icons and in-world towers use
   exactly the same faceted silhouettes. No third-party game assets. */
(() => {
  const shapes = {
    basic: [
      ["M8 10 54 7 58 55 10 58Z", "#188f88"],
      ["M8 10 54 7 46 14 15 18 10 58Z", "#41b6aa"],
      ["M15 18 46 14 52 49 17 52Z", "#26a59b"],
      ["M28 15h7v21h-7Z", "#7cd4c9"],
      ["M19 35a13 13 0 1 0 26 0 13 13 0 1 0-26 0", "#59c3b7"],
      ["M22 30q12-7 19 3l-2 8-13 4Z", "#6bcebf"],
    ],
    sniper: [
      ["M32 3 62 57 3 57Z", "#398b40"],
      ["M32 3 32 15 13 51 3 57Z", "#76ba60"],
      ["M32 15 51 51 13 51Z", "#52a54b"],
      ["M32 24 42 45 22 45Z", "#9bd17b"],
      ["M29 14h6v22h-6Z", "#8bc771"],
      ["M32 15 32 50 50 51Z", "#62ae51"],
    ],
    splash: [
      ["M32 4 59 24 49 57 15 57 5 24Z", "#bb3937"],
      ["M32 4 59 24 51 28 31 13 12 28 5 24Z", "#ee6256"],
      ["M31 13 51 28 43 49 21 49 12 28Z", "#db4d45"],
      ["M32 22 42 30 38 43 25 43 21 30Z", "#f47b65"],
      ["M29 16h6v20h-6Z", "#f79a7b"],
    ],
    pyro: [
      ["M10 15 32 3 54 15 54 49 32 61 10 49Z", "#b9682e"],
      ["M10 15 32 3 54 15 46 22 32 12 18 22Z", "#ffd27b"],
      ["M18 22 32 12 46 22 46 44 32 53 18 44Z", "#ec9748"],
      ["M24 16H30V43H24ZM35 12H41V39H35Z", "#ffe9a9"],
      ["M21 17 27 6 33 17ZM32 13 38 2 44 13Z", "#f16b59"],
      ["M23 43H42L37 50H28Z", "#824c2d"],
    ],
    vortex: [
      ["M15 5H49L62 30 49 59H15L2 30Z", "#111b45"],
      ["M15 5H49L43 13H21L11 30 2 30Z", "#344b99"],
      ["M21 13H43L53 31 43 50H21L11 31Z", "#202e65"],
      ["M21 20Q52 8 48 37L39 42Q50 18 21 20ZM45 45Q13 57 16 27L25 22Q15 48 45 45Z", "#5068b8"],
      ["M26 27 36 23 42 32 36 41 26 37Z", "#12214d"],
    ],
    cut: [
      ["M32 3 61 32 32 61 3 32Z", "#50575f"],
      ["M32 3 32 13 13 32 3 32Z", "#c0c6cb"],
      ["M18 17 47 10 39 25 18 47 9 51 17 30Z", "#969fa7"],
      ["M47 10 39 25 17 48 18 38Z", "#e2e6e9"],
      ["M46 20 54 14 48 36 24 55 27 43Z", "#b7c0c7"],
      ["M48 36 24 55 27 47 44 31Z", "#6c7781"],
    ],
    boomerang: [
      ["M8 10 53 7 58 53 12 58Z", "#89765b"],
      ["M8 10 53 7 47 15 16 20 12 58Z", "#d2bc96"],
      ["M16 20 47 15 50 48 20 51Z", "#b29a75"],
      ["M11 24 27 17 52 38 51 52 29 33 12 36Z", "#eddbb8"],
      ["M11 24 27 17 29 24 12 31ZM29 24 52 45 51 52 29 33Z", "#faedce"],
      ["M26 24 34 31 30 35 23 29Z", "#927957"],
    ],
    freeze: [
      ["M16 5H48L62 32 48 59H16L2 32Z", "#20569b"],
      ["M16 5H48L42 13H21L11 32 2 32Z", "#72b7fa"],
      ["M21 13H42L52 32 42 51H21L11 32Z", "#3686d7"],
      ["M29 13H35V51H29ZM15 23 18 18 49 41 46 46ZM15 41 46 18 49 23 18 46Z", "#b5eeff"],
      ["M32 24 40 32 32 40 24 32Z", "#eefaff"],
    ],
    machine: [
      ["M16 5H48L60 17V49L48 60H16L4 49V17Z", "#080a0d"],
      ["M16 5H48L44 12H20L11 20 4 17Z", "#525961"],
      ["M15 20H49V48L40 54H24L15 48Z", "#22262c"],
      ["M20 3H26V35H20ZM29 0H35V35H29ZM38 3H44V35H38Z", "#707982"],
      ["M22 5H25V29H22ZM31 2H34V29H31ZM40 5H43V29H40Z", "#343a42"],
      ["M17 28H47V42H17Z", "#0f1217"],
      ["M21 43H43V50H21Z", "#4d555f"],
      ["M23 44H27V48H23ZM30 44H34V48H30ZM37 44H41V48H37Z", "#b89d61"],
    ],
    laser: [
      ["M16 6 48 6 62 32 48 58 16 58 2 32Z", "#604596"],
      ["M16 6 48 6 41 14 21 14 10 32 2 32Z", "#aa7de0"],
      ["M21 14 41 14 52 32 41 50 21 50 10 32Z", "#8855bc"],
      ["M21 32 32 21 43 32 32 43Z", "#bb91f1"],
      ["M27 4h4v26h-4Zm8 0h4v26h-4Z", "#80e6ed"],
      ["M25 28h16v10H25Z", "#62d8de"],
    ],
  };
  Object.assign(shapes, {
    tesla: [
      ["M16 4H48L61 18V47L47 60H17L3 46V18Z", "#947328"],
      ["M16 4H48L43 12H21L11 22 3 18Z", "#f4d46d"],
      ["M15 21H49V46L40 52H24L15 46Z", "#c39736"],
      ["M30 4H35V29H30Z", "#fff0b1"],
      ["M17 16H47V22H17ZM20 27H44V32H20Z", "#f9dc8b"],
      ["M35 30 23 41H32L27 55 43 37H33Z", "#fff3c0"],
    ],
    acid: [
      ["M14 5H50L61 32 50 59H14L3 32Z", "#526728"],
      ["M14 5H50L44 13H21L12 32 3 32Z", "#b6d961"],
      ["M21 13H44L52 32 44 51H21L12 32Z", "#8ba841"],
      ["M26 9H38V19L46 39Q48 49 32 50Q16 49 18 39L26 19Z", "#d6efa0"],
      ["M24 31H40L44 40Q45 46 32 46Q19 46 20 40Z", "#78a432"],
      ["M27 34H32V39H27ZM35 40H39V44H35Z", "#ecffc9"],
    ],
    mortar: [
      ["M11 7H53L61 46 46 60H18L3 46Z", "#4b5740"],
      ["M11 7H53L46 16H19L10 46 3 46Z", "#9faf7e"],
      ["M19 16H46L51 43 42 51H23L14 43Z", "#74875d"],
      ["M22 8H42V39H22Z", "#c1c7a0"],
      ["M25 9H39V18H25Z", "#303c31"],
      ["M19 36H45V46H19Z", "#465139"],
      ["M23 46H42V51H23Z", "#b7b880"],
    ],
    prism: [
      ["M32 2 61 20 53 52 32 62 11 52 3 20Z", "#784e75"],
      ["M32 2 61 20 49 23 32 12 15 23 3 20Z", "#f4b5e3"],
      ["M32 12 49 23 45 45 32 53 19 45 15 23Z", "#ba78a8"],
      ["M32 14 43 32 32 48 21 32Z", "#f7daee"],
      ["M32 14V48L43 32Z", "#c28fe4"],
      ["M29 3H35V17H29Z", "#fff2fd"],
    ],
    pulse: [
      ["M15 5H49L62 32 49 59H15L2 32Z", "#633e71"],
      ["M15 5H49L43 13H21L11 32 2 32Z", "#d49bdd"],
      ["M21 13H43L53 32 43 51H21L11 32Z", "#9458a2"],
      ["M32 17A15 15 0 1 1 31.9 17ZM32 22A10 10 0 1 0 32.1 22Z", "#e3b4ec"],
      ["M32 26 38 32 32 38 26 32Z", "#fff0ff"],
    ],
  });
  shapes.summon = [
    ["M16 4H48L61 20V46L48 61H16L3 46V20Z", "#180f16"],
    ["M16 4H48L43 12H21L11 23 3 20Z", "#bd3d52"],
    ["M15 24 24 13H40L49 24 44 46 32 55 20 46Z", "#72273b"],
    ["M19 16 24 4 28 21ZM36 21 40 4 45 16Z", "#ea6c7b"],
    ["M23 25 32 20 41 25 39 39 34 44H30L25 39Z", "#e77a87"],
    ["M25 28H30V33H25ZM34 28H39V33H34ZM30 37 32 33 34 37Z", "#24111c"],
  ];
  const moduleGlyph = {
    summon: "M-5 3-3-4 0-6 3-4 5 3 0 6ZM-2-1H2",
    basic: "M-4-4H4V4H-4Z",
    sniper: "M0-6V6M-6 0H6",
    splash: "M-5 4 0-5 5 4Z",
    laser: "M-3-6V6M3-6V6",
    pyro: "M-4 5V-2L0-6 4-2V5Z",
    vortex: "M-5 0Q0-8 5 0Q0 8-5 0",
    cut: "M-5 5 2-6 5-4-2 6Z",
    boomerang: "M-5-3 0 0 5-3",
    freeze: "M0-6V6M-5-3 5 3M-5 3 5-3",
    machine: "M-4-6V5M0-6V5M4-6V5",
    tesla: "M2-6-3 0H2L-2 6",
    acid: "M0-6Q9 6 0 6Q-9 6 0-6",
    mortar: "M-4-6H4V6H-4Z",
    prism: "M0-6 5 0 0 6-5 0Z",
    pulse: "M0-5A5 5 0 1 1-.1-5",
  };
  // Physical attachments in each tower's own material palette. Index matches MODULES.
  // These are integrated barrels, blades, reservoirs and emitters, not UI badges.
  const attachments = {
    summon: [
      "M3 23Q-2 6 15 0L18 6Q7 10 10 22ZM61 23Q66 6 49 0L46 6Q57 10 54 22Z",
      "M0 31Q7 22 14 31V50L7 56 0 50ZM50 31Q57 22 64 31V50L57 56 50 50Z",
      "M5 40 15 26 19 31 11 51ZM45 31 49 26 59 40 53 51Z",
      "M-4 23 4 5 12 23V46H-4ZM52 23 60 5 68 23V46H52ZM22 52H42L38 65H26Z",
      "M-3 18Q8 0 21-4L18 7Q8 12 5 28ZM67 18Q56 0 43-4L46 7Q56 12 59 28ZM18 48 32 39 46 48 40 63H24Z",
    ],
    basic: [
      "M23 8H41V26H23ZM20 5H44V12H20Z",
      "M15 9H24V33H15ZM40 9H49V33H40Z",
      "M28-5H36V23H28ZM25-5H39V1H25Z",
      "M9 30 2 23 8 14 16 20 12 26ZM55 30 62 23 56 14 48 20 52 26Z",
      "M5 44 18 40 22 60H4ZM46 40 59 44 60 60H42ZM24 20H40V31H24Z",
    ],
    sniper: [
      "M23 20A9 9 0 1 0 18 8 9 9 0 0 0 23 20ZM18 14H29V16H18Z",
      "M39 32 45 20 51 32V48H39ZM41 48H49V53H41Z",
      "M29-3H35V20H29ZM22 1H42V4H22ZM25 6H39V9H25Z",
      "M12 38 17 23 23 38 19 50ZM41 38 47 23 52 38 45 50Z",
      "M22-8H27V31H22ZM37-8H42V31H37ZM20 2H44V8H20ZM16 51H48V56H16Z",
    ],
    splash: [
      "M6 22 16 15 20 23 12 30ZM48 15 58 22 52 30 44 23ZM18 49H46L41 59H23Z",
      "M18 36A7 7 0 1 0 18 50 7 7 0 0 0 18 36ZM46 36A7 7 0 1 0 46 50 7 7 0 0 0 46 36Z",
      "M7 30H17V49H7ZM47 30H57V49H47ZM10 33H14V36H10ZM50 33H54V36H50Z",
      "M7 48 20 44 24 60H3ZM44 44 57 48 61 60H40ZM25 8H39V19H25Z",
      "M20 5H44V31H20ZM16 1H48V11H16ZM23 12H41V18H23Z",
    ],
    laser: [
      "M6 24Q12 17 18 24V44Q12 51 6 44ZM46 24Q52 17 58 24V44Q52 51 46 44Z",
      "M13 12Q5 40 24 48L26 42Q13 37 20 14ZM44 12Q59 37 40 48L38 42Q50 35 39 14Z",
      "M23 1Q32-6 41 1V11Q32 18 23 11ZM27 2V9H37V2Z",
      "M2 23 11 13 17 22 11 33ZM47 22 53 13 62 23 53 33ZM22 42H42V50H22Z",
      "M20-5H25V28H20ZM30-8H35V28H30ZM40-5H45V28H40ZM16 30H48V40H16ZM22 47H42V59H22Z",
    ],
    pyro: [
      "M3 17 9 6 15 17V43H3ZM49 17 55 6 61 17V43H49Z",
      "M22 45 32 36 42 45 37 57H27ZM29 43H35V50H29Z",
      "M7 42Q-1 53 10 57L14 51Q7 51 12 44ZM52 42Q64 52 54 58L50 51Q58 51 52 42Z",
      "M-3 25 3 14 9 25V48H-3ZM55 25 61 14 67 25V48H55ZM20-1 26-12 32-1V20H20Z",
      "M15 30 21 17 27 30V44H15ZM37 30 43 17 49 30V44H37ZM14 47H50L44 59H20Z",
    ],
    vortex: [
      "M8 26Q7 1 32 2V7Q13 7 13 26ZM56 38Q57 63 32 62V57Q51 57 51 38Z",
      "M3 32Q1 15 18 13L15 20Q8 24 10 32ZM61 32Q63 49 46 51L49 44Q56 40 54 32ZM22 52Q32 59 42 52V58Q32 65 22 58Z",
      "M5 20Q10 3 28 4L23 11Q14 11 12 24ZM59 44Q54 61 36 60L41 53Q50 53 52 40Z",
      "M2 31Q2-2 34-2V4Q8 4 8 31ZM62 33Q62 66 30 66V60Q56 60 56 33ZM26 24 38 21 43 33 31 43 22 34Z",
      "M4 25Q-4 6 22-1L27 5Q8 9 12 23ZM60 39Q68 58 42 65L37 59Q56 55 52 41ZM15 45Q25 57 42 47L45 53Q22 66 10 49Z",
    ],
    cut: [
      "M4 40 24 3 29 11 13 45ZM36 53 58 13 60 26 43 57Z",
      "M7 29 14 17 20 22 13 35ZM44 42 51 29 57 35 50 48Z",
      "M17 38 47-7 45 9 25 44ZM27 52 62 12 57 31 36 56Z",
      "M-3 39 22-5 26 6 9 43ZM38 58 66 14 63 34 45 64Z",
      "M4 23 27 2 30 10 11 30ZM32 51 55 30 60 36 37 60ZM20 31 42 12 44 21 25 40Z",
    ],
    boomerang: [
      "M10 12 48 8 52 14 15 20ZM15 49 51 44 55 51 15 57Z",
      "M11 38A8 8 0 1 0 11 54 8 8 0 0 0 11 38ZM53 13A7 7 0 1 0 53 27 7 7 0 0 0 53 13Z",
      "M1 27Q-2 9 21 3L23 9Q4 13 7 27ZM63 37Q66 55 43 61L41 55Q60 51 57 37Z",
      "M0 23Q-5 1 23-2L24 5Q4 7 7 23ZM64 41Q69 63 41 66L40 59Q60 57 57 41Z",
      "M8 8 25 3 27 10 10 16ZM42 54 58 48 62 55 44 62ZM2 20 8 17 14 39 8 41ZM50 22 56 20 62 43 56 46Z",
    ],
    freeze: [
      "M8 24 12 1 20 24ZM44 24 53-2 57 24ZM25 53 32 68 39 53Z",
      "M3 41Q12 30 22 42L20 50H4ZM42 42Q52 30 61 41L60 50H44Z",
      "M7 18 15 11 19 20 11 27ZM45 44 53 37 58 46 50 53ZM22 51H42V58H22Z",
      "M1 23 7-4 17 19ZM47 19 57-4 63 23ZM22 56 32 74 42 56ZM14 45 20 35 25 51ZM39 51 44 35 50 45Z",
      "M22-3 27-13 32-3V17H22ZM34-3 39-13 44-3V17H34ZM5 37 13 30 20 42 12 50ZM44 42 51 30 59 37 52 50Z",
    ],
    machine: [
      "M5 29A12 12 0 1 0 5 53 12 12 0 0 0 5 29ZM1 36H9V46H1Z",
      "M47 35Q67 31 66 49L57 56 50 50 57 44 47 43ZM54 35V42M60 37V45M61 47L56 50",
      "M13 4H19V31H13ZM45 4H51V31H45ZM12 1H20V8H12ZM44 1H52V8H44Z",
      "M-1 26Q6 19 13 26V50Q6 57-1 50ZM51 26Q58 19 65 26V50Q58 57 51 50ZM0 34H12V39H0ZM52 34H64V39H52Z",
      "M10 11 17 7V34H10ZM47 7 54 11V34H47ZM14 37H50V43H14ZM12 49 22 45 24 62H8ZM42 45 52 49 56 62H40Z",
    ],
    tesla: [
      "M5 17H11V33H5ZM53 17H59V33H53ZM0 12H16V17H0ZM48 12H64V17H48ZM8 30 22 38V43L6 35ZM56 30 42 38V43L58 35Z",
      "M9 33H22V38H9ZM8 40H23V45H8ZM10 47H21V52H10ZM42 33H55V38H42ZM41 40H56V45H41ZM43 47H54V52H43Z",
      "M29-12H35V9H29ZM24-13A8 8 0 1 0 40-13 8 8 0 0 0 24-13Z",
      "M18-5A14 14 0 1 0 46-5 14 14 0 0 0 18-5ZM25-5A7 7 0 1 1 39-5 7 7 0 0 1 25-5Z",
      "M-1 30H14V35H-1ZM-2 39H15V44H-2ZM0 48H13V53H0ZM50 30H65V35H50ZM49 39H66V44H49ZM51 48H64V53H51ZM23 14H41V20H23Z",
    ],
    acid: [
      "M2 24Q8 19 14 24V49Q8 54 2 49ZM50 24Q56 19 62 24V49Q56 54 50 49Z",
      "M23 43Q17 58 32 61Q47 58 41 43ZM27 48H37V53H27Z",
      "M17 8 21 2 27 8 23 17ZM37 8 43 2 47 8 41 17ZM28-5H36V9H28Z",
      "M-3 26Q5 17 13 26V54H-3ZM51 26Q59 17 67 26V54H51ZM4 44Q32 68 60 44L61 51Q32 77 3 51Z",
      "M17 20 23 11 29 20V38H17ZM35 20 41 11 47 20V38H35ZM12 42H52L47 58H17Z",
    ],
    mortar: [
      "M3 35 16 29 21 47 8 53ZM43 47 48 29 61 35 56 53Z",
      "M5 21 10 10 15 21V43H5ZM49 21 54 10 59 21V43H49Z",
      "M13 49H26V59H13ZM38 49H51V59H38ZM20 44H44V50H20Z",
      "M-3 48 18 41 23 64H-5ZM46 41 67 48 69 64H41ZM24 1H40V12H24Z",
      "M19-7H45V25H19ZM15-9H49V1H15ZM22 4H42V10H22ZM5 51H59V59H5Z",
    ],
    prism: [
      "M3 27 12 13 21 27 12 41ZM43 27 52 13 61 27 52 41Z",
      "M25 5 32-9 39 5 32 19ZM25 5 32 8 39 5 32 13Z",
      "M3 42 11 32 19 42 11 54ZM45 42 53 32 61 42 53 54Z",
      "M-4 27 6 7 16 27 6 47ZM48 27 58 7 68 27 58 47ZM24 55 32 42 40 55 32 67Z",
      "M20 6 32-15 44 6 32 28ZM5 48 15 39 24 53 14 61ZM40 53 49 39 59 48 50 61Z",
    ],
    pulse: [
      "M1 23Q-4 47 20 57L22 51Q4 43 7 25ZM63 23Q68 47 44 57L42 51Q60 43 57 25Z",
      "M20 27A12 12 0 1 0 44 27 12 12 0 0 0 20 27ZM26 27A6 6 0 1 1 38 27 6 6 0 0 1 26 27Z",
      "M12 11A7 7 0 1 0 26 11 7 7 0 0 0 12 11ZM38 11A7 7 0 1 0 52 11 7 7 0 0 0 38 11ZM25 55A7 7 0 1 0 39 55 7 7 0 0 0 25 55Z",
      "M-6 24Q-12 54 20 65L23 59Q-5 49 0 25ZM70 24Q76 54 44 65L41 59Q69 49 64 25Z",
      "M8 15Q32-8 56 15L52 20Q32 0 12 20ZM13 48Q32 65 51 48L55 53Q32 75 9 53ZM24 27A8 8 0 1 0 40 27 8 8 0 0 0 24 27Z",
    ],
  };
  function drawAttachment(ctx, type, n) {
    const material = {
      summon: ["#471725", "#f48f9c"],
      basic: ["#126b68", "#8ce7d6"],
      sniper: ["#285c30", "#c1e69a"],
      splash: ["#8f302c", "#ffad86"],
      laser: ["#473066", "#96f4f2"],
      pyro: ["#9c5123", "#ffe1a1"],
      vortex: ["#111831", "#7a94da"],
      cut: ["#434c55", "#e5f1f7"],
      boomerang: ["#705a3c", "#fff0c8"],
      freeze: ["#22588d", "#d1f8ff"],
      machine: ["#151a20", "#9caeb9"],
      tesla: ["#79571d", "#ffe9a0"],
      acid: ["#455826", "#d1ee8d"],
      mortar: ["#414c31", "#c5d3a0"],
      prism: ["#694668", "#f9d8fa"],
      pulse: ["#593666", "#e9b9f6"],
    }[type];
    const key = type + "-attachment-" + n;
    paths[key] ??= new Path2D(attachments[type][n]);
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = material[0];
    ctx.stroke(paths[key]);
    ctx.fillStyle = material[1];
    ctx.fill(paths[key], "evenodd");
    // Faceted lighting follows the same upper-left light as the original chassis.
    ctx.save();
    ctx.clip(paths[key], "evenodd");
    ctx.fillStyle = material[0];
    ctx.globalAlpha *= 0.3;
    ctx.beginPath();
    ctx.moveTo(32, -30);
    ctx.lineTo(80, 18);
    ctx.lineTo(80, 90);
    ctx.lineTo(32, 90);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha /= 0.3;
    ctx.fillStyle = "#fff";
    ctx.globalAlpha *= 0.18;
    ctx.beginPath();
    ctx.moveTo(-20, -20);
    ctx.lineTo(60, -20);
    ctx.lineTo(-20, 60);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = material[0];
    ctx.stroke(paths[key]);
  }

  const paths = {};
  function icon(type) {
    return `<svg viewBox="0 0 64 64" aria-hidden="true">${shapes[type].map(([d, f]) => `<path d="${d}" fill="${f}"/>`).join("")}</svg>`;
  }
  function draw(ctx, t, size = 45) {
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t.angle + Math.PI / 2);
    ctx.scale(size / 64, size / 64);
    ctx.translate(-32, -32);
    for (let i = 0; i < shapes[t.type].length; i++) {
      if (t.type === "boomerang" && t.boomAway && i >= 3) continue;
      const [d, f] = shapes[t.type][i];
      const key = t.type + i;
      paths[key] ??= new Path2D(d);
      ctx.fillStyle = f;
      ctx.fill(paths[key]);
    }
    for (const id of t.abilities || []) drawAttachment(ctx, t.type, +id);
    ctx.restore();
  }
  function enemyIcon(type) {
    const body = {
      magma:
        '<path d="M12 1 22 7 23 17 14 24 3 20 0 9Z" fill="#733d2b" stroke="#ffb27a"/><path d="M12 4 18 10 15 20 7 18 5 9Z" fill="#f28a46"/><path d="M12 7 15 12 12 17 9 12Z" fill="#ffe1a0"/>',
      magmaMinion:
        '<path d="M3 4H20L24 17 15 24 2 20 0 10Z" fill="#8f4c30" stroke="#f6a061"/><path d="m5 8 7 4 6-5-3 12-6-3Z" fill="#ffb868"/>',
      asterix:
        '<path d="M2 8 12 1 22 7 23 18 12 23 1 17Z" fill="#5b9776" stroke="#b1e2ad"/><path d="m6 5 6 7-6 7 14-7Z" fill="#a4cf8f"/><path d="M16 6h3v3h-3Zm0 9h3v3h-3Z" fill="#fcffd8"/>',
      asterPart:
        '<path d="M12 1 23 7V17L12 23 1 17V7Z" fill="#3e755d" stroke="#b9dca7"/><path d="m5 5 8 7-8 7 14-7Z" fill="#81b484"/>',
      cosmo:
        '<path d="M12 1 23 8V17L12 23 1 17V8Z" fill="#7146a1" stroke="#d8b4ff"/><path d="m12 3 8 9-8 9-8-9Z" fill="#c095ee"/><ellipse cx="12" cy="12" rx="12" ry="5" fill="none" stroke="#e8c5ff"/>',
      cosmicMinion:
        '<path d="m12 1 11 11-11 11L1 12Z" fill="#a085c8" stroke="#e2ccff"/><path d="m12 5 5 7-5 7-5-7Z" fill="#e5d4ff"/>',

      normal: '<circle cx="12" cy="12" r="9" fill="#77bf62" stroke="#b4de9d" stroke-width="2"/>',
      fast: '<path d="M12 2 22 21H2Z" fill="#f3d266" stroke="#fff0a0" stroke-width="2"/>',
      tank: '<path d="M3 3H21V21H3Z" fill="#ef645a" stroke="#ffada0" stroke-width="2"/>',
      sound:
        '<path d="M12 1 22 6V18L12 23 2 18V6Z" fill="#55a8eb" stroke="#a9ddff" stroke-width="1.5"/><path d="M7 9v6m5-9v12m5-9v6" stroke="#e4f8ff" stroke-width="2"/>',
      fighter:
        '<path d="M12 1 23 9 19 22H5L1 9Z" fill="#e98649" stroke="#ffd2a2" stroke-width="1.5"/><path d="M5 9H19V14H5Z" fill="#753e2c"/><path d="M7 10h3v2H7Zm7 0h3v2h-3Z" fill="#fff1bb"/>',
      medic:
        '<path d="M7 1H17L23 7V17L17 23H7L1 17V7Z" fill="#6dd3aa"/><path d="M12 5V19M5 12H19" stroke="#e9fff4" stroke-width="3"/>',
      guardian:
        '<path d="M12 1 22 6V18L12 23 2 18V6Z" fill="#7897d5"/><path d="M6 6H18L17 15 12 19 7 15Z" fill="none" stroke="#edf4ff" stroke-width="2"/>',
      sprinter:
        '<path d="M12 1 23 22H1Z" fill="#f2ab6b"/><path d="m8 9 6 4-6 4" fill="none" stroke="#fff1d5" stroke-width="2"/>',
      splitter:
        '<path d="M12 1 23 12 12 23 1 12Z" fill="#ca8bdd"/><path d="m12 3-3 7 6 4-3 7" stroke="#fff" fill="none" stroke-width="2"/>',
      jammer:
        '<path d="M12 1 22 6V18L12 23 2 18V6Z" fill="#a78ba0"/><path d="M7 8V16M12 6V18M17 8V16M5 20 20 5" stroke="#fbedf5" stroke-width="2"/>',
      minion:
        '<path d="M12 1 22 12 12 23 2 12Z" fill="#75d7de"/><path d="M12 1V23L2 12Z" fill="#a583ec"/>',
      boss: '<path d="M12 0 22 6 22 18 12 24 2 18 2 6Z" fill="#8d80e6"/><path d="M12 0 18 12 12 24 6 12Z" fill="#7fe9ec"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${body[type]}</svg>`;
  }
  function abilityIcon(type, n) {
    const frames = [
      "M3 3H21V21H3Z",
      "M12 1 23 12 12 23 1 12Z",
      "M12 2A10 10 0 1 1 11.9 2Z",
      "M12 0 15 8 24 12 15 16 12 24 9 16 0 12 9 8Z",
      "M6 1H18L24 12 18 23H6L0 12Z",
    ];
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${frames[n]}" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="${moduleGlyph[type]}" transform="translate(12 12) scale(.7)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }
  window.VectorSprites = { icon, draw, enemyIcon, abilityIcon };
})();
