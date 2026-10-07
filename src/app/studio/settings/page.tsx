import type { Metadata } from "next";
import { SettingsForm } from "@/components/studio/SettingsForm";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { person } from "@/lib/data/site";

export const metadata: Metadata = { title: "Settings" };

export default function StudioSettingsPage() {
  // BACKEND: GET /api/admin/settings for initial values.
  return (
    <>
      <StudioPageHeader eyebrow="Studio" title="Settings" lead="Your public profile, payments, invoices and the emails you want to receive." />
      <SettingsForm defaults={{ name: person.name, email: person.email }} />
    </>
  );
}
