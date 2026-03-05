import { TeamCard } from '@/components/TeamCard';
import { useCommunityMembers } from '@/hooks/useCommunityMembers';
import logo from '@/assets/buildc3-logo.png';
import { Skeleton } from '@/components/ui/skeleton';

const MeetCommunity = () => {
  const { data: members = [], isLoading } = useCommunityMembers();

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card shadow-sm">
        <div className="mx-auto flex items-center justify-between px-6 py-3 max-w-7xl">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src={logo} alt="BUILDC3" className="h-10 w-auto" />
            </a>
          </div>
          <nav className="flex items-center gap-7">
            <a
              href="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="/projects"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Projects
            </a>
          </nav>
        </div>
      </header>

      {/* Hero section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-foreground" />
          <span className="text-sm font-medium text-muted-foreground tracking-wide">
            Community
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
          Meet the Community
        </h1>
        <p className="text-base text-muted-foreground max-w-xl">
          Meet the talented individuals who drive our community's success with
          their dedication, expertise, and passion for innovation.
        </p>
      </section>

      {/* Team grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No community members yet. Add some from the admin panel.
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
};

export default MeetCommunity;
