import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";
import logo from "@/assets/buildc3-logo.png";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SlideFrom = 'left' | 'right' | 'bottom';

// Off-screen start offsets (in vw/vh units) so cards begin fully out of view.
const slideOffset: Record<SlideFrom, { x?: string; y?: string }> = {
  left: { x: '-100vw' },
  right: { x: '100vw' },
  bottom: { y: '100vh' },
};

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  image?: string;
}

const services: ServiceCard[] = [
  {
    id: '1',
    title: 'Software Development',
    description: 'Custom software solutions tailored to your business needs. From enterprise applications to mobile apps, we build scalable and robust systems.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  {
    id: '2',
    title: 'Website Development',
    description: 'Beautiful, responsive websites that convert visitors into customers.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    id: '3',
    title: 'UI/UX Design',
    description: 'User-centered design that creates meaningful and delightful experiences for your users.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
  },
  {
    id: '4',
    title: 'Fixing Your Vibe Coded Application',
    description: 'Built your app with vibe coding? Before you go live, ask yourself — is it really ready to handle the stress you plan to bring on, and is it fully security optimised? Let us fix that and make your application truly production ready.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  {
    id: '5',
    title: 'AI Agents & Calls Assistant',
    description: 'Intelligent AI-powered assistants that handle customer calls, automate workflows, and provide 24/7 support.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    id: '6',
    title: 'Graphic Designing',
    description: 'Eye-catching visual designs for branding, marketing materials, social media, and print that make your brand stand out.',
    image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80',
  },
];

function ServiceCardItem({
  service,
  className,
  slideFrom = 'left',
  delay = 0,
}: {
  service: ServiceCard;
  className?: string;
  slideFrom?: SlideFrom;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, ...slideOffset[slideFrom] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative rounded-3xl overflow-hidden bg-slate-900 transition-all duration-500",
        className
      )}
    >
      {service.image && (
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>
      )}

      <div className="relative h-full flex flex-col justify-end p-6">
        <div className="text-white">
          <h3 className="font-bold text-lg md:text-xl mb-2 tracking-tight">
            {service.title}
          </h3>
          <p className="text-sm text-white/90 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  // services[0] = Service 1, [1] = Service 2 (left)
  // services[2] = Service 3, [3] = Service 4 (right)
  // services[4] = Service 5, [5] = Service 6 (bottom)
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F3E0' }}>
      <Seo
        title="Services"
        path="/services"
        description="Explore what BuildC3 offers — from product design and development to community-driven building. See how we help you ship faster."
      />
      <SiteHeader position="overlay" />

      <main>
        {/* Mobile: title + simple stacked grid */}
        <div className="lg:hidden pt-24 w-[98vw] mx-auto px-3 pb-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              BuildC3 Services
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <ServiceCardItem
                key={service.id}
                service={service}
                className="min-h-[260px]"
                slideFrom={i % 2 === 0 ? 'left' : 'right'}
                delay={i * 0.12}
              />
            ))}
          </div>
        </div>

        {/* Desktop: full-screen Spline background with cards floating on the borders */}
        <div className="hidden lg:block relative w-screen h-screen overflow-hidden">
          {/* Spline scene as full-bleed background */}
          <div className="absolute inset-0 z-0" style={{ backgroundColor: '#F9F3E0' }}>
            <Suspense fallback={<div className="absolute inset-0" style={{ backgroundColor: '#F9F3E0' }} />}>
              <Spline scene="https://prod.spline.design/IiBFd1OnnlCYOH6u/scene.splinecode" />
            </Suspense>
          </div>

          {/* Cards layered above the scene */}
          <div className="relative z-10 flex gap-4 h-full px-4 pt-24 pb-4 pointer-events-none">
            {/* Left column — Service 1 & 2 */}
            <div className="flex flex-col gap-4 w-56 shrink-0 h-full pointer-events-auto">
              {/* 1st: top-left */}
              <ServiceCardItem service={services[0]} className="flex-1" slideFrom="left" delay={0} />
              {/* 2nd: bottom-left */}
              <ServiceCardItem service={services[1]} className="flex-1" slideFrom="left" delay={0.18} />
            </div>

            {/* Center area — blank, bottom row with logo flanked by wide cards */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1" />
              <div className="flex items-stretch gap-4 mt-4 pointer-events-auto">
                {/* 3rd: bottom line, left */}
                <ServiceCardItem service={services[5]} className="flex-1 min-h-[200px]" slideFrom="bottom" delay={0.36} />
                <div className="shrink-0 flex items-center justify-center px-4">
                  <img src={logo} alt="BuildC3" className="h-20 w-auto" />
                </div>
                {/* 4th: bottom line, right */}
                <ServiceCardItem service={services[4]} className="flex-1 min-h-[200px]" slideFrom="bottom" delay={0.54} />
              </div>
            </div>

            {/* Right column — Service 3 & 4 */}
            <div className="flex flex-col gap-4 w-56 shrink-0 h-full pointer-events-auto">
              {/* 6th: right line, top (last) */}
              <ServiceCardItem service={services[2]} className="flex-1" slideFrom="right" delay={0.9} />
              {/* 5th: right line, lower */}
              <ServiceCardItem service={services[3]} className="flex-1" slideFrom="right" delay={0.72} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
