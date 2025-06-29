import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TutorialCard from './TutorialCard';

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface Tutorial {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
}

interface TutorialGridProps {
  tutorials: Tutorial[];
}

const TutorialGrid: React.FC<TutorialGridProps> = ({ tutorials }) => {
  return (
    <Grid
      variants={container}
      initial="hidden"
      animate="show"
    >
      {tutorials.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          title={tutorial.title}
          description={tutorial.description}
          tags={tutorial.tags}
          href={tutorial.href}
        />
      ))}
    </Grid>
  );
};

export default TutorialGrid; 