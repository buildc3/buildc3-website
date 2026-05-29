import { TeamCard } from "@/components/TeamCard";
import { useCommunityMembers } from "@/hooks/useCommunityMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/SiteHeader";

const founders = [
  {
    id: "f1",
    name: "Om Gupta",
    role: "Co-Founder",
    image_url: "/Om.PNG",
  },
  {
    id: "f2",
    name: "Arunodoy Banerjee",
    role: "Co-Founder",
    image_url: "https://api.dicebear.com/9.x/initials/svg?seed=AB&backgroundColor=6d28d9&fontColor=ffffff",
  },
];

export default function About() {
  const { data: members = [], isLoading } = useCommunityMembers();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Mission & Idea */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Mission & Idea
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-8">
          Built by builders,<br />for builders.
        </h1>
        <div className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed">
          <p>
            BuildC3 started with a simple frustration — too many great ideas never ship. Talented
            people with real product vision get stuck waiting for the right team, the right time, or
            the right resources. We decided to fix that.
          </p>
          <p>
            Our mission is to compress the time between idea and impact. We bring together builders,
            designers, and operators who are serious about shipping — and we give them everything they
            need to go from 0 to live in two weeks. Not someday. Now.
          </p>
          <p>
            The idea is simple: a community that doesn't just talk about building, but actually builds
            together. Every member gets mentorship from people who've grown real products, deployment
            support so you never get stuck on infra, and a team that holds you accountable to shipping
            fast and getting your first users even faster.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <hr className="border-border" />
      </div>

      {/* Founders */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Founders
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-10">The people behind BuildC3</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {founders.map((founder) => (
            <div key={founder.id} className="group">
              <div className="relative rounded-2xl overflow-hidden bg-card shadow-md border border-border">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={founder.image_url}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-4 py-3 border-t border-border bg-card">
                  <p className="text-sm font-semibold text-foreground leading-tight">{founder.name}</p>
                  <p className="text-xs text-muted-foreground">{founder.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <hr className="border-border" />
      </div>

      {/* Community Members */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            Community
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-10">Meet the community</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No community members yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
