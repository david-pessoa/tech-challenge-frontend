import styled from 'styled-components';

import type { Post } from '../types/Posts';
import { materias } from '../types/Materias';
import { formatarData } from '../utils/functions';
import { useNavigate } from 'react-router-dom';

type ViewedPostsTableProps = {
  dados: Post[];
};

const TableContainer = styled.div`
  width: 100%;
  overflow-x: visible;
  -webkit-overflow-scrolling: touch;
  border-radius: 0.5rem;
  background-color: transparent; 

  @media (max-width: 600px) {
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse; 
  border-radius: 0.5rem;
  overflow: hidden; 
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s; 

  &:hover {
    background-color: #fce7c9a4;
  }
`;

const Td = styled.td`
  max-width: 118px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;

  @media (max-width: 600px) {
    font-size: 10px;
  }
`;

const MateriaContainer = styled.div`
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 900px) {
    max-width: 50px;
  }
`;

type ColorProps = {
  $backgroundColor: string;
  $color: string;
};

const IconContainer = styled.div<ColorProps>`
  height: 60px;
  width: 60px;
  border-radius: 10px;
  color: ${({ $color }) => $color};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;

  @media (max-width: 900px) {
    height: 42px;
    width: 42px;
  }

  @media (max-width: 600px) {
    height: 31px;
    width: 31px;
  }
`;

const Icon = styled.span`
  font-size: 32px;

  @media (max-width: 900px) {
    font-size: 20px;
  }

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

type FontColorProps = {
  $color: string;
};

const MateriaTitle = styled.p<FontColorProps>`
  font-size: 12px;
  color: ${({ $color }) => $color};

  @media (max-width: 900px) {
    font-size: 10px;
  }

  @media (max-width: 600px) {
    font-size: 8px;
  }
`;

export default function ViewedPostsTable({ dados }: ViewedPostsTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>Matérias</th>
            <th>Título</th>
            <th>Descrição</th>
            <th>Data de Criação</th>
            <th>Data de Modificação</th>
            <th>Professor</th>
          </tr>
        </thead>
        <tbody>
          {dados.length === 0 ? (
            <tr>
              <Td colSpan={6}>Não há posts para visualizar</Td>
            </tr>
          ) : (
            dados.map((post, i) => (
              <Tr
                key={i}
                onClick={() => navigate(`/post/${post.postId}`)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/post/${post.postId}`);
                  }
                }}
                role="link"
                tabIndex={0}
              >
                <Td>
                  <MateriaContainer>
                    <IconContainer
                      $backgroundColor={materias[post.subject?.nome ?? 'Geral'].backgroundColor}
                      $color={materias[post.subject?.nome ?? 'Geral'].color}
                    >
                      <Icon className="material-symbols-outlined">
                        {materias[post.subject?.nome ?? 'Geral'].icon}
                      </Icon>
                    </IconContainer>
                    <MateriaTitle $color={materias[post.subject?.nome ?? 'Geral'].color}>
                      {post.subject?.nome ?? 'Geral'}
                    </MateriaTitle>
                  </MateriaContainer>
                </Td>
                <Td className="bold">{post.titulo}</Td>
                <Td>{post.descricao}</Td>
                <Td>{formatarData(post.dataCriacao)}</Td>
                <Td>{formatarData(post.dataModificacao)}</Td>
                <Td>{post.criadoPor?.nome}</Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}