import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { SiteHeader } from "@/components/SiteHeader";
import { Seo } from "@/components/Seo";
import logo from "@/assets/buildc3-logo.png";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type { TeamMember } from "@/components/ui/team-showcase";

export default function About() {
  const { data: teamData } = useTeamMembers();

  const teamMembers: TeamMember[] = teamData?.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    description: member.description,
    image: member.image_path,
  })) || [];

  return (
    <div className="overflow-x-hidden w-full min-h-screen">
      <Seo
        title="About"
        path="/about"
        description="Learn about BuildC3 — why we started, what we believe, and the team helping builders turn ideas into shipped products with the community."
      />
      <SiteHeader position="overlay" />
      <CinematicHero 
        brandName="BuildC3"
        logoSrc={logo}
        tagline1="BuildC3"
        tagline2="Build in, with, and for the community."
        heroDescription="BuildC3 started with a simple frustration — too many great ideas never ship. Talented people with real product vision get stuck waiting for the right team, the right time, or the right resources. We decided to fix that."
        cardHeading="Meet the Team"
        cardDescription={
          <>
            <span className="text-[#9F8064] font-semibold">BuildC3</span> brings together 
            builders, designers, and operators who are serious about shipping — and we give 
            them everything they need to go from 0 to live in two weeks.
          </>
        }
        metricValue={40}
        metricLabel="Projects"
        ctaHeading="Start shipping."
        ctaDescription="Be part of a community that doesn't just talk about building — we actually build together."
        deviceType="teamShowcase"
        teamMembers={teamMembers}
      />
    </div>
  );
}
