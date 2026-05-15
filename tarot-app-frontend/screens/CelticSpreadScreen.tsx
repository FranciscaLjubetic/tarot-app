import { SPREADS } from '../constants/tarot';
import type { PickedCard, SpreadLayout } from '../types/tarot';
import BaseSpreadScreen from './BaseSpreadScreen';
import { t } from '../i18n';

type CelticSpreadScreenProps = {
  layout: SpreadLayout;
  deckCount: number;
  pickedCards: PickedCard[];
  isShuffling: boolean;
  onShuffle: () => void;
  onPressPosition: (positionId: number) => void;
  onClose: () => void;
};

export default function CelticSpreadScreen(props: CelticSpreadScreenProps) {
  const spread = SPREADS.find((item) => item.type === 'celtic') ?? SPREADS[0];
  return (
    <BaseSpreadScreen
      spreadType="celtic"
      title={t(spread.titleKey)}
      subtitle={t(spread.subtitleKey)}
      description={t(spread.descriptionKey)}
      {...props}
    />
  );
}
