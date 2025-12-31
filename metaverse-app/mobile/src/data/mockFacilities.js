export const MOCK_FACILITIES = [
  {
    id: "pc-01",
    title: "High Performance PC",
    shortDescription:
      "Powerful PC built for high-end VR development and rendering complex scenes",
    description:
      "A high-end workstation PC tuned for VR development, real-time rendering, and simulation workloads.",
    howToUse:
      "Use with a registered lab account. Log in, open your project folder, and save work to your cloud drive after use.",
    images: ["https://www.digitalstorm.com/img/desktop-gaming-pcs.webp"],
    available: 3,
    bookedCount: 12,
    createdAt: "2025-12-25",
  },
  {
    id: "vr-quest2-01",
    title: "Oculus Quest 2",
    shortDescription:
      "A standalone VR headset with 6DOF tracking for a fully immersive experience",
    description:
      "A standalone VR headset suitable for prototyping immersive experiences, testing XR interactions, and running demos.",
    howToUse:
      "Turn on the headset, select the lab profile, and follow the on-screen guardian setup. Return with the controller straps attached.",
    images: ["https://i.ytimg.com/vi/ATVGl9wOJsM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCkR2Ihb65OxXZBFw4mcqXA2l_OAQ"],
    available: 4,
    bookedCount: 7,
    createdAt: "2025-12-27",
  },
  {
    id: "mocap-01",
    title: "Motion Capture Suit",
    shortDescription:
      "Full-body tracking suit for real-time motion capture and avatar control",
    description:
      "A full-body tracking suit designed to accurately translate real-world movements into digital environments in real time.",
    howToUse:
      "Wear the suit, fasten sensors securely, then run the calibration sequence on the lab PC before recording.",
    images: ["https://deusens.com/uploads/blog/2023/10/motion-capture-tecnologias.webp"],
    available: 1,
    bookedCount: 7,
    createdAt: "2025-12-30",
  },
];

export function getFacilityById(id) {
  return MOCK_FACILITIES.find((f) => f.id === id);
}
