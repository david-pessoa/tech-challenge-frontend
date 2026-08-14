import styled from 'styled-components';
import type { Role } from '../types/Roles';

type NewPostsContainerProps = {
  role: Role;
};

export default function NewPostsContainer({ role }: NewPostsContainerProps) {
  function AlunoContainer() {
    return (<>
      <h2>
        Novas Aulas
      </h2>
    </>);
  }
  function ProfessorContainer() {
    return <></>;
  }
  function AdminContainer() {
    return <></>;
  }

  return (
    <div>
      {role === 'PROFESSOR' ? (
        <ProfessorContainer />
      ) : role === 'ALUNO' ? (
        <AlunoContainer />
      ) : (
        <AdminContainer />
      )}
    </div>
  );
}
