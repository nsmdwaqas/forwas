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

export default function App() {
  const [scene, setScene] = useState(0); // Start at lockscreen (0)

  const nextScene = () => setScene(s => s + 1);
  const restart = () => setScene(0); // Restart back to lockscreen

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-blush">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {scene === 0 && (
          <PageWrapper key="scene0">
            <Scene0Lockscreen onNext={nextScene} />
          </PageWrapper>
        )}

        {scene === 1 && (
          <PageWrapper key="scene1">
            <Scene1Loading onNext={nextScene} />
          </PageWrapper>
        )}
        
        {scene === 2 && (
          <PageWrapper key="scene2">
            <QuestionScene 
              onNext={nextScene}
              title="Hi Shajer 👋"
              subtitle="I have something to ask you..."
              question="Do you like me?"
            />
          </PageWrapper>
        )}

        {scene === 3 && (
          <PageWrapper key="scene3">
            <QuestionScene 
              onNext={nextScene}
              subtitle="Before I say something else..."
              question="Would you like to hear my confession?"
            />
          </PageWrapper>
        )}

        {scene === 4 && (
          <PageWrapper key="scene4">
            <PromiseScene 
              onNext={nextScene}
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

        {scene === 5 && (
          <PageWrapper key="scene5">
            <Scene5Remember onNext={nextScene} />
          </PageWrapper>
        )}

        {scene === 6 && (
          <PageWrapper key="scene6">
            <PromiseScene 
              onNext={nextScene}
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

        {scene === 7 && (
          <PageWrapper key="scene7">
            <Scene7Finale onRestart={restart} />
          </PageWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
