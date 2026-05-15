import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { CARD_ASSETS } from '../constants/tarot';
import type {
  PickedCard,
  SpreadLayout,
  SpreadPosition,
  SpreadType,
} from '../types/tarot';
import styles from '../styles/appStyles';
import { t } from '../i18n';

type BaseSpreadScreenProps = {
  spreadType: SpreadType;
  title: string;
  subtitle: string;
  description: string;
  layout: SpreadLayout;
  deckCount: number;
  pickedCards: PickedCard[];
  isShuffling: boolean;
  onShuffle: () => void;
  onPressPosition: (positionId: number) => void;
  onClose: () => void;
};

export default function BaseSpreadScreen({
  spreadType,
  title,
  subtitle,
  description,
  layout,
  deckCount,
  pickedCards,
  isShuffling,
  onShuffle,
  onPressPosition,
  onClose,
}: BaseSpreadScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.spreadScreenHeader}>
        <View>
          <Text style={styles.kicker}>{t('spread.active')}</Text>
          <Text style={styles.spreadScreenTitle}>{title}</Text>
          <Text style={styles.spreadScreenSubtitle}>{subtitle}</Text>
          <Text style={styles.spreadScreenDescription}>{description}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.spreadCloseButton}>
          <Text style={styles.spreadCloseText}>{t('actions.close')}</Text>
        </Pressable>
      </View>

      <View style={styles.spreadScreenControls}>
        <Pressable
          onPress={onShuffle}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          {isShuffling ? (
            <ActivityIndicator color="#10051e" />
          ) : (
            <Text style={styles.primaryButtonText}>{t('spread.shuffle')}</Text>
          )}
        </Pressable>
        <View style={styles.deckInfo}>
          <View style={styles.deckCard}>
            <Text style={styles.deckCardText}>{t('spread.deck')}</Text>
            <Text style={styles.deckCardCount}>{deckCount}</Text>
          </View>
          <Text style={styles.deckHint}>{t('spread.tapHint')}</Text>
        </View>
      </View>

      <View style={styles.spreadLayoutCard}>
        <View style={styles.spreadLayoutImage}>
          {renderWireframe(spreadType)}
          {layout.positions.map((position: SpreadPosition) => {
            const placed = pickedCards.find(
              (card) => card.position === position.id,
            );
            const cardImage = placed ? CARD_ASSETS[placed.id] : undefined;

            return (
              <Pressable
                key={position.id}
                onPress={() => onPressPosition(position.id)}
                style={({ pressed }) => [
                  styles.spreadPosition,
                  {
                    left: `${position.x * 100}%`,
                    top: `${position.y * 100}%`,
                  },
                  pressed ? styles.spreadPositionPressed : null,
                ]}
              >
                {cardImage ? (
                  <Image
                    source={cardImage}
                    resizeMode="cover"
                    style={styles.spreadPositionImage}
                  />
                ) : (
                  <View style={styles.spreadPositionPlaceholder}>
                    <Text style={styles.spreadPositionLabel}>{position.label}</Text>
                    {placed ? (
                      <Text style={styles.spreadPositionCardId}>#{placed.id}</Text>
                    ) : null}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function renderWireframe(spreadType: SpreadType) {
  switch (spreadType) {
    case 'celtic':
      return (
        <View pointerEvents="none" style={styles.spreadWireframeContainer}>
          <View style={styles.spreadWireframeCrossVertical} />
          <View style={styles.spreadWireframeCrossHorizontal} />
          <View style={styles.spreadWireframeColumn} />
        </View>
      );
    case 'circular':
      return (
        <View pointerEvents="none" style={styles.spreadWireframeContainer}>
          <View style={styles.spreadWireframeCircle} />
        </View>
      );
    case 'rapid':
    default:
      return (
        <View pointerEvents="none" style={styles.spreadWireframeContainer}>
          <View style={styles.spreadWireframeRow} />
          <View style={styles.spreadWireframeRowBottom} />
        </View>
      );
  }
}
