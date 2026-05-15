import { SPREADS } from '../constants/tarot';
import type { PickedCard, SpreadLayout } from '../types/tarot';
import BaseSpreadScreen from './BaseSpreadScreen';
import { t } from '../i18n';

type CircularSpreadScreenProps = {
  layout: SpreadLayout;
  deckCount: number;
  pickedCards: PickedCard[];
  isShuffling: boolean;
  onShuffle: () => void;
  onPressPosition: (positionId: number) => void;
  onClose: () => void;
};

export default function CircularSpreadScreen(props: CircularSpreadScreenProps) {
  const spread = SPREADS.find((item) => item.type === 'circular') ?? SPREADS[0];
  return (
    <BaseSpreadScreen
      spreadType="circular"
      title={t(spread.titleKey)}
      subtitle={t(spread.subtitleKey)}
      description={t(spread.descriptionKey)}
      {...props}
    />
  );
}
