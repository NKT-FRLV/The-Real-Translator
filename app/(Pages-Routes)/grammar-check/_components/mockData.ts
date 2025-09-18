import { GrammarCheckResponse } from "./grammar-schema";

// Идеальный вариант - правильные позиции и корректные изменения
export const perfectMockData: GrammarCheckResponse = {
  correctedText: "Hello, I would like to show you how to code!",
  correctedWithDiffText: "-Helo- +Hello+ , -iiIwould- +I would+ -toyouke- +like+ to -show to how- +show you how+ to code+!",
  // diffMarkers: [],
  changes: [
    {
      type: "replacement",
      original: "привет",
      corrected: "Привет",
      start: 0,
      end: 6
    },
    {
      type: "replacement", 
      original: "какдела",
      corrected: "как дела",
      start: 8,
      end: 15
    },
    {
      type: "replacement",
      original: "думаючто",
      corrected: "думаю, что",
      start: 20,
      end: 28
    },
    {
      type: "replacement",
      original: "хорошаяпогода",
      corrected: "хорошая погода",
      start: 45,
      end: 58
    }
  ],
  errors: [
    {
      id: "1",
      type: "spelling",
      original: "привет",
      corrected: "Привет",
      explanation: "Слово должно начинаться с заглавной буквы, так как это начало предложения.",
      suggestion: "Всегда начинайте предложения с заглавной буквы.",
      severity: "medium",
      position: {
        start: 0,
        end: 6
      }
    },
    {
      id: "2",
      type: "grammar",
      original: "какдела",
      corrected: "как дела",
      explanation: "Слова 'как' и 'дела' должны быть разделены пробелом.",
      suggestion: "Обращайте внимание на пробелы между словами.",
      severity: "high",
      position: {
        start: 8,
        end: 15
      }
    },
    {
      id: "3",
      type: "punctuation",
      original: "думаючто",
      corrected: "думаю, что",
      explanation: "Перед союзом 'что' нужна запятая для разделения частей сложного предложения.",
      suggestion: "Изучите правила пунктуации в сложных предложениях.",
      severity: "medium",
      position: {
        start: 20,
        end: 28
      }
    },
    {
      id: "4",
      type: "grammar",
      original: "хорошаяпогода",
      corrected: "хорошая погода",
      explanation: "Слова 'хорошая' и 'погода' должны быть разделены пробелом.",
      suggestion: "Проверяйте пробелы между словами при написании.",
      severity: "high",
      position: {
        start: 45,
        end: 58
      }
    }
  ]
};

// Проблемный вариант - неправильные позиции и ошибки
export const problematicMockData: GrammarCheckResponse = {
  correctedText: "Hello, I would like to show you how to code!",
  correctedWithDiffText: "-Helo- +Hello+ , -iiIwould- +I would+ -toyouke- +like+ to -show to how- +show you how+ to code+!",
  // diffMarkers: [],
  changes: [
    {
      type: "replacement",
      original: "iiIwould",
      corrected: "I would",
      start: 4,
      end: 11
    },
    {
      type: "replacement",
      original: "toyouke", 
      corrected: "like",
      start: 12,
      end: 8 // Неправильная позиция (end < start)
    },
    {
      type: "replacement",
      original: "show to how",
      corrected: "show you how", 
      start: 20,
      end: 15 // Неправильная позиция (end < start)
    },
    {
      type: "insertion", // Неправильный тип для замены
      original: "code",
      corrected: "code!",
      start: 35,
      end: 39
    }
  ],
  errors: [
    {
      id: "1",
      type: "spelling",
      original: "iiIwould",
      corrected: "I would",
      explanation: "The word 'iiIwould' is misspelled and should be 'I would'.",
      suggestion: "Check your spelling and ensure proper capitalization.",
      severity: "high",
      position: {
        start: 4,
        end: 11
      }
    },
    {
      id: "2", 
      type: "grammar",
      original: "toyouke",
      corrected: "like",
      explanation: "The word 'toyouke' is unclear and should be 'like'.",
      suggestion: "Use clear, standard words to improve readability.",
      severity: "high",
      position: {
        start: 12,
        end: 8 // Неправильная позиция (end < start)
      }
    },
    {
      id: "3",
      type: "clarity", 
      original: "show to how",
      corrected: "show you how",
      explanation: "The phrase 'show to how to code' is unclear and grammatically incorrect. It should be 'show you how to code' to clearly indicate the subject and object.",
      suggestion: "Ensure that the subject and object are clearly stated in your sentences to enhance clarity.",
      severity: "medium",
      position: {
        start: 20,
        end: 15 // Неправильная позиция (end < start)
      }
    },
    {
      id: "4",
      type: "punctuation",
      original: "code", 
      corrected: "code!",
      explanation: "The sentence should end with an exclamation mark to show enthusiasm.",
      suggestion: "Use appropriate punctuation to convey the right tone.",
      severity: "low",
      position: {
        start: 35,
        end: 39
      }
    }
  ]
};

// Исходный текст для тестирования
export const testText = "Hi, iiIwould toyouke to show to how to code";

// Функция для получения моковых данных
export const getMockData = (type: "perfect" | "problematic"): GrammarCheckResponse => {
  return type === "perfect" ? perfectMockData : problematicMockData;
};

// Инструкции по тестированию:
// 1. В GrammarCheckPage.tsx установите useMockData = true
// 2. Введите любой текст и нажмите "Check Grammar"
// 3. Идеальный вариант: все позиции корректные, изменения отображаются правильно
// 4. Проблемный вариант: неправильные позиции, TextDiff показывает fallback
// 5. Для переключения между вариантами измените getMockData("perfect") на getMockData("problematic")
