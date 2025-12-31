export const mockProjects = [
  {
    id: "seat-in-exhibition-2025",
    label: "SPATIAL WORLD",
    title: "SEAT in Exhibition 2025",
    subtitle: "Aula Timur ITB Metaverse",
    short:
      "Virtual exhibition space for SEAT 2025—explore the venue, installations, and interactive booths in a 3D world.",
    description:
      "A virtual exhibition experience built to showcase SEAT 2025 in a fully immersive environment. Visitors can explore the exhibition layout, interact with curated content, and move through the space as if they were on-site.\n\nDesigned as a digital companion to the physical exhibition, this project makes the event more accessible for remote audiences and provides a memorable way to revisit the experience after the event.",
    images: [
      "https://www.safran-group.com/sites/default/files/crops/16_9/public/node/2253292/2025-04/AIX-2025_rollup-web.png?itok=E9PGq6Rh",
      "https://www.gauzy.com/wp-content/uploads/2023/09/Aircraft-Interiors-Expo-2023-Gauzy2.jpg",
      "https://www.glasshouse.org.au/files/assets/glasshouse/v/1/gallery/exhibition-shots/take-a-seat/2025_take-a-seat_01.jpg",
      "https://www.airline-suppliers.com/wp-content/uploads/2025/03/Bucher-class-divider-2.jpg",
    ],
    externalUrl:
      "https://www.spatial.io/s/Seat-In-Exhibition-2025-atAula-Timur-ITB-Metaverse-692703787a66fabaf2ad1a85?share=1032498670493367815",
    info: {
      platform: "Spatial.io",
      location: "Aula Timur, ITB",
      type: "Virtual Exhibition",
    },
  },
  {
    id: "virtual-campus-tour",
    label: "VIRTUAL EXPERIENCE",
    title: "Virtual Campus Tour",
    subtitle: "ITB Ganesha 3D Experience",
    short:
      "Explore ITB Ganesha campus in 3D—navigate key landmarks, open spaces, and facilities from anywhere.",
    description:
      "This project presents the ITB Ganesha campus in a fully immersive three-dimensional environment, enabling users to experience the spatial layout and atmosphere of the campus in a realistic and interactive manner. By leveraging 3D visualization technologies, the virtual environment accurately represents buildings, open spaces, and key landmarks.\n\nDesigned especially for new students, the project serves as a digital exploration tool that supports orientation and familiarization with campus facilities. Through this virtual experience, users can navigate academic buildings, public areas, and important locations at their own pace—helping build spatial awareness and confidence before arriving on site.",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=70",
    ],
    externalUrl: "https://example.com",
    info: {
      platform: "WebGL",
      location: "ITB Ganesha",
      type: "Virtual Tour",
    },
  },
  {
    id: "historical-site-reconstruction",
    label: "DIGITAL HERITAGE",
    title: "Historical Site Reconstruction",
    subtitle: "Immersive VR Preservation",
    short:
      "A digital preservation project to rebuild historical sites and let users learn through interactive VR storytelling.",
    description:
      "A VR-first reconstruction initiative that reimagines historical spaces in interactive 3D. Users can explore reconstructed environments, engage with artifacts, and learn through contextual narratives.\n\nThe goal is to make heritage education more engaging and accessible, while preserving cultural value in a digital form.",
    images: [
      "https://www.historytoday.com/sites/default/files/history-matters/archaeology.jpg",
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1500534314209-a26db0f5d3b1?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=70",
    ],
    externalUrl: "https://example.com",
    info: {
      platform: "VR",
      location: "Indonesia",
      type: "Reconstruction",
    },
  },
  {
    id: "ai-driven-npc-interaction",
    label: "AI + XR",
    title: "AI Driven NPC Interaction",
    subtitle: "Conversational NPCs in XR",
    short:
      "Integrating LLMs to create NPCs that can hold dynamic, unscripted conversations in XR environments.",
    description:
      "This project integrates advanced language models to enable non‑playable characters (NPCs) to respond naturally and contextually. The interaction feels less scripted and more human—useful for education, onboarding, and training scenarios in XR.\n\nThe prototype focuses on dialog quality, safety boundaries, and low-latency responses that work comfortably in real-time experiences.",
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=70",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=70",
    ],
    externalUrl: "https://example.com",
    info: {
      platform: "XR",
      location: "Metaverse Lab",
      type: "NPC / AI",
    },
  },
];

export function getProjectById(id) {
  return mockProjects.find((p) => p.id === id);
}