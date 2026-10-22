import type { Metadata } from "next";
import HomeView from "@/components/home/HomeView";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return <HomeView />;
}
