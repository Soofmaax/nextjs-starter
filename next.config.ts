import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On génère un site entièrement statique (HTML export) pour un hébergement simple sur Netlify.
  // Toutes les routes sont pré-rendues au build (SSG) à partir des fichiers du dossier `content`.
  output: "export",
};

export default nextConfig;
