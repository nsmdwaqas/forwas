import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { FloatingHearts } from './components/Background';
import { PageWrapper } from './components/PageWrapper';
import { Scene0Lockscreen } from './components/scenes/Scene0Lockscreen';
import { Scene1Loading } from './components/scenes/Scene1Loading';
import { QuestionScene } from './components/scenes/QuestionScene';
import { PromiseScene } from './components/scenes/PromiseScene';
import { Scene5Remember } from './components/scenes/Scene5Remember';
import { Scene7Finale } from './components/scenes/Scene7Finale';
import { SceneHub } from './components/scenes/SceneHub';
import { SceneCountdown } from './components/scenes/SceneCountdown';
import { SceneForever } from './components/scenes/SceneForever';
import { SceneLetter } from './components/scenes/SceneLetter';
import { SceneLovenama } from './components/scenes/SceneLovenama';
import { SceneTimeline } from './components/scenes/SceneTimeline';
import { SceneMessage } from './components/scenes/SceneMessage';
import { SceneAnswers } from './components/scenes/SceneAnswers';
import { SceneVoices } from './components/scenes/SceneVoices';
import { SceneProposal } from './components/scenes/SceneProposal';
import { SceneOneMonth } from './components/scenes/SceneOneMonth';
import { SceneSong } from './components/scenes/SceneSong';
import { SceneCall } from './components/scenes/SceneCall';
import { SceneNotification } from './components/scenes/SceneNotification';
import { SceneThePromise } from './components/scenes/SceneThePromise';
import { SceneFacetime } from './components/scenes/SceneFacetime';
import { SceneRecurrence } from './components/scenes/SceneRecurrence';
import { SceneApart } from './components/scenes/SceneApart';
import { SceneEgo } from './components/scenes/SceneEgo';
import { SceneShameless } from './components/scenes/SceneShameless';
import { SceneTalk } from './components/scenes/SceneTalk';
import { SceneEmoji } from './components/scenes/SceneEmoji';
import { SceneCommitment } from './components/scenes/SceneCommitment';
import { SceneDirtyTalk } from './components/scenes/SceneDirtyTalk';
import { SceneLoveU } from './components/scenes/SceneLoveU';
import { SceneMissCounter } from './components/scenes/SceneMissCounter';
import { SceneConversation } from './components/scenes/SceneConversation';
import { SceneMidnightCall } from './components/scenes/SceneMidnightCall';
import { SceneOfficeVisit } from './components/scenes/SceneOfficeVisit';
import { SceneBookReader } from './components/scenes/SceneBookReader';
import { trackChapterVisit } from './lib/tracker';
import { supabase } from './lib/supabase';
import {
  registerServiceWorker,
  showLocalPartnerNotification,
  MissAlertPayload
} from './lib/pwaAndPush';

type SceneState = 
  | 'lockscreen' 
  | 'loading' 
  | 'question1' 
  | 'hub' 
  | 'confession_prompt' 
  | 'promise1' 
  | 'remember' 
  | 'promise2' 
  | 'countdown' 
  | 'forever'
  | 'the_promise'
  | 'facetime'
  | 'apart'
  | 'ego'
  | 'shameless'
  | 'talk'
  | 'conversation'
  | 'midnight_call'
  | 'office_visit'
  | 'book_reader'
  | 'emoji'
  | 'commitment'
  | 'dirty_talk'
  | 'love_u'
  | 'miss_counter'
  | 'recurrence'
  | 'letter'
  | 'timeline'
  | 'message'
  | 'proposal'
  | 'song'
  | 'call'
  | 'one_month'
  | 'answers'
  | 'voices'
  | 'lovenama'
  | 'notification'
  | 'finale';

function getInitialScene(): SceneState {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'miss_counter') {
      // Clean URL query param while opening directly into Miss Counter without lockscreen
      window.history.replaceState({}, '', window.location.pathname);
      return 'miss_counter';
    }
  }
  return 'lockscreen';
}

export default function App() {
  const [scene, setScene] = useState<SceneState>(getInitialScene);
  const [sceneHistory, setSceneHistory] = useState<SceneState[]>([]);
  const visitedConfessionRef = useRef(false);

  const navigateTo = (nextScene: SceneState) => {
    setScene((currentScene) => {
      if (currentScene !== nextScene) {
        // Don't push transient loading screen into back history
        const historyEntry = currentScene === 'loading' ? 'lockscreen' : currentScene;
        setSceneHistory((prev) => [...prev, historyEntry]);
      }
      return nextScene;
    });
  };

  const handleGoBack = () => {
    setSceneHistory((prev) => {
      if (prev.length === 0) {
        setScene('hub');
        return prev;
      }
      const nextHistory = [...prev];
      const previousScene = nextHistory.pop()!;
      setScene(previousScene);
      return nextHistory;
    });
  };

  // Register Service Worker, handle notification click navigation, and listen for live partner misses
  useEffect(() => {
    registerServiceWorker();

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OPEN_MISS_COUNTER') {
        navigateTo('miss_counter');
      }
    };

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Listen to Supabase Realtime broadcast for instant partner miss notifications
    const channel = supabase
      .channel('miss-counter-live-alerts', {
        config: { broadcast: { self: false } }
      })
      .on('broadcast', { event: 'miss-heartbeat' }, ({ payload }) => {
        if (payload) {
          showLocalPartnerNotification(payload as MissAlertPayload, () => {
            navigateTo('miss_counter');
          });
        }
      })
      .subscribe();

    // Poll /api/push/latest as a resilient fallback for open/background tabs
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/push/latest');
        if (res.ok) {
          const data = await res.json();
          if (data?.latestAlert) {
            const alertAgeMs = Date.now() - new Date(data.latestAlert.createdAt).getTime();
            if (alertAgeMs >= 0 && alertAgeMs < 60 * 1000) {
              showLocalPartnerNotification(data.latestAlert as MissAlertPayload, () => {
                navigateTo('miss_counter');
              });
            }
          }
        }
      } catch {
        // ignore network errors during background poll
      }
    }, 5000);

    return () => {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, []);

  // Silent chapter visit tracking in Supabase WSStats (no UI display)
  useEffect(() => {
    const sceneToChapterMap: Partial<Record<SceneState, string>> = {
      question1: 'LikeMe',
      timeline: 'Timeline',
      message: 'Message',
      voices: 'Voices',
      call: 'Call',
      facetime: 'Facetime',
      apart: 'Apart',
      ego: 'Ego',
      shameless: 'Shameless',
      talk: 'talk',
      conversation: 'Conversation ',
      midnight_call: 'MidnightCall ',
      office_visit: 'theOfficeVisit',
      emoji: 'emoji',
      commitment: 'commitment ',
      dirty_talk: 'DirtyTalk ',
      love_u: 'LoveU ',
      miss_counter: 'MissCounter ',
      letter: 'Letter',
      answers: 'Answers',
      forever: 'Forever',
      the_promise: 'Promise',
      recurrence: 'Recurrence',
      countdown: 'BigDay',
      proposal: 'Proposal',
      song: 'Song',
      lovenama: 'Lovenama',
      notification: 'Notification'
    };

    if (scene === 'confession_prompt') {
      visitedConfessionRef.current = true;
      trackChapterVisit('Confession');
    } else if (scene === 'promise1') {
      if (!visitedConfessionRef.current) {
        trackChapterVisit('Confession');
      }
    } else {
      visitedConfessionRef.current = false;
      const chapter = sceneToChapterMap[scene];
      if (chapter) {
        trackChapterVisit(chapter);
      }
    }
  }, [scene]);

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-blush">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {scene === 'lockscreen' && (
          <PageWrapper key="scene0">
            <Scene0Lockscreen onNext={() => navigateTo('loading')} />
          </PageWrapper>
        )}

        {scene === 'loading' && (
          <PageWrapper key="scene1">
            <Scene1Loading onNext={() => setScene('question1')} />
          </PageWrapper>
        )}
        
        {scene === 'question1' && (
          <PageWrapper key="scene2">
            <QuestionScene 
              onNext={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('ws_hub_category');
                }
                navigateTo('hub');
              }}
              title="Hi Shajer 👋"
              subtitle="I have something to ask you..."
              question="Do you like me?"
            />
          </PageWrapper>
        )}

        {scene === 'hub' && (
          <PageWrapper key="scene-hub">
            <SceneHub 
              onConfession={() => navigateTo('confession_prompt')}
              onCountdown={() => navigateTo('countdown')}
              onForever={() => navigateTo('forever')}
              onLetter={() => navigateTo('letter')}
              onTimeline={() => navigateTo('timeline')}
              onMessage={() => navigateTo('message')}
              onProposal={() => navigateTo('proposal')}
              onSong={() => navigateTo('song')}
              onCall={() => navigateTo('call')}
              onOneMonth={() => navigateTo('one_month')}
              onAnswers={() => navigateTo('answers')}
              onVoices={() => navigateTo('voices')}
              onLovenama={() => navigateTo('lovenama')}
              onNotification={() => navigateTo('notification')}
              onThePromise={() => navigateTo('the_promise')}
              onFacetime={() => navigateTo('facetime')}
              onRecurrence={() => navigateTo('recurrence')}
              onApart={() => navigateTo('apart')}
              onEgo={() => navigateTo('ego')}
              onShameless={() => navigateTo('shameless')}
              onTalk={() => navigateTo('talk')}
              onConversation={() => navigateTo('conversation')}
              onMidnightCall={() => navigateTo('midnight_call')}
              onOfficeVisit={() => navigateTo('office_visit')}
              onEmoji={() => navigateTo('emoji')}
              onCommitment={() => navigateTo('commitment')}
              onDirtyTalk={() => navigateTo('dirty_talk')}
              onLoveU={() => navigateTo('love_u')}
              onMissCounter={() => navigateTo('miss_counter')}
              onOpenGiftBook={() => navigateTo('book_reader')}
            />
          </PageWrapper>
        )}

        {scene === 'book_reader' && (
          <PageWrapper key="scene-book-reader">
            <SceneBookReader onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'conversation' && (
          <PageWrapper key="scene-conversation">
            <SceneConversation onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'midnight_call' && (
          <PageWrapper key="scene-midnight-call">
            <SceneMidnightCall onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'office_visit' && (
          <PageWrapper key="scene-office-visit">
            <SceneOfficeVisit onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'miss_counter' && (
          <PageWrapper key="scene-miss-counter">
            <SceneMissCounter onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'love_u' && (
          <PageWrapper key="scene-love-u">
            <SceneLoveU onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'dirty_talk' && (
          <PageWrapper key="scene-dirty-talk">
            <SceneDirtyTalk onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'commitment' && (
          <PageWrapper key="scene-commitment">
            <SceneCommitment onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'emoji' && (
          <PageWrapper key="scene-emoji">
            <SceneEmoji onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'talk' && (
          <PageWrapper key="scene-talk">
            <SceneTalk onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'shameless' && (
          <PageWrapper key="scene-shameless">
            <SceneShameless onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'ego' && (
          <PageWrapper key="scene-ego">
            <SceneEgo onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'apart' && (
          <PageWrapper key="scene-apart">
            <SceneApart onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'recurrence' && (
          <PageWrapper key="scene-recurrence">
            <SceneRecurrence onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'facetime' && (
          <PageWrapper key="scene-facetime">
            <SceneFacetime onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'the_promise' && (
          <PageWrapper key="scene-the-promise">
            <SceneThePromise onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'notification' && (
          <PageWrapper key="scene-notification">
            <SceneNotification onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'countdown' && (
          <PageWrapper key="scene-countdown">
            <SceneCountdown onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'forever' && (
          <PageWrapper key="scene-forever">
            <SceneForever onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}
        
        {scene === 'letter' && (
          <PageWrapper key="scene-letter">
            <SceneLetter onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'timeline' && (
          <PageWrapper key="scene-timeline">
            <SceneTimeline onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'message' && (
          <PageWrapper key="scene-message">
            <SceneMessage onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'proposal' && (
          <PageWrapper key="scene-proposal">
            <SceneProposal onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'song' && (
          <PageWrapper key="scene-song">
            <SceneSong onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'call' && (
          <PageWrapper key="scene-call">
            <SceneCall onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'one_month' && (
          <PageWrapper key="scene-one-month">
            <SceneOneMonth onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'answers' && (
          <PageWrapper key="scene-answers">
            <SceneAnswers onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'voices' && (
          <PageWrapper key="scene-voices">
            <SceneVoices onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'lovenama' && (
          <PageWrapper key="scene-lovenama">
            <SceneLovenama onNext={() => navigateTo('finale')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'confession_prompt' && (
          <PageWrapper key="scene3">
            <QuestionScene 
              onNext={() => navigateTo('promise1')}
              onBack={handleGoBack}
              subtitle="Before I say something else..."
              question="Would you like to hear my confession?"
            />
          </PageWrapper>
        )}

        {scene === 'promise1' && (
          <PageWrapper key="scene4">
            <PromiseScene 
              onNext={() => navigateTo('remember')}
              onBack={handleGoBack}
              title="My Promise to You"
              timestamp="I said at 8 Sept 2026, 00:00"
              lines={[
                "Shajer,",
                "I promise to try my best, every single day, to make you happy.",
                "I pray we stay together till the end, through every high and every low.",
                "Let's tackle it all as one team.",
                "I could never picture anyone else beside me.",
                "You hold the most special place in my heart."
              ]}
            />
          </PageWrapper>
        )}

        {scene === 'remember' && (
          <PageWrapper key="scene5">
            <Scene5Remember onNext={() => navigateTo('promise2')} onBack={handleGoBack} />
          </PageWrapper>
        )}

        {scene === 'promise2' && (
          <PageWrapper key="scene6">
            <PromiseScene 
              onNext={() => navigateTo('finale')}
              onBack={handleGoBack}
              title="Your Promise to Me"
              timestamp="She said on 7 Sept 2026, 17:00"
              lines={[
                "I promise to stay with you till the very end of my life.",
                "No matter the circumstances, every up and every down, we'll face it together.",
                "I will never leave you alone in anything.",
                "We'll be each other's better half,",
                "and build a life that's loving, peaceful, and full of respect. 💞"
              ]}
            />
          </PageWrapper>
        )}

        {scene === 'finale' && (
          <PageWrapper key="scene7">
            <Scene7Finale
              onRestart={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('ws_hub_category');
                }
                setSceneHistory([]);
                setScene('lockscreen');
              }}
              onBack={handleGoBack}
            />
          </PageWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
