import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio | ConvoAI Studio by NR8R",
  description: "Professional conversation studio. Create and manage real-time conversational video sessions with digital replicas.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

