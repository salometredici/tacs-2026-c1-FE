import {
  FooterContainer,
  FooterContent,
  FooterSection,
  CopyrightSection,
} from './Footer.styles';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>TACS</h3>
          <p>Plataforma de intercambio de figuritas del Mundial 2026</p>
        </FooterSection>

        <FooterSection>
          <h3>Ayuda</h3>
          <p><a href="#help">Preguntas Frecuentes</a></p>
          <p><a href="#guide">Guía de Uso</a></p>
          <p><a href="#contact">Contacto</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Legal</h3>
          <p><a href="#terms">Términos de Servicio</a></p>
          <p><a href="#privacy">Política de Privacidad</a></p>
        </FooterSection>

        <FooterSection>
          <h3>Síguenos</h3>
          <p><a href="#twitter">Twitter</a></p>
          <p><a href="#instagram">Instagram</a></p>
          <p><a href="#discord">Discord</a></p>
        </FooterSection>
      </FooterContent>

      <CopyrightSection>
        <p>&copy; 2026 TACS. Todos los derechos reservados.</p>
      </CopyrightSection>
    </FooterContainer>
  );
}
