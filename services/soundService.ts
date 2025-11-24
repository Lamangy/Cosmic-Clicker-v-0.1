
let audioCtx: AudioContext | null = null;
let masterVolume = 0.5;

const initAudio = () => {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser");
        }
    }
};

export const setMasterVolume = (volume: number) => {
    masterVolume = Math.max(0, Math.min(1, volume));
    if (volume > 0 && (!audioCtx || audioCtx.state === 'suspended')) {
        initAudio();
        audioCtx?.resume();
    }
};

export const getMasterVolume = () => masterVolume;

export type SoundType = 'click' | 'crit' | 'upgrade' | 'epoch' | 'event' | 'achievement' | 'prestige_upgrade' | 'secret_found' | 'comet_click';

export const playSound = (type: SoundType) => {
    if (masterVolume <= 0 || !audioCtx) {
        return;
    }

    const now = audioCtx.currentTime;
    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.setValueAtTime(masterVolume, now);

    switch (type) {
        case 'click': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(masterGain);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
        }
        case 'crit': {
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.connect(gain1);
            gain1.connect(masterGain);
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(980, now);
            gain1.gain.setValueAtTime(1, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc1.start(now);
            osc1.stop(now + 0.2);
            
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(masterGain);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(220, now);
            gain2.gain.setValueAtTime(0.8, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc2.start(now);
            osc2.stop(now + 0.2);
            break;
        }
        case 'upgrade': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(masterGain);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.8, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        }
         case 'prestige_upgrade': {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(masterGain);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.9, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.frequency.setValueAtTime(220, now); // Lower pitch
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.5);
            break;
        }
        case 'epoch': {
            const notes = [392, 523, 659, 784];
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(masterGain);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                const startTime = now + i * 0.1;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.7, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
                osc.start(startTime);
                osc.stop(startTime + 0.3);
            });
            break;
        }
        case 'achievement': {
            masterGain.gain.setValueAtTime(0.7 * masterVolume, now); // A bit louder
            const notes = [523, 659, 784, 1046, 1318]; // C Major arpeggio up to E6
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(masterGain);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                const startTime = now + i * 0.08;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.9, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6); // Longer tail
                osc.start(startTime);
                osc.stop(startTime + 0.6);
            });
            break;
        }
        case 'event': {
             const osc = audioCtx.createOscillator();
             const gain = audioCtx.createGain();
             osc.connect(gain);
             gain.connect(masterGain);
             osc.type = 'sawtooth';
             gain.gain.setValueAtTime(0, now);
             gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
             osc.frequency.setValueAtTime(110, now);
             osc.frequency.exponentialRampToValueAtTime(90, now + 0.8);
             osc.start(now);
             osc.stop(now + 0.8);
            break;
        }
        case 'secret_found': {
            masterGain.gain.setValueAtTime(0.8 * masterVolume, now);
            const notes = [523, 784, 1046, 1318]; // C5, G5, C6, E6
            notes.forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(masterGain);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                const startTime = now + i * 0.05;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.6, startTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);
                osc.start(startTime);
                osc.stop(startTime + 1.0);
            });
            break;
        }
        case 'comet_click': {
             masterGain.gain.setValueAtTime(0.6 * masterVolume, now);
             const osc = audioCtx.createOscillator();
             const gain = audioCtx.createGain();
             osc.connect(gain);
             gain.connect(masterGain);
             osc.type = 'sine';
             
             // Rapid ascending slide
             osc.frequency.setValueAtTime(800, now);
             osc.frequency.linearRampToValueAtTime(1600, now + 0.1);
             
             gain.gain.setValueAtTime(0, now);
             gain.gain.linearRampToValueAtTime(0.8, now + 0.05);
             gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
             
             osc.start(now);
             osc.stop(now + 0.3);
             break;
        }
    }
};
