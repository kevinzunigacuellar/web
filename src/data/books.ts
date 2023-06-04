import csDestilled from "../assets/books/cs-distilled.jpg";
import eloquentJavascript from "../assets/books/eloquent-javascript.jpg";
import refactoringUI from "../assets/books/refactoring-ui.jpg";
import aprendiendoGit from "../assets/books/aprendiendo-git.png";
import reactExplained from "../assets/books/react-explained.jpg";
import understandingDisSys from "../assets/books/distributed_systems.jpeg";
import learningTypeScript from "../assets/books/learning-ts.jpg";

export const books = [
  {
    title: "Learning TypeScript",
    author: "Josh Goldberg",
    comment:
      "Loved it! I learned a lot about TypeScript and how to use it in my projects. I highly recommend it.",
    img: learningTypeScript,
    year: 2022,
    loading: "eager" as const,
  },
  {
    title: "Understanding Distributed Systems",
    author: "Roberto Vitillo",
    comment:
      "Must read for anyone interested in cloud scale systems design. It is well written and well organized.",
    img: understandingDisSys,
    year: 2022,
    reading: true,
  },
  {
    title: "Computer Science Distilled",
    author: "Wladston Ferreira Filho",
    comment:
      "So far loving this book, It illustrates the concepts of data structures and algorithms in a fun and easy way.",
    img: csDestilled,
    year: 2017,
  },
  {
    title: "Eloquent JavaScript",
    author: "Marijn Haverbeke",
    comment:
      "One of the best JavaScript books I have ever read. Maybe a good rival to You Don't Know JS?",
    img: eloquentJavascript,
    year: 2018,
  },
  {
    title: "Refactoring UI",
    author: "Adam Whatan & Steve Schoger",
    comment:
      "I absolutely loved this book. It improved my UI design skills a thousand times. This is a must have for every front-end developer/designer.",
    img: refactoringUI,
    year: 2019,
  },
  {
    title: "Aprendiendo Git",
    author: "Miguel Ángel Duran",
    comment:
      "I bought this book on presale to support one of my favorites twitch streamers. I highly recommend it regardless of your knowledge of git.",
    img: aprendiendoGit,
    year: 2021,
  },
  {
    title: "React Explained",
    author: "Zac Gordon",
    comment:
      "This book is okay, but I don't think the best way to learn React is by reading.",
    img: reactExplained,
    year: 2018,
  },
];
