import type { Metadata } from "next";
import { SakuraAdminScreen } from "@/components/appointment/sakura-admin-screen";

export const metadata: Metadata = {
  title: "Sakura Admin | Sakura Needle Tattoo",
  description:
    "Panel privado para gestionar disponibilidad y solicitudes de cita de Sakura Needle Tattoo.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SakuraAdminPage() {
  return <SakuraAdminScreen />;
}
