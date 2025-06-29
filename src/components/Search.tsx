import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const SearchContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
`;

const SearchInput = styled(motion.input)`
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SearchIcon = styled(motion.div)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: white;
  opacity: 0.7;
`;

const AIIndicator = styled(motion.div)`
  position: absolute;
  right: -10px;
  top: -10px;
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 242, 254, 0.3);
`;

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isAIActive, setIsAIActive] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
    setIsAIActive(value.length > 0);
  };

  return (
    <SearchContainer>
      <SearchInput
        placeholder="Search tutorials..."
        value={query}
        onChange={handleSearch}
        whileFocus={{ scale: 1.02 }}
      />
      <SearchIcon
        animate={{ rotate: isAIActive ? [0, 360] : 0 }}
        transition={{ duration: 2, repeat: isAIActive ? Infinity : 0 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </SearchIcon>
      <AnimatePresence>
        {isAIActive && (
          <AIIndicator
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            AI
          </AIIndicator>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
};

export default Search; 