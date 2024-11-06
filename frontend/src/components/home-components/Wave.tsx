import { FC } from 'react';

import { useCanvasContext } from '../../hooks/useCanvas';
import useResponsiveSize from '../../hooks/useResponsiveSize';
import WaveObj from '../../util/wave';

const Wave: FC = () => {
  const { context } = useCanvasContext();
  const { width } = useResponsiveSize();
  const height = 600;
  let frequency = 0.013;
  let lastTime = 0;
  const waves = {
    frontWave: new WaveObj([0.0211, 0.028, 0.015], 'rgba(90, 180, 198, 0.40)'), 
    backWave: new WaveObj([0.0122, 0.018, 0.005], 'rgba(72, 209, 204, 0.40)'), 
  };

  const render = (time: number) => {
    const deltaTime = time - lastTime;
    lastTime = time;

    context?.clearRect(0, 0, width, height);
    Object.entries(waves).forEach(([, wave]) => {
      wave.draw(context!, width, height, frequency);
    });

    frequency += 0.013 * (deltaTime / 16.67); // 16.67ms is approximately 60fps

    requestAnimationFrame(render);
  };

  if (context) requestAnimationFrame(render);
  return null;
};


export default Wave;