import React, { useState } from 'react';
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
  | 'letter'
  | 'timeline'
  | 'message'
  | 'answers'
  | 'voices'
  | 'lovenama'
  | 'finale';

export default function App() {
  const [scene, setScene] = useState<SceneState>('lockscreen');

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-blush">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {scene === 'lockscreen' && (
          <PageWrapper key="scene0">
            <Scene0Lockscreen onNext={() => setScene('loading')} />
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
              onNext={() => setScene('hub')}
              title="Hi Shajer 👋"
              subtitle="I have something to ask you..."
              question="Do you like me?"
            />
          </PageWrapper>
        )}

        {scene === 'hub' && (
          <PageWrapper key="scene-hub">
            <SceneHub 
              onConfession={() => setScene('confession_prompt')}
              onCountdown={() => setScene('countdown')}
              onForever={() => setScene('forever')}
              onLetter={() => setScene('letter')}
              onTimeline={() => setScene('timeline')}
              onMessage={() => setScene('message')}
              onAnswers={() => setScene('answers')}
              onVoices={() => setScene('voices')}
              onLovenama={() => setScene('lovenama')}
            />
          </PageWrapper>
        )}

        {scene === 'countdown' && (
          <PageWrapper key="scene-countdown">
            <SceneCountdown onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'forever' && (
          <PageWrapper key="scene-forever">
            <SceneForever onNext={() => setScene('finale')} />
          </PageWrapper>
        )}
        
        {scene === 'letter' && (
          <PageWrapper key="scene-letter">
            <SceneLetter onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'timeline' && (
          <PageWrapper key="scene-timeline">
            <SceneTimeline onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'message' && (
          <PageWrapper key="scene-message">
            <SceneMessage onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'answers' && (
          <PageWrapper key="scene-answers">
            <SceneAnswers onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'voices' && (
          <PageWrapper key="scene-voices">
            <SceneVoices onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'lovenama' && (
          <PageWrapper key="scene-lovenama">
            <SceneLovenama onNext={() => setScene('finale')} />
          </PageWrapper>
        )}

        {scene === 'confession_prompt' && (
          <PageWrapper key="scene3">
            <QuestionScene 
              onNext={() => setScene('promise1')}
              subtitle="Before I say something else..."
              question="Would you like to hear my confession?"
            />
          </PageWrapper>
        )}

        {scene === 'promise1' && (
          <PageWrapper key="scene4">
            <PromiseScene 
              onNext={() => setScene('remember')}
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
            <Scene5Remember onNext={() => setScene('promise2')} />
          </PageWrapper>
        )}

        {scene === 'promise2' && (
          <PageWrapper key="scene6">
            <PromiseScene 
              onNext={() => setScene('finale')}
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
            <Scene7Finale onRestart={() => setScene('lockscreen')} />
          </PageWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
