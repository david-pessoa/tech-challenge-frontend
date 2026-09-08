import { useEffect, useState } from 'react';
import styled from 'styled-components';
import type { Post } from '../types/Posts';
import { useDebounce } from '../hooks/debounce';
import { searchPost } from '../services/post.service';

const InputContainer = styled.div`
  position: relative;
  background-color: #fde9a06b;
  border-radius: 20px;
  min-height: 2.625rem;
  width: 38rem;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    min-height: 2.438rem;
    padding: 9px;
  }
`;

const InnerInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

const ResultsList = styled.ul`
  position: absolute;
  width: 100%;
  padding: 15px;
  left: 0;
  top: calc(70%);
  box-sizing: border-box;
  z-index: 100;
  list-style: none;
  margin-top: 5px;
  background-color: #fef4d0;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 900px) {
    top: calc(55%);
    padding: 9px
  }
`;

const ListItemLink = styled.a`
  display: flex;
  margin-top: 10px;
  align-items: center;
  gap: 2.5rem;
  color: inherit;
  text-decoration: none;
  height: 2rem;
  border-radius: 15px;

  &:hover {
    background-color: #fbbba3;
  }

  &:active {
    background-color: #e0a7e3;
  }
`;

const ListItem = styled.li`
  display: flex;
  gap: 2.5rem;
  & p {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 15rem;
    white-space: nowrap;
  }
`;

const InputSearch = styled.input`
  border: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

export default function SearchPostContainerInput() {
  const [searchedPostsList, setSearchedPostsList] = useState<Post[]>([]);
  const [searchedText, setSearchedText] = useState('');
  const [hideSearchResults, setHideSearchResults] = useState(true);
  const debouncedQuery = useDebounce(searchedText, 300);

  async function handleInputChange() {
    if (searchedText === '') {
      setSearchedPostsList([]);
      return;
    }
    try {
      const relatedPosts = await searchPost(searchedText);
      setSearchedPostsList(relatedPosts.slice(0, 10));
    } catch (error) {
      setSearchedPostsList([]);
    }
  }

  useEffect(() => {
    if (debouncedQuery) {
      handleInputChange();
    }
  }, [debouncedQuery]);

  return (
    <InputContainer onClick={() => setHideSearchResults(false)}>
      <InnerInputContainer>
        <InputSearch
          type="text"
          placeholder="Pesquise aqui..."
          value={searchedText}
          onChange={e => setSearchedText(e.target.value)}
          onBlur={() => setHideSearchResults(true)}
        />
        <span className="material-symbols-outlined">search</span>
      </InnerInputContainer>
      <ResultsList hidden={hideSearchResults}>
        {searchedPostsList.map((post, i) => (
          <ListItemLink href={`/post/${post.postId}`} target="_blank">
            <ListItem key={i}>
              <p>{post.titulo}</p>
              <p>{post.descricao}</p>
            </ListItem>
          </ListItemLink>
        ))}
      </ResultsList>
    </InputContainer>
  );
}
