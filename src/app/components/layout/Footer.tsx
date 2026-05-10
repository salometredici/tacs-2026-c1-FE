import { FooterContainer, FooterContent, FooterSection, CopyrightSection } from './Footer.styles';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>TACS K3061</h3>
          <p>Plataforma para el intercambio de figuritas del Mundial 2026</p>
        </FooterSection>

        <FooterSection>
          <h3>Repositorios</h3>
          <p><a href="https://github.com/salometredici/tacs-2026-c1-FE/">Repositorio FE</a></p>
          <p><a href="https://github.com/Leo-de-Riv3r/tp1c2026">Repositorio BE</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Wikis</h3>
          <p><a href="https://github.com/salometredici/tacs-2026-c1-FE/wiki">Wiki FE</a></p>
          <p><a href="https://github.com/Leo-de-Riv3r/tp1c2026/wiki">Wiki BE</a></p>
        </FooterSection>

        <FooterSection>
          <h3>TACS</h3>
          <p><a href="https://www.tacs-utn.com.ar/">Página de la materia</a></p>
        </FooterSection>
      </FooterContent>

      <CopyrightSection>
        <p>&copy; 2026 TACS. Todos los derechos reservados (?)</p>
      </CopyrightSection>
    </FooterContainer>
  );
}
