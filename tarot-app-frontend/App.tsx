import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  CARD_ASSETS,
  DEFAULT_API_URL,
  PREVIEW_CARDS,
  SPREADS,
  SPREAD_LAYOUTS,
} from './constants/tarot';
import type {
  ChatMessage,
  PickedCard,
  SessionResponse,
  SpreadType,
} from './types/tarot';
import styles from './styles/appStyles';
import CelticSpreadScreen from './screens/CelticSpreadScreen';
import CircularSpreadScreen from './screens/CircularSpreadScreen';
import SimpleSpreadScreen from './screens/SimpleSpreadScreen';
import {
  cleanApiUrl,
  getErrorMessage,
  getSelectedSpread,
  getShuffledIds,
  getSpreadCardCount,
  readJson,
  shouldTriggerSpread,
} from './utils/tarotHelpers';
import { getLocale, setLocale, t } from './i18n';

// ...existing code...

export default function App() {
  const scrollRef = useRef<ScrollView>(null);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('rapid');
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [draft, setDraft] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [deckCards, setDeckCards] = useState<number[]>([]);
  const [pickedCards, setPickedCards] = useState<PickedCard[]>([]);
  const [isSpreadVisible, setIsSpreadVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocaleState] = useState(getLocale());

  const nextLocale = locale.startsWith('es') ? 'en' : 'es';
  const nextLocaleLabel =
    nextLocale === 'es' ? t('language.spanish') : t('language.english');
  const toggleLabel = t('language.switchTo', { locale: nextLocaleLabel });

  const messages = useMemo<ChatMessage[]>(() => {
    if (!session) {
      return [
        {
          role: 'assistant',
          content: t('welcome.prompt'),
        },
      ];
    }

    return session.messages;
  }, [session, locale]);

  async function createSession() {
    setIsBusy(true);
    setError(null);
    setDeckCards([]);
    setPickedCards([]);
    setIsSpreadVisible(false);

    try {
      const response = await fetch(`${cleanApiUrl(apiUrl)}/sessions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          spreadType: getSelectedSpread(selectedSpread).backendType,
          deckId: 'cyberpunk',
        }),
      });
      const payload = (await readJson(response)) as SessionResponse;
      setSession(payload);
      setDraft('');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsBusy(false);
      scrollToBottom();
    }
  }

  async function sendMessage() {
    const content = draft.trim();

    if (!content || !session || isBusy) {
      return;
    }

    const optimisticSession: SessionResponse = {
      ...session,
      messages: [
        ...session.messages,
        {
          role: 'user',
          content,
        },
      ],
    };

    setSession(optimisticSession);
    setDraft('');
    setIsBusy(true);
    setError(null);
    scrollToBottom();

    try {
      const response = await fetch(
        `${cleanApiUrl(apiUrl)}/sessions/${session.session_id}/messages`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content }),
        },
      );
      const payload = (await readJson(response)) as {
        session: SessionResponse;
      };
      setSession(payload.session);

      if (
        shouldTriggerSpread(
          content,
          payload.session,
          pickedCards.length > 0,
          isShuffling,
        )
      ) {
        await setupSpread(payload.session);
      }
    } catch (caughtError) {
      setSession(session);
      setError(getErrorMessage(caughtError));
    } finally {
      setIsBusy(false);
      scrollToBottom();
    }
  }

  async function setupSpread(currentSession: SessionResponse) {
    setIsSpreadVisible(true);
    setPickedCards([]);
    await shuffleDeck(currentSession);
  }

  async function shuffleDeck(currentSession: SessionResponse | null = session) {
    if (!currentSession) {
      return;
    }

    setIsShuffling(true);

    try {
      const shuffleResponse = await fetch(
        `${cleanApiUrl(apiUrl)}/tarot/deck/shuffle?deckId=${currentSession.deck_id}&spreadType=${currentSession.spread_type}`,
      );
      const shufflePayload = (await readJson(shuffleResponse)) as unknown;
      const shuffledIds = getShuffledIds(shufflePayload);
      setDeckCards(
        shuffledIds.length ? shuffledIds : buildFallbackDeck(),
      );
    } catch (caughtError) {
      setDeckCards(buildFallbackDeck());
      setError(getErrorMessage(caughtError));
    } finally {
      setIsShuffling(false);
    }
  }

  function handlePositionPress(positionId: number) {
    const existing = pickedCards.find((card) => card.position === positionId);

    if (existing) {
      setPickedCards((current) =>
        current.filter((card) => card.position !== positionId),
      );
      setDeckCards((current) => [existing.id, ...current]);
      return;
    }

    if (deckCards.length === 0) {
      setError(t('spread.noCards'));
      return;
    }

    const [nextCard, ...restDeck] = deckCards;
    setDeckCards(restDeck);
    setPickedCards((current) => [...current, { id: nextCard, position: positionId }]);
  }

  function closeSpreadScreen() {
    setIsSpreadVisible(false);
  }

  if (isSpreadVisible) {
    const layout = SPREAD_LAYOUTS[selectedSpread];
    const screenProps = {
      deckCount: deckCards.length,
      isShuffling,
      layout,
      pickedCards,
      onClose: closeSpreadScreen,
      onPressPosition: handlePositionPress,
      onShuffle: () => shuffleDeck(),
    };

    if (selectedSpread === 'celtic') {
      return <CelticSpreadScreen {...screenProps} />;
    }

    if (selectedSpread === 'circular') {
      return <CircularSpreadScreen {...screenProps} />;
    }

    return <SimpleSpreadScreen {...screenProps} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.screen}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>{t('app.title')}</Text>
            <Text style={styles.title}>{t('app.subtitle')}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => {
                setLocale(nextLocale);
                setLocaleState(nextLocale);
              }}
              style={styles.languageToggle}
            >
              <Text style={styles.languageToggleText}>{toggleLabel}</Text>
            </Pressable>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>
                {session?.current_status ?? t('app.status.noSession')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.apiPanel}>
          <Text style={styles.label}>{t('app.backendLabel')}</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setApiUrl}
            placeholder={t('app.backendPlaceholder')}
            placeholderTextColor="#6f6a7f"
            style={styles.apiInput}
            value={apiUrl}
          />
        </View>

        <View style={styles.cardRail}>
          {PREVIEW_CARDS.map((card, index) => (
            <Image
              key={index}
              resizeMode="cover"
              source={card}
              style={[
                styles.previewCard,
                index % 2 === 0 ? styles.previewCardHigh : null,
              ]}
            />
          ))}
        </View>

        <View style={styles.spreadRow}>
          {SPREADS.map((spread) => {
            const isSelected = selectedSpread === spread.type;

            return (
              <Pressable
                key={spread.type}
                onPress={() => setSelectedSpread(spread.type)}
                style={[styles.spreadButton, isSelected && styles.spreadActive]}
              >
                <Text
                  style={[
                    styles.spreadTitle,
                    isSelected && styles.spreadTextActive,
                  ]}
                >
                  {t(spread.titleKey)}
                </Text>
                <Text style={styles.spreadSubtitle}>{t(spread.subtitleKey)}</Text>
                <Text style={styles.spreadPositions}>{t(spread.positionsKey)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          disabled={isBusy}
          onPress={createSession}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && !isBusy ? styles.buttonPressed : null,
            isBusy ? styles.buttonDisabled : null,
          ]}
        >
          {isBusy && !session ? (
            <ActivityIndicator color="#10051e" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {session ? t('app.resetSession') : t('app.openSession')}
            </Text>
          )}
        </Pressable>

        <View style={styles.chatPanel}>
          <ScrollView
            contentContainerStyle={styles.chatContent}
            ref={scrollRef}
          >
            {messages.map((message, index) => {
              const isUser = message.role === 'user';

              return (
                <View
                  key={`${message.role}-${index}-${message.content.slice(0, 8)}`}
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text style={styles.messageRole}>
                    {isUser ? t('chat.you') : t('chat.reader')}
                  </Text>
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              );
            })}
            {isBusy && session ? (
              <View style={[styles.messageBubble, styles.assistantBubble]}>
                <Text style={styles.messageRole}>{t('chat.reader')}</Text>
                <View style={styles.typingRow}>
                  <ActivityIndicator color="#7df9ff" />
                  <Text style={styles.typingText}>{t('chat.typing')}</Text>
                </View>
              </View>
            ) : null}
          </ScrollView>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.composer}>
            <TextInput
              editable={Boolean(session) && !isBusy}
              multiline
              onChangeText={setDraft}
              placeholder={
                session
                  ? t('chat.inputPlaceholder')
                  : t('chat.inputDisabled')
              }
              placeholderTextColor="#817a92"
              style={styles.composerInput}
              value={draft}
            />
            <Pressable
              disabled={!session || !draft.trim() || isBusy}
              onPress={sendMessage}
              style={({ pressed }) => [
                styles.sendButton,
                pressed && !isBusy ? styles.buttonPressed : null,
                (!session || !draft.trim() || isBusy) && styles.sendDisabled,
              ]}
            >
              <Text style={styles.sendButtonText}>{t('chat.send')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }

  function buildFallbackDeck() {
    const deck = Object.keys(CARD_ASSETS).map((key) => Number(key));
    return deck.sort(() => Math.random() - 0.5);
  }
}


