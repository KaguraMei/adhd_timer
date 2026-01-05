/**
 * 音效工具函数
 * 使用 Web Audio API 生成提示音
 */

/**
 * 音效类型
 */
export type SoundType = 'bell' | 'chime' | 'beep' | 'ding' | 'gentle';

/**
 * 播放指定类型的提示音
 * @param type 音效类型
 * @param repeat 重复次数（默认1次）
 */
export function playSound(type: SoundType = 'bell', repeat: number = 1): void {
  const validRepeat = Math.max(1, Math.min(repeat, 5)); // 限制在1-5次之间
  
  for (let i = 0; i < validRepeat; i++) {
    // 每次重复之间间隔1.5秒
    setTimeout(() => {
      switch (type) {
        case 'bell':
          playBellSound();
          break;
        case 'chime':
          playChimeSound();
          break;
        case 'beep':
          playBeepSound();
          break;
        case 'ding':
          playDingSound();
          break;
        case 'gentle':
          playGentleSound();
          break;
        default:
          playBellSound();
      }
    }, i * 1500);
  }
}

/**
 * 播放倒计时结束提示音（默认铃声）
 */
export function playTimerEndSound(): void {
  playBellSound();
}

/**
 * 铃声 - 三个上升音符
 */
function playBellSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const notes = [
      { frequency: 800, startTime: 0, duration: 0.15 },
      { frequency: 1000, startTime: 0.2, duration: 0.15 },
      { frequency: 1200, startTime: 0.4, duration: 0.3 }
    ];
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = note.frequency;
      
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now + note.startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, now + note.startTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, now + note.startTime + note.duration);
      
      oscillator.start(now + note.startTime);
      oscillator.stop(now + note.startTime + note.duration);
    });
  } catch (error) {
    console.error('Failed to play bell sound:', error);
  }
}

/**
 * 钟声 - 单个低沉的音符
 */
function playChimeSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 音符
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    
    oscillator.start(now);
    oscillator.stop(now + 1.5);
  } catch (error) {
    console.error('Failed to play chime sound:', error);
  }
}

/**
 * 哔哔声 - 两个短促的音符
 */
function playBeepSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const beeps = [
      { startTime: 0, duration: 0.1 },
      { startTime: 0.15, duration: 0.1 }
    ];
    
    beeps.forEach(beep => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.value = 880;
      
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0.2, now + beep.startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + beep.startTime + beep.duration);
      
      oscillator.start(now + beep.startTime);
      oscillator.stop(now + beep.startTime + beep.duration);
    });
  } catch (error) {
    console.error('Failed to play beep sound:', error);
  }
}

/**
 * 叮声 - 清脆的单音
 */
function playDingSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 1500;
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } catch (error) {
    console.error('Failed to play ding sound:', error);
  }
}

/**
 * 柔和声 - 温和的和弦
 */
function playGentleSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // C大调和弦 (C-E-G)
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach(frequency => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
      
      oscillator.start(now);
      oscillator.stop(now + 1.2);
    });
  } catch (error) {
    console.error('Failed to play gentle sound:', error);
  }
}

/**
 * 简单的提示音（单音）
 */
export function playBeep(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 800;
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch (error) {
    console.error('Failed to play beep:', error);
  }
}

/**
 * 获取所有可用的音效类型
 */
export function getSoundTypes(): Array<{ value: SoundType; label: string; description: string }> {
  return [
    { value: 'bell', label: '🔔 铃声', description: '三个上升音符，清脆明快' },
    { value: 'chime', label: '🎵 钟声', description: '单个低沉音符，悠扬持久' },
    { value: 'beep', label: '⏰ 哔哔声', description: '两个短促音符，简洁有力' },
    { value: 'ding', label: '✨ 叮声', description: '清脆的单音，轻快活泼' },
    { value: 'gentle', label: '🌸 柔和声', description: '温和的和弦，舒缓放松' }
  ];
}

/**
 * 测试音效是否可用
 */
export function testSound(): boolean {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContext.close();
    return true;
  } catch (error) {
    console.error('Web Audio API not supported:', error);
    return false;
  }
}
