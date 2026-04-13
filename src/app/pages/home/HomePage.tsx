import { useNavigate } from 'react-router-dom';
import {
  HomeContainer,
  Title,
  Subtitle,
  CardsGrid,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
} from './HomePage.styles';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Title>Bienvenido!</Title>
      <Subtitle>Intercambia figuritas con otros coleccionistas</Subtitle>

      <CardsGrid>
        <Card onClick={() => navigate('/search')}>
          <CardIcon />
          <CardTitle>Búsqueda de Figuritas</CardTitle>
          <CardDescription>
            Busca figuritas por número, jugador, selección o equipo
          </CardDescription>
        </Card>
      </CardsGrid>
    </HomeContainer>
  );
}
