// Pre-built lessons for New Round-Up Starter English Grammar Book
export interface Exercise {
  type: 'fill_blank' | 'multiple_choice' | 'sentence_correction' | 'rewrite' | 'match'
  question: string
  answer?: string
  options?: string[]
  correct?: string
  explanation?: string
}

export interface Lesson {
  id: string
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
}

export const newRoundUpLessons: Lesson[] = [
  {
    id: 'unit-1',
    unit: 1,
    title: 'To Be: Present Simple',
    explanation: 'The verb "to be" is used to describe states, conditions, and existence. In present simple, we use "am", "is", or "are" depending on the subject.',
    examples: [
      'I am a student.',
      'She is from Spain.',
      'They are happy today.',
      'He is tall and strong.',
      'We are in the classroom.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'I ___ a teacher.',
        answer: 'am',
        explanation: 'With "I", we use "am".'
      },
      {
        type: 'fill_blank',
        question: 'She ___ 25 years old.',
        answer: 'is',
        explanation: 'With "he/she/it", we use "is".'
      },
      {
        type: 'fill_blank',
        question: 'They ___ my friends.',
        answer: 'are',
        explanation: 'With "they/you/we", we use "are".'
      },
      {
        type: 'multiple_choice',
        question: '___ you from Italy?',
        options: ['Am', 'Is', 'Are'],
        correct: 'Are',
        explanation: 'With "you", we use "are".'
      },
      {
        type: 'sentence_correction',
        question: 'He am tired.',
        answer: 'He is tired.',
        explanation: 'With "he", we use "is", not "am".'
      }
    ]
  },
  {
    id: 'unit-2',
    unit: 2,
    title: 'Subject Pronouns',
    explanation: 'Subject pronouns replace nouns as the subject of a sentence. They are: I, you, he, she, it, we, they.',
    examples: [
      'Maria is a doctor. She works at the hospital.',
      'The dogs are playing. They are happy.',
      'John and I are friends. We like sports.',
      'The book is interesting. It is about history.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'My name is Anna. ___ am from Germany.',
        answer: 'I',
        explanation: 'When referring to yourself, use "I".'
      },
      {
        type: 'fill_blank',
        question: 'The cat is sleeping. ___ is on the sofa.',
        answer: 'It',
        explanation: 'For animals and objects, use "it".'
      },
      {
        type: 'multiple_choice',
        question: 'Tom and Jerry are cartoon characters. ___ are famous.',
        options: ['We', 'They', 'You'],
        correct: 'They',
        explanation: 'For multiple people/things, use "they".'
      },
      {
        type: 'sentence_correction',
        question: 'Her is a good student.',
        answer: 'She is a good student.',
        explanation: 'Use "she" as a subject pronoun, not "her".'
      },
      {
        type: 'rewrite',
        question: 'Sarah is my sister. Sarah likes music.',
        answer: 'Sarah is my sister. She likes music.',
        explanation: 'Replace the second "Sarah" with "she".'
      }
    ]
  },
  {
    id: 'unit-3',
    unit: 3,
    title: 'Possessive Adjectives',
    explanation: 'Possessive adjectives show ownership or possession. They are: my, your, his, her, its, our, their.',
    examples: [
      'This is my book.',
      'Is that your car?',
      'His name is Peter.',
      'Her dress is blue.',
      'The dog is wagging its tail.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'I have a new phone. ___ phone is very modern.',
        answer: 'My',
        explanation: 'Use "my" to show something belongs to "I".'
      },
      {
        type: 'fill_blank',
        question: 'The students are taking ___ exams.',
        answer: 'their',
        explanation: 'Use "their" to show something belongs to "the students".'
      },
      {
        type: 'multiple_choice',
        question: 'What is ___ name?',
        options: ['you', 'your', "you're"],
        correct: 'your',
        explanation: 'Use "your" to ask about possession.'
      },
      {
        type: 'sentence_correction',
        question: 'The cat eating it food.',
        answer: 'The cat is eating its food.',
        explanation: 'Use "its" (no apostrophe) for possession by "it".'
      },
      {
        type: 'rewrite',
        question: 'The children. The children are playing with toys.',
        answer: 'The children are playing with their toys.',
        explanation: 'Use "their" to show the toys belong to the children.'
      }
    ]
  },
  {
    id: 'unit-4',
    unit: 4,
    title: 'Articles: a/an/the',
    explanation: 'Articles are used before nouns. "A/an" are indefinite articles for general things. "The" is definite for specific things.',
    examples: [
      'I saw a cat in the garden.',
      'She wants to buy an apple.',
      'The book on the table is mine.',
      'He is a doctor. The doctor works at the city hospital.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'She is ___ engineer.',
        answer: 'an',
        explanation: 'Use "an" before words that start with a vowel sound.'
      },
      {
        type: 'fill_blank',
        question: 'I bought ___ new car yesterday.',
        answer: 'a',
        explanation: 'Use "a" before words that start with a consonant sound.'
      },
      {
        type: 'multiple_choice',
        question: 'Can you pass me ___ salt, please?',
        options: ['a', 'an', 'the'],
        correct: 'the',
        explanation: 'Use "the" for specific items that both speaker and listener know about.'
      },
      {
        type: 'sentence_correction',
        question: 'I have a apple.',
        answer: 'I have an apple.',
        explanation: 'Use "an" before "apple" because it starts with a vowel sound.'
      },
      {
        type: 'rewrite',
        question: 'I saw dog. Dog was big.',
        answer: 'I saw a dog. The dog was big.',
        explanation: 'Use "a" for first mention, "the" for specific reference.'
      }
    ]
  },
  {
    id: 'unit-5',
    unit: 5,
    title: 'Present Simple: Questions',
    explanation: 'To make questions in present simple, use "Do/Does" at the beginning. Use "Does" for he/she/it, and "Do" for I/you/we/they.',
    examples: [
      'Do you speak English?',
      'Does she like coffee?',
      'Do they live in London?',
      'Does he work hard?'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: '___ you like pizza?',
        answer: 'Do',
        explanation: 'Use "Do" with "you".'
      },
      {
        type: 'fill_blank',
        question: '___ your brother play football?',
        answer: 'Does',
        explanation: 'Use "Does" with "your brother" (he).'
      },
      {
        type: 'multiple_choice',
        question: '___ they have children?',
        options: ['Do', 'Does', 'Is'],
        correct: 'Do',
        explanation: 'Use "Do" with "they".'
      },
      {
        type: 'sentence_correction',
        question: 'Does you understand?',
        answer: 'Do you understand?',
        explanation: 'Use "Do" with "you", not "Does".'
      },
      {
        type: 'rewrite',
        question: 'You speak French. Make it a question.',
        answer: 'Do you speak French?',
        explanation: 'Add "Do" at the beginning to make a question.'
      }
    ]
  },
  {
    id: 'unit-6',
    unit: 6,
    title: 'Present Simple: Negatives',
    explanation: 'To make negatives in present simple, use "don\'t" (do not) or "doesn\'t" (does not). Use "doesn\'t" for he/she/it, and "don\'t" for I/you/we/they.',
    examples: [
      'I don\'t like spicy food.',
      'She doesn\'t work on Sundays.',
      'They don\'t have a car.',
      'He doesn\'t speak Japanese.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'I ___ understand this problem.',
        answer: 'don\'t',
        explanation: 'Use "don\'t" with "I".'
      },
      {
        type: 'fill_blank',
        question: 'My cat ___ like water.',
        answer: 'doesn\'t',
        explanation: 'Use "doesn\'t" with "my cat" (it).'
      },
      {
        type: 'multiple_choice',
        question: 'We ___ live in this city.',
        options: ["don't", "doesn't", 'not'],
        correct: "don't",
        explanation: 'Use "don\'t" with "we".'
      },
      {
        type: 'sentence_correction',
        question: 'She don\'t go to school.',
        answer: 'She doesn\'t go to school.',
        explanation: 'Use "doesn\'t" with "she", not "don\'t".'
      },
      {
        type: 'rewrite',
        question: 'I like coffee. Make it negative.',
        answer: 'I don\'t like coffee.',
        explanation: 'Add "don\'t" before the verb to make it negative.'
      }
    ]
  },
  {
    id: 'unit-7',
    unit: 7,
    title: 'There is / There are',
    explanation: 'Use "There is" for singular nouns and uncountable nouns. Use "There are" for plural nouns.',
    examples: [
      'There is a book on the table.',
      'There is some milk in the fridge.',
      'There are many students in the class.',
      'There are three apples in the basket.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: '___ a beautiful garden behind the house.',
        answer: 'There is',
        explanation: 'Use "There is" for "a beautiful garden" (singular).'
      },
      {
        type: 'fill_blank',
        question: '___ five people in the room.',
        answer: 'There are',
        explanation: 'Use "There are" for "five people" (plural).'
      },
      {
        type: 'multiple_choice',
        question: '___ some coffee in the kitchen.',
        options: ['There is', 'There are'],
        correct: 'There is',
        explanation: 'Use "There is" for uncountable nouns like "coffee".'
      },
      {
        type: 'sentence_correction',
        question: 'There is two cars in the garage.',
        answer: 'There are two cars in the garage.',
        explanation: 'Use "There are" for "two cars" (plural).'
      },
      {
        type: 'rewrite',
        question: 'I have a cat. (Use There is/are)',
        answer: 'There is a cat.',
        explanation: 'Rewrite using "There is" structure.'
      }
    ]
  },
  {
    id: 'unit-8',
    unit: 8,
    title: 'Prepositions of Place',
    explanation: 'Prepositions of place show where something is located. Common ones include: in, on, at, under, next to, between, behind.',
    examples: [
      'The keys are in the drawer.',
      'The book is on the table.',
      'She is waiting at the bus stop.',
      'The cat is under the bed.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'The pictures are ___ the wall.',
        answer: 'on',
        explanation: 'Use "on" for surfaces like walls.'
      },
      {
        type: 'fill_blank',
        question: 'I live ___ a small apartment.',
        answer: 'in',
        explanation: 'Use "in" for enclosed spaces.'
      },
      {
        type: 'multiple_choice',
        question: 'The children are playing ___ the garden.',
        options: ['on', 'in', 'at'],
        correct: 'in',
        explanation: 'Use "in" for enclosed outdoor areas like gardens.'
      },
      {
        type: 'sentence_correction',
        question: 'The pen is in the table.',
        answer: 'The pen is on the table.',
        explanation: 'Use "on" for surfaces like tables, not "in".'
      },
      {
        type: 'rewrite',
        question: 'My keys. They are in my pocket.',
        answer: 'My keys are in my pocket.',
        explanation: 'Combine into one sentence using correct preposition.'
      }
    ]
  },
  {
    id: 'unit-9',
    unit: 9,
    title: 'Present Continuous',
    explanation: 'Present continuous (am/is/are + -ing) is used for actions happening now or temporary situations.',
    examples: [
      'I am studying English now.',
      'She is working at the moment.',
      'They are playing football in the park.',
      'It is raining today.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'Look! The baby ___.',
        answer: 'is crying',
        explanation: 'Use "is + -ing" for "the baby" (she/he/it).'
      },
      {
        type: 'fill_blank',
        question: 'We ___ our homework right now.',
        answer: 'are doing',
        explanation: 'Use "are + -ing" for "we".'
      },
      {
        type: 'multiple_choice',
        question: 'What ___ you doing?',
        options: ['is', 'are', 'am'],
        correct: 'are',
        explanation: 'Use "are" with "you".'
      },
      {
        type: 'sentence_correction',
        question: 'I am work now.',
        answer: 'I am working now.',
        explanation: 'Use "-ing" form with present continuous: "am + working".'
      },
      {
        type: 'rewrite',
        question: 'She reads a book. (Use present continuous)',
        answer: 'She is reading a book.',
        explanation: 'Change to present continuous: "is + reading".'
      }
    ]
  },
  {
    id: 'unit-10',
    unit: 10,
    title: 'Can / Can\'t for Ability',
    explanation: 'Use "can" to talk about ability and possibility. Use "can\'t" (cannot) for inability or impossibility.',
    examples: [
      'I can speak three languages.',
      'She can play the piano very well.',
      'They can\'t swim.',
      'He can\'t come to the party.'
    ],
    exercises: [
      {
        type: 'fill_blank',
        question: 'I ___ cook very well.',
        answer: 'can',
        explanation: 'Use "can" for positive ability.'
      },
      {
        type: 'fill_blank',
        question: 'My brother ___ ride a bike.',
        answer: 'can\'t',
        explanation: 'Use "can\'t" for inability.'
      },
      {
        type: 'multiple_choice',
        question: '___ you help me with this?',
        options: ['Can', 'Do', 'Are'],
        correct: 'Can',
        explanation: 'Use "Can" to ask about ability or possibility.'
      },
      {
        type: 'sentence_correction',
        question: 'She can sings well.',
        answer: 'She can sing well.',
        explanation: 'Use base form after "can": "can + sing", not "can + sings".'
      },
      {
        type: 'rewrite',
        question: 'I am able to swim. (Use can/can\'t)',
        answer: 'I can swim.',
        explanation: 'Replace "am able to" with "can".'
      }
    ]
  }
]

// Function to get all lessons
export function getAllLessons(): Lesson[] {
  return newRoundUpLessons
}

// Function to get lesson by ID
export function getLessonById(id: string): Lesson | undefined {
  return newRoundUpLessons.find(lesson => lesson.id === id)
}

// Function to get lesson by unit number
export function getLessonByUnit(unit: number): Lesson | undefined {
  return newRoundUpLessons.find(lesson => lesson.unit === unit)
}

// Function to get lessons by unit range
export function getLessonsByRange(startUnit: number, endUnit: number): Lesson[] {
  return newRoundUpLessons.filter(lesson => 
    lesson.unit >= startUnit && lesson.unit <= endUnit
  )
}
