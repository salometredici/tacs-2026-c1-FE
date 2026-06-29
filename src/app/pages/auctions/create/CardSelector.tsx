import { useState } from 'react';
import { CollectionCard } from '../../../interfaces/cards/CollectionCard';
import {
  Field, Label, Hint, SelectableItem, SelectIndicator,
} from '../CreateAuctionPage.styles';
import {
  SearchInput, CardList, CardNum, CardDescription, CardQuantityLabel, EmptyItem,
} from '../../../components/common/styles/cardList.styles';

interface Props {
  collection: CollectionCard[];
  loading: boolean;
  value: string;
  onChange: (cardId: string) => void;
}

export default function CardSelector({ collection, loading, value, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const matchesSearch = (fc: CollectionCard) =>
    fc.cardId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(fc.number).includes(searchQuery);

  const availableCards = collection.filter(fc => fc.available > 0);
  const filteredCards = availableCards.filter(matchesSearch);

  return (
    <Field>
      <Label>Figurita a subastar</Label>
      {loading ? (
        <Hint>Cargando colección...</Hint>
      ) : collection.length === 0 ? (
        <Hint>No tenés figuritas en tu colección</Hint>
      ) : (
        <>
          <SearchInput
            placeholder="Buscar por id, descripción o número..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <CardList>
            {filteredCards.map(fc => {
              const isSelected = value === fc.cardId;
              const available = fc.available;
              return (
                <SelectableItem
                  key={fc.cardId}
                  $selected={isSelected}
                  onClick={() => onChange(fc.cardId)}
                >
                  <SelectIndicator $selected={isSelected}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </SelectIndicator>
                  <CardNum>{fc.cardId}</CardNum>
                  <CardDescription>{fc.description}</CardDescription>
                  <CardQuantityLabel>{available} disp. / {fc.quantity} tot.</CardQuantityLabel>
                </SelectableItem>
              );
            })}
            {filteredCards.length === 0 && (
              <EmptyItem>No tenés figuritas con disponibilidad</EmptyItem>
            )}
          </CardList>
        </>
      )}
    </Field>
  );
}
