// Track-specific MCQ questions for eligibility test
export const MOCK_MCQ_QUESTIONS = {
  FULL_STACK: [
    {
      question: "What is the purpose of the 'useCallback' hook in React?",
      options: [
        "To cache expensive computations",
        "To memoize callback functions",
        "To handle side effects",
        "To manage component state",
      ],
      correct: 1,
    },
    {
      question:
        "Which HTTP status code indicates a successful POST request that created a new resource?",
      options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
      correct: 1,
    },
    {
      question: "In Node.js, what does the 'event loop' do?",
      options: [
        "Compiles JavaScript to machine code",
        "Handles asynchronous operations non-blockingly",
        "Manages memory allocation",
        "Creates new threads for each request",
      ],
      correct: 1,
    },
    {
      question: "What is a closure in JavaScript?",
      options: [
        "A way to close browser windows",
        "A function that has access to its outer scope's variables",
        "A method to end loops",
        "A type of error handling",
      ],
      correct: 1,
    },
    {
      question: "Which database type is MongoDB?",
      options: ["Relational", "Document-based NoSQL", "Graph", "Key-Value"],
      correct: 1,
    },
  ],
  AI_ML: [
    {
      question:
        "What is the main purpose of a validation set in machine learning?",
      options: [
        "To train the model",
        "To tune hyperparameters and prevent overfitting",
        "To deploy the model",
        "To collect more data",
      ],
      correct: 1,
    },
    {
      question:
        "Which loss function is typically used for binary classification?",
      options: [
        "Mean Squared Error",
        "Binary Cross-Entropy",
        "Categorical Cross-Entropy",
        "Hinge Loss",
      ],
      correct: 1,
    },
    {
      question: "What does 'backpropagation' do in neural networks?",
      options: [
        "Moves data backward through layers",
        "Calculates gradients for weight updates",
        "Removes unnecessary neurons",
        "Increases learning rate",
      ],
      correct: 1,
    },
    {
      question: "Which technique helps reduce overfitting in deep learning?",
      options: [
        "Increasing model complexity",
        "Dropout regularization",
        "Removing validation data",
        "Using only training data",
      ],
      correct: 1,
    },
    {
      question: "What is the purpose of feature scaling?",
      options: [
        "To add more features",
        "To normalize features to similar ranges",
        "To remove features",
        "To increase training time",
      ],
      correct: 1,
    },
  ],
  WEB3: [
    {
      question: "What is a smart contract?",
      options: [
        "A legal document signed digitally",
        "Self-executing code on blockchain",
        "A type of cryptocurrency",
        "An encrypted message",
      ],
      correct: 1,
    },
    {
      question: "What does 'gas' represent in Ethereum?",
      options: [
        "Network speed",
        "Computational cost of operations",
        "Token price",
        "Block size",
      ],
      correct: 1,
    },
    {
      question: "What is the difference between ERC-20 and ERC-721?",
      options: [
        "ERC-20 is for NFTs, ERC-721 is for tokens",
        "ERC-20 is fungible tokens, ERC-721 is non-fungible tokens",
        "They are the same",
        "ERC-721 is older than ERC-20",
      ],
      correct: 1,
    },
    {
      question: "What is a DAO?",
      options: [
        "Digital Asset Organization",
        "Decentralized Autonomous Organization",
        "Distributed Application Object",
        "Data Access Object",
      ],
      correct: 1,
    },
    {
      question: "What does 'IPFS' stand for and what is it used for?",
      options: [
        "Internet Protocol File System - for routing",
        "InterPlanetary File System - decentralized storage",
        "Internal Protocol For Security - encryption",
        "Instant Payment File Service - transactions",
      ],
      correct: 1,
    },
  ],
};
