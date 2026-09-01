# Smart Flashcards

A modern, interactive spaced-repetition flashcard application for learning and mastering vocabulary. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Overview

Smart Flashcards is a web-based vocabulary learning tool that uses the spaced-repetition technique to help you efficiently memorize words and phrases. The application tracks your progress, maintains a day streak counter, and adaptively schedules review sessions based on your performance.

## ✨ Features

### Core Features

- **Add Words**: Create flashcards with word/phrase, meaning/translation, and example sentences
- **Smart Review System**: Cards are scheduled for review based on spaced-repetition algorithm
- **Progress Tracking**: Visual progress bars showing your advancement with each word
- **Level System**: Words progress through levels as you master them (Level 1 → Level 2+)
- **Mastery Tracking**: Monitor how many words you've completely mastered

### Learning Statistics

- **Words Due**: See how many words are ready for review
- **Total Words**: Track your complete vocabulary collection
- **Mastered Words**: View count of words you've mastered
- **Day Streak**: Maintain motivation with a fire streak counter

### Interactive Review

- **Flashcard Flip**: Click cards to reveal answers
- **Text-to-Speech**: Listen to word pronunciation using the browser's speech synthesis
- **Performance Feedback**: Mark cards as "I knew it" or "Still learning"
- **Session Summary**: View detailed statistics after completing a review session

### User Experience

- **Status Messages**: Real-time feedback for all actions (success/error)
- **Responsive Design**: Clean, modern interface optimized for different screen sizes
- **Local Storage**: All data persists in your browser's IndexedDB database
- **No Backend Required**: Fully functional offline application

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or setup required

### Installation

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start adding vocabulary and begin learning!

### File Structure

```
FlashCards/
├── index.html       # Main HTML structure
├── style.css        # Styling and layout
├── script.js        # Application logic
├── images/          # Images folder
│   ├── word.png     # Logo
│   └── all-done.png # Completion icon
└── README.md        # This file
```

## 📚 How to Use

### Adding Words

1. Fill in the "ADD A WORD" form on the home screen:
   - **Word or phrase**: The term you want to learn
   - **Translation or meaning**: The definition or translation
   - **Example sentence**: (Optional) A sentence showing usage
2. Click "+ Add word" to save

### Reviewing Cards

1. You'll see how many words are due for review in the "Ready to review" card
2. Click "Start reviewing" to begin a review session
3. **Front of card**: Shows the word or phrase
   - Click 🔊 Listen to hear pronunciation
   - Click the card to reveal the meaning
4. **Back of card**: Shows meaning and example
   - Click "↻ Still learning" if you need more practice
   - Click "✓ I knew it" if you answered correctly
5. Progress through all due cards

### Managing Your Deck

- Each card in "YOUR DECK" shows:
  - Word and example sentence
  - Progress bar indicating mastery level
  - Current level
  - Delete button (×) to remove the word

### Tracking Progress

- Monitor statistics at the top:
  - Words due today
  - Total vocabulary size
  - Words mastered
  - Current day streak
- Session completion shows:
  - Total words reviewed
  - Recall percentage
  - Cards you knew vs. still learning

## 🎮 Application States

### Home View

- Main dashboard with statistics
- Word management deck
- Add new words form
- Review prompt when words are due

### Review Session

- Full-screen immersive review experience
- Flashcard with flip animation
- Progress counter and bar
- Response buttons and listen option
- End session button

### Completion View

- Session summary with statistics
- Recall percentage
- Known vs. learning breakdown
- Return to deck button

## 💾 Data Storage

The application uses **IndexedDB** (browser's local database) to persist all data:

- No server required
- Data remains even after closing the browser
- All data stored locally on your device
- Seed data includes 5 sample words (Apple, Book, Learn, Travel, Friend)

## 🧮 Spaced Repetition Algorithm

The algorithm works as follows:

1. **Initial Review**: New cards are scheduled for immediate review (15 minutes before current time)
2. **Still Learning**: Adds 5 points to progress, reschedules for ~100 seconds later
3. **Knew It**: Adds 20 points to progress, reschedules for ~100 seconds later
4. **Leveling Up**: Each level requires 40 progress points
   - Level 1 → Level 2+: Word marked as "Mastered"
5. **Day Streak**: Maintained across calendar days for continuous learning motivation

## 🎨 Design Features

- **Color-coded Statistics**: Different colors for different metrics (blue, green, red)
- **Smooth Animations**: Card flip effects and status message slides
- **Accessible Design**: Clear typography and high contrast colors
- **Card-based Layout**: Clean, organized interface with distinct sections
- **Progress Visualization**: Progress bars show mastery at a glance

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: IndexedDB
- **APIs Used**:
  - Web Speech API (for text-to-speech)
  - LocalStorage (for day streak data)
  - IndexedDB (for card data)

## 📱 Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support

## 🌟 Key JavaScript Functions

### CRUD Operations

- `addWord(card)`: Add a new word card
- `getCards()`: Retrieve all cards from database
- `updateCard(card)`: Update card progress and level
- `deleteCard(id)`: Remove a card

### Review Logic

- `startReview()`: Initialize review session
- `showCurrentCard()`: Display current flashcard
- `nextReviewCard()`: Move to next card
- `updateCardProgress()`: Update progress points
- `updateNextReview()`: Schedule next review time

### UI Management

- `showView(view)`: Switch between main views
- `renderCards()`: Render all cards in deck
- `updateStatistics()`: Update displayed statistics
- `showStatusMessage()`: Display feedback messages

### Streak & Stats

- `updateDayStreak()`: Update day streak counter
- `calculateDayStreak()`: Calculate current streak
- `getDueCards()`: Get cards ready for review
- `getMasteredCards()`: Get mastered words

## 💡 Tips for Effective Learning

1. **Consistency**: Review every day to maintain your streak and solidify memory
2. **Example Context**: Include example sentences to understand word usage
3. **Regular Sessions**: Short, frequent sessions are better than long cramming sessions
4. **Focus on Difficulty**: Prioritize words marked "Still learning"
5. **Gradual Expansion**: Add new words regularly while reviewing existing ones

## 🎓 Learning Method

This app implements **Spaced Repetition**, a scientifically-proven learning technique:

- Review information at increasing intervals
- Maximizes long-term retention
- Reduces study time needed
- Helps move information from short-term to long-term memory

## 🐛 Troubleshooting

### Cards not saving?

- Check if browser allows LocalStorage and IndexedDB
- Clear browser cache if data seems corrupted
- Try disabling privacy/incognito mode restrictions

### Text-to-speech not working?

- Ensure your browser supports Web Speech API
- Check system volume settings
- Some browsers require user interaction before first use

### Data lost?

- IndexedDB data persists, but clearing browser data will erase everything
- Consider exporting data periodically if critical

## 📝 Notes

- The application is fully offline-capable
- No personal data is collected or sent to servers
- All data remains on your device
- Perfect for learning languages, technical terms, or any vocabulary

## 🚀 Future Enhancement Ideas

- Export/import vocabulary sets
- Study reminders and notifications
- Multiple decks/categories
- Progress charts and analytics
- Mobile app version
- Shared deck library

## 📄 License

This project is open source and available for personal and educational use.

---

**Built with ❤️ for language learners and vocabulary enthusiasts**
