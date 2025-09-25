let currentCharacterUrl = null;
let isGenerating = false;
let isSpeaking = false;

const characterImg = document.getElementById('character');
const mouthOverlay = document.getElementById('mouthOverlay');
const textInput = document.getElementById('textInput');
const generateBtn = document.getElementById('generateBtn');
const speakBtn = document.getElementById('speakBtn');
const status = document.getElementById('status');

generateBtn.addEventListener('click', generateCharacter);
speakBtn.addEventListener('click', speakText);

async function generateCharacter() {
    if (isGenerating) return;
    
    isGenerating = true;
    generateBtn.disabled = true;
    status.textContent = 'Generating character... This will take about 10 seconds.';
    
    try {
        // Generate the first frame (neutral expression)
        const result1 = await websim.imageGen({
            prompt: "A friendly cartoon character face, neutral expression, clean simple design, bright colors, 2D illustration style",
            width: 512,
            height: 512
        });
        
        currentCharacterUrl = result1.url;
        characterImg.src = currentCharacterUrl;
        
        status.textContent = 'Character generated! Now you can make it talk.';
        textInput.disabled = false;
        speakBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating character:', error);
        status.textContent = 'Error generating character. Please try again.';
    } finally {
        isGenerating = false;
        generateBtn.disabled = false;
    }
}

async function speakText() {
    if (isSpeaking || !textInput.value.trim()) return;
    
    isSpeaking = true;
    speakBtn.disabled = true;
    const text = textInput.value;
    
    try {
        // Generate speech
        status.textContent = 'Generating speech...';
        const ttsResult = await websim.textToSpeech({
            text: text,
            voice: 'en-male'
        });
        
        // Create audio element
        const audio = new Audio(ttsResult.url);
        
        // Start mouth animation
        mouthOverlay.classList.add('talking');
        
        // Play audio
        audio.play();
        
        // Update status
        status.textContent = 'Character is speaking...';
        
        // Stop animation when audio ends
        audio.addEventListener('ended', () => {
            mouthOverlay.classList.remove('talking');
            isSpeaking = false;
            speakBtn.disabled = false;
            status.textContent = 'Ready to speak again!';
        });
        
        // Handle audio errors
        audio.addEventListener('error', () => {
            mouthOverlay.classList.remove('talking');
            isSpeaking = false;
            speakBtn.disabled = false;
            status.textContent = 'Error playing audio. Please try again.';
        });
        
    } catch (error) {
        console.error('Error with TTS:', error);
        mouthOverlay.classList.remove('talking');
        isSpeaking = false;
        speakBtn.disabled = false;
        status.textContent = 'Error generating speech. Please try again.';
    }
}

// Initialize UI state
textInput.disabled = true;
speakBtn.disabled = true;

