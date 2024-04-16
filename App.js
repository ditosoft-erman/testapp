import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QUESTIONS_KEY = 'quiz_questions';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Load quiz questions from AsyncStorage when the component mounts
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const sampleQuestions = [
      {
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Rome'],
        correctAnswer: 0, // Index of the correct answer
      },
      {
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['William Shakespeare', 'Jane Austen', 'Leo Tolstoy', 'Charles Dickens'],
        correctAnswer: 3,
      },
      {
        question: 'Who is my crush?',
        options: ['Mae Monterola', 'Angeli Khang', 'Kitty Duterte', 'Via Gonzales'],
        correctAnswer: 0,
      },
      // Add more sample questions here
    ];

    try {
      await AsyncStorage.setItem(QUESTIONS_KEY, JSON.stringify(sampleQuestions));
      setQuestions(sampleQuestions);
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };

  const startQuiz = () => {
    if (userName.trim() !== '') {
      setQuizStarted(true);
    } else {
      alert('Please enter your name');
    }
  };

  const handleAnswer = (optionIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);

    // Check if it's the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Calculate the final score
      const finalScore = calculateScore();
      // Display the final score
      alert(`Hi ${userName}! Your final score is: ${finalScore}`);
      // Restart the quiz
      handleRestart();
    } else {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      const question = questions[i];
      const correctAnswerIndex = question.correctAnswer;
      if (userAnswers[i] === correctAnswerIndex) {
        score += 1;
      }
    }
    return score;
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setUserName('');
    setQuizStarted(false);
  };

  const renderQuestion = () => {
    if (!quizStarted) {
      return (
        <View style={styles.nameInputContainer}>
          <Text style={styles.label}>Enter your name:</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Input name"
          />
          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      const currentQuestion = questions[currentQuestionIndex];
      const score = calculateScore();

      return (
        <View>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.question}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(index)}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {questions.length === 0 ? (
        <Text>Loading questions...</Text>
      ) : (
        renderQuestion()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nameInputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  score: {
    fontSize: 20,
    marginBottom: 10,
  },
});
