import styled from 'styled-components';
import logo from '../../public/Logo.png';

const FooterContainer = styled.footer`
  background-color: #fff7de;
  width: 100%;
  height: 20.625rem;
  border-radius: 45px 45px 0 0;
  box-shadow: 0px 1px 4px 0px #c0b58b;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  border: 2px solid #d3cbaf;
  box-shadow: 0px 1px 4px 0px #c0b58b;
  width: 90%;
  height: 15.313rem;
  border-radius: 25px;
  padding-top: 1.625rem;
  padding-left: 2.438rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h4`
  font-weight: 500;
  font-size: 1.5rem;
`;

const Paragraph = styled.p`
  font-weight: 400;
  font-size: 0.813rem;
`;

const UpperContainer = styled.div`
  padding-bottom: 1.688rem;
  border-bottom: 2px solid #d3cbaf;
  display: flex;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  padding-top: 1.125rem;
  display: flex;
  justify-content: space-between;
`;

const LinksContainer = styled.div`
  width: 16.563rem;
  display: flex;
  gap: 3.188rem;
  margin-top: 1.063rem;
`;

const OtherLinksList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  text-decoration: underline;
  gap: 10px;
`;

const ListItem = styled.li`
  font-size: 13px;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <Box>
        <UpperContainer>
          <div>
            <LogoContainer>
              <img src={logo} alt="Edify Logo" width={47} height={44} />
              <Title>Edify</Title>
            </LogoContainer>
            <Paragraph>
              O Edify conecta professores e alunos da rede pública, oferecendo um espaço seguro,{' '}
              <br />
              gratuito e divertido para reforço escolar e muito aprendizado.
            </Paragraph>
          </div>
          <LinksContainer>
            <OtherLinksList>
              <ListItem>Como Funciona</ListItem>
              <ListItem>Central de Ajuda</ListItem>
              <ListItem>Suporte Técnico</ListItem>
            </OtherLinksList>
            <OtherLinksList>
              <ListItem>Nossas Matérias</ListItem>
              <ListItem>Dicas de Estudo</ListItem>
              <ListItem>Fale Conosco</ListItem>
            </OtherLinksList>
          </LinksContainer>
        </UpperContainer>
        <BottomContainer>
          <Paragraph>
            &copy; {new Date().getFullYear()} Edify. Todos os direitos reservados.
          </Paragraph>
          <Paragraph>Política de Privacidade | Termos de Uso | Configurações de Cookies</Paragraph>
        </BottomContainer>
      </Box>
    </FooterContainer>
  );
}
