import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import HeroText from '@/components/ui/hero-shutter-text';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950">
      <HeroText text="BUILDC3">
        {/* CTA Button - positioned below the hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
          className="mt-8 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, gap: "1rem" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/projects')}
            className="group flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg tracking-tight shadow-2xl shadow-white/10 transition-all duration-300 hover:shadow-white/20"
          >
            See All Projects
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-6 text-zinc-500 text-sm uppercase tracking-[0.3em] font-semibold z-20"
        >
          Creative Portfolio & Projects
        </motion.p>
      </HeroText>
    </div>
  );
};

export default Homepage;
