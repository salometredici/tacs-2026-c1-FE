import {
  NotFoundContainer,
  NotFoundCard,
  NotFoundCode,
  NotFoundTitle,
  NotFoundSubtitle,
  NotFoundHomeLink,
} from './NotFoundPage.styles';

export default function NotFoundPage() {
  return (
    <NotFoundContainer>
      <NotFoundCard>
        <NotFoundCode>404</NotFoundCode>
        <NotFoundTitle>Página no encontrada</NotFoundTitle>
        <NotFoundSubtitle>
          La página que buscás no existe o fue movida.
        </NotFoundSubtitle>
        <NotFoundHomeLink to="/">Volver al inicio</NotFoundHomeLink>
      </NotFoundCard>
    </NotFoundContainer>
  );
}
