import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Link from 'next/link';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  margin: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.5;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

interface TutorialCardProps {
  title: string;
  description: string;
  tags: string[];
  href: string;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ title, description, tags, href }) => {
  return (
    <Link href={href} passHref>
      <Card
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Title>{title}</Title>
        <Description>{description}</Description>
        <div style={{ marginTop: '1rem' }}>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>
      </Card>
    </Link>
  );
};

export default TutorialCard; 