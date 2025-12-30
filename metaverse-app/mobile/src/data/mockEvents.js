export const MOCK_EVENTS = [
  {
    id: "unity-vr",
    title: "Building Virtual Worlds with Unity & VR",
    org: "Metaverse Laboratory ITB",
    dateLabel: "Monday, 29 December 2025",
    timeLabel: "11:00 - 12:00 AM",
    location: "Metaverse Laboratory, ITB",
    seatsLeft: 25,
    description:
      "A practical workshop focused on creating immersive virtual environments using Unity and VR tools. Participants will build a mini virtual world and experience it using VR headsets provided by the laboratory.",
    requirements: [
      "Personal laptop",
      "Basic knowledge of programming or game engines (recommended)",
    ],
    speakers: [
      {
        id: "bima",
        name: "Ir. Bima Satya, M.T.",
        role: "VR Developer, Metaverse Lab ITB",
      },
      {
        id: "kevin",
        name: "Kevin Aditya",
        role: "Game & XR Engineer",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  {
    id: "vr-workshop",
    title: "VR Development Workshop",
    org: "Aula Barat, ITB Ganesha",
    dateLabel: "Tuesday, 30 December 2025",
    timeLabel: "02:00 - 04:00 PM",
    location: "Aula Barat, ITB Ganesha",
    seatsLeft: 12,
    description:
      "Hands-on session to learn VR development fundamentals and best practices. You'll build a simple VR interaction and test it directly on a headset.",
    requirements: ["Personal laptop", "Bring your own charger"],
    speakers: [
      {
        id: "mentor-1",
        name: "Metaverse Lab Team",
        role: "Facilitator",
      },
    ],
    images: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=1600&q=80",
    ],
  },
];

export function getEventById(id) {
  return MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];
}