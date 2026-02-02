


import { PrismaClient, UserRole, GENDER, LoanStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Real authors with biographical data
const AUTHORS = [
  {
    name: 'George Orwell',
    bio: 'English novelist, essayist, journalist and critic. Best known for Animal Farm and Nineteen Eighty-Four.',
    nationality: 'British',
    birthdate: new Date('1903-06-25'),
  },
  {
    name: 'Jane Austen',
    bio: 'English novelist known for her six major novels which interpret, critique and comment upon the British landed gentry at the end of the 18th century.',
    nationality: 'British',
    birthdate: new Date('1775-12-16'),
  },
  {
    name: 'F. Scott Fitzgerald',
    bio: 'American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
    nationality: 'American',
    birthdate: new Date('1896-09-24'),
  },
  {
    name: 'Harper Lee',
    bio: 'American novelist best known for To Kill a Mockingbird, which won the Pulitzer Prize in 1961.',
    nationality: 'American',
    birthdate: new Date('1926-04-28'),
  },
  {
    name: 'Herman Melville',
    bio: 'American novelist, short story writer, and poet of the American Renaissance period.',
    nationality: 'American',
    birthdate: new Date('1819-08-01'),
  },
  {
    name: 'Leo Tolstoy',
    bio: 'Russian writer who is regarded as one of the greatest authors of all time. Known for War and Peace and Anna Karenina.',
    nationality: 'Russian',
    birthdate: new Date('1828-09-09'),
  },
  {
    name: 'Charles Dickens',
    bio: 'English writer and social critic who created some of the world\'s best-known fictional characters.',
    nationality: 'British',
    birthdate: new Date('1812-02-07'),
  },
  {
    name: 'Mary Shelley',
    bio: 'English novelist who wrote the Gothic novel Frankenstein, which is considered an early example of science fiction.',
    nationality: 'British',
    birthdate: new Date('1797-08-30'),
  },
  {
    name: 'Mark Twain',
    bio: 'American writer, humorist, entrepreneur, publisher, and lecturer. Known for The Adventures of Tom Sawyer and Adventures of Huckleberry Finn.',
    nationality: 'American',
    birthdate: new Date('1835-11-30'),
  },
  {
    name: 'Virginia Woolf',
    bio: 'English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness.',
    nationality: 'British',
    birthdate: new Date('1882-01-25'),
  },
  {
    name: 'Ernest Hemingway',
    bio: 'American novelist, short-story writer, and journalist. Known for his economical and understated style.',
    nationality: 'American',
    birthdate: new Date('1899-07-21'),
  },
  {
    name: 'Oscar Wilde',
    bio: 'Irish poet and playwright. Known for his epigrams, plays, and novel The Picture of Dorian Gray.',
    nationality: 'Irish',
    birthdate: new Date('1854-10-16'),
  },
  {
    name: 'Emily Brontë',
    bio: 'English novelist and poet who is best known for her only novel, Wuthering Heights.',
    nationality: 'British',
    birthdate: new Date('1818-07-30'),
  },
  {
    name: 'James Joyce',
    bio: 'Irish novelist, short story writer, poet, and literary critic. He contributed to the modernist avant-garde movement.',
    nationality: 'Irish',
    birthdate: new Date('1882-02-02'),
  },
  {
    name: 'Franz Kafka',
    bio: 'German-speaking Bohemian novelist and short-story writer, widely regarded as one of the major figures of 20th-century literature.',
    nationality: 'Czech',
    birthdate: new Date('1883-07-03'),
  },
  {
    name: 'Homer',
    bio: 'Ancient Greek epic poet, traditionally said to be the author of the Iliad and the Odyssey.',
    nationality: 'Greek',
    birthdate: new Date('-0800-01-01'),
  },
  {
    name: 'Fyodor Dostoevsky',
    bio: 'Russian novelist, short story writer, essayist and philosopher. Known for Crime and Punishment and The Brothers Karamazov.',
    nationality: 'Russian',
    birthdate: new Date('1821-11-11'),
  },
  {
    name: 'Miguel de Cervantes',
    bio: 'Spanish writer widely regarded as the greatest writer in the Spanish language. Author of Don Quixote.',
    nationality: 'Spanish',
    birthdate: new Date('1547-09-29'),
  },
  {
    name: 'Dante Alighieri',
    bio: 'Italian poet, writer and philosopher. Known for the Divine Comedy, a landmark of Italian literature.',
    nationality: 'Italian',
    birthdate: new Date('1265-01-01'),
  },
  {
    name: 'Victor Hugo',
    bio: 'French poet, novelist, and dramatist of the Romantic movement. Best known for Les Misérables and The Hunchback of Notre-Dame.',
    nationality: 'French',
    birthdate: new Date('1802-02-26'),
  },
  {
    name: 'Geoffrey Chaucer',
    bio: 'English poet and author, known as the "Father of English literature". Best known for The Canterbury Tales.',
    nationality: 'English',
    birthdate: new Date('1343-01-01'),
  },
  {
    name: 'John Milton',
    bio: 'English poet and intellectual who served as a civil servant. Best known for his epic poem Paradise Lost.',
    nationality: 'English',
    birthdate: new Date('1608-12-09'),
  },
  {
    name: 'Walt Whitman',
    bio: 'American poet, essayist, and journalist. A humanist, he was a part of the transition between transcendentalism and realism.',
    nationality: 'American',
    birthdate: new Date('1819-05-31'),
  },
  {
    name: 'Nathaniel Hawthorne',
    bio: 'American novelist and short story writer. His works often explore themes of sin, guilt, and morality in Puritan New England.',
    nationality: 'American',
    birthdate: new Date('1804-07-04'),
  },
  {
    name: 'Niccolò Machiavelli',
    bio: 'Italian diplomat, philosopher, and writer, best known for his political treatise The Prince.',
    nationality: 'Italian',
    birthdate: new Date('1469-05-03'),
  },
  {
    name: 'Marcus Aurelius',
    bio: 'Roman emperor and Stoic philosopher. His Meditations is a significant source of the modern understanding of ancient Stoic philosophy.',
    nationality: 'Roman',
    birthdate: new Date('0121-04-26'),
  },
  {
    name: 'Plato',
    bio: 'Ancient Greek philosopher, student of Socrates, and founder of the Academy in Athens. One of the most influential philosophers in history.',
    nationality: 'Greek',
    birthdate: new Date('-0428-01-01'),
  },
  {
    name: 'H.G. Wells',
    bio: 'English writer, known as the "father of science fiction". Best known for The Time Machine and The War of the Worlds.',
    nationality: 'British',
    birthdate: new Date('1866-09-21'),
  },
  {
    name: 'Jules Verne',
    bio: 'French novelist, poet, and playwright. Pioneer of science fiction literature with works like Twenty Thousand Leagues Under the Sea.',
    nationality: 'French',
    birthdate: new Date('1828-02-08'),
  },
  {
    name: 'Robert Louis Stevenson',
    bio: 'Scottish novelist, poet, and travel writer. Best known for Treasure Island and Strange Case of Dr Jekyll and Mr Hyde.',
    nationality: 'Scottish',
    birthdate: new Date('1850-11-13'),
  },
  {
    name: 'Daniel Defoe',
    bio: 'English writer, trader, journalist, pamphleteer and spy. Most famous for his novel Robinson Crusoe.',
    nationality: 'English',
    birthdate: new Date('1660-01-01'),
  },
  {
    name: 'Jonathan Swift',
    bio: 'Anglo-Irish satirist, essayist, political pamphleteer, poet and cleric. Best known for Gulliver\'s Travels.',
    nationality: 'Irish',
    birthdate: new Date('1667-11-30'),
  },
  {
    name: 'Lewis Carroll',
    bio: 'English writer, mathematician, logician, and photographer. Best known for Alice\'s Adventures in Wonderland.',
    nationality: 'English',
    birthdate: new Date('1832-01-27'),
  },
  {
    name: 'Charlotte Brontë',
    bio: 'English novelist and poet, the eldest of the three Brontë sisters. Best known for Jane Eyre.',
    nationality: 'British',
    birthdate: new Date('1816-04-21'),
  },
  {
    name: 'Alexandre Dumas',
    bio: 'French writer, best known for his historical novels of high adventure. Famous for The Count of Monte Cristo and The Three Musketeers.',
    nationality: 'French',
    birthdate: new Date('1802-07-24'),
  },
  {
    name: 'E.M. Forster',
    bio: 'English novelist, short story writer, essayist and librettist. Known for A Room with a View and A Passage to India.',
    nationality: 'British',
    birthdate: new Date('1879-01-01'),
  },
  {
    name: 'Bram Stoker',
    bio: 'Irish author, best known for his Gothic novel Dracula, which remains influential in vampire fiction.',
    nationality: 'Irish',
    birthdate: new Date('1847-11-08'),
  },
];

// Real publishers
const PUBLISHERS = [
  { name: 'Penguin Random House', website: 'https://www.penguinrandomhouse.com' },
  { name: 'HarperCollins', website: 'https://www.harpercollins.com' },
  { name: 'Simon & Schuster', website: 'https://www.simonandschuster.com' },
  { name: 'Hachette Book Group', website: 'https://www.hachettebookgroup.com' },
  { name: 'Macmillan Publishers', website: 'https://us.macmillan.com' },
  { name: 'Oxford University Press', website: 'https://global.oup.com' },
  { name: 'Cambridge University Press', website: 'https://www.cambridge.org' },
  { name: 'Vintage Books', website: 'https://www.penguinrandomhouse.com/publishers/vintage-books' },
  { name: 'Dover Publications', website: 'https://doverpublications.com' },
  { name: 'Project Gutenberg', website: 'https://www.gutenberg.org' },
];

// Book categories
const CATEGORIES = [
  { name: 'Fiction', description: 'Literary fiction and novels' },
  { name: 'Classic Literature', description: 'Timeless literary works' },
  { name: 'Science Fiction', description: 'Speculative and futuristic fiction' },
  { name: 'Mystery & Thriller', description: 'Suspenseful and crime fiction' },
  { name: 'Romance', description: 'Love stories and romantic fiction' },
  { name: 'Fantasy', description: 'Magical and fantastical worlds' },
  { name: 'Historical Fiction', description: 'Stories set in historical periods' },
  { name: 'Horror', description: 'Scary and suspenseful fiction' },
  { name: 'Poetry', description: 'Collections of poems and verse' },
  { name: 'Drama', description: 'Plays and theatrical works' },
  { name: 'Philosophy', description: 'Philosophical texts and essays' },
  { name: 'Biography', description: 'Life stories of notable people' },
];

// Real books with actual Project Gutenberg PDFs (public domain)
const BOOKS = [
  {
    title: '1984',
    authorName: 'George Orwell',
    isbn: '978-0451524935',
    description: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.planetebook.com/free-ebooks/1984.pdf',
    pages: '328',
    publishedAt: new Date('1949-06-08'),
    keywords: ['dystopia', 'totalitarianism', 'surveillance', 'political fiction', 'censorship'],
    price: 12.99,
  },
  {
    title: 'Pride and Prejudice',
    authorName: 'Jane Austen',
    isbn: '978-0141439518',
    description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1342/1342-pdf.pdf',
    pages: '432',
    publishedAt: new Date('1813-01-28'),
    keywords: ['romance', 'social class', 'marriage', 'regency era', 'comedy of manners'],
    price: 10.99,
  },
  {
    title: 'The Great Gatsby',
    authorName: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    description: 'A novel about the American Dream, jazz age, and the excesses of the 1920s.',
    categoryName: 'Classic Literature',
    publisherName: 'Simon & Schuster',
    fileUrl: 'https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf',
    pages: '180',
    publishedAt: new Date('1925-04-10'),
    keywords: ['american dream', 'jazz age', 'wealth', 'love', 'tragedy'],
    price: 11.99,
  },
  {
    title: 'To Kill a Mockingbird',
    authorName: 'Harper Lee',
    isbn: '978-0061120084',
    description: 'A novel about racial injustice and childhood innocence in the American South.',
    categoryName: 'Classic Literature',
    publisherName: 'HarperCollins',
    fileUrl: 'https://www.planetebook.com/free-ebooks/to-kill-a-mockingbird.pdf',
    pages: '324',
    publishedAt: new Date('1960-07-11'),
    keywords: ['racism', 'justice', 'childhood', 'southern gothic', 'moral growth'],
    price: 13.99,
  },
  {
    title: 'Moby-Dick',
    authorName: 'Herman Melville',
    isbn: '978-0142437247',
    description: 'An epic tale of Captain Ahab\'s obsessive quest to hunt the white whale.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/2701/2701-pdf.pdf',
    pages: '635',
    publishedAt: new Date('1851-10-18'),
    keywords: ['adventure', 'obsession', 'whale hunting', 'sea', 'symbolism'],
    price: 14.99,
  },
  {
    title: 'War and Peace',
    authorName: 'Leo Tolstoy',
    isbn: '978-0307266934',
    description: 'A historical novel that chronicles the French invasion of Russia and its impact on Tsarist society.',
    categoryName: 'Historical Fiction',
    publisherName: 'Vintage Books',
    fileUrl: 'https://www.gutenberg.org/files/2600/2600-pdf.pdf',
    pages: '1225',
    publishedAt: new Date('1869-01-01'),
    keywords: ['war', 'peace', 'russian society', 'napoleon', 'historical epic'],
    price: 18.99,
  },
  {
    title: 'A Tale of Two Cities',
    authorName: 'Charles Dickens',
    isbn: '978-0141439600',
    description: 'A historical novel set in London and Paris before and during the French Revolution.',
    categoryName: 'Historical Fiction',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/98/98-pdf.pdf',
    pages: '448',
    publishedAt: new Date('1859-11-30'),
    keywords: ['french revolution', 'sacrifice', 'resurrection', 'london', 'paris'],
    price: 12.99,
  },
  {
    title: 'Frankenstein',
    authorName: 'Mary Shelley',
    isbn: '978-0486282114',
    description: 'A gothic novel about a scientist who creates a sapient creature in an unorthodox experiment.',
    categoryName: 'Horror',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/84/84-pdf.pdf',
    pages: '280',
    publishedAt: new Date('1818-01-01'),
    keywords: ['science fiction', 'horror', 'creation', 'monster', 'ethics'],
    price: 9.99,
  },
  {
    title: 'Adventures of Huckleberry Finn',
    authorName: 'Mark Twain',
    isbn: '978-0486280615',
    description: 'A novel about a boy\'s journey down the Mississippi River with an escaped slave.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/76/76-pdf.pdf',
    pages: '366',
    publishedAt: new Date('1884-12-10'),
    keywords: ['adventure', 'mississippi river', 'slavery', 'friendship', 'coming of age'],
    price: 10.99,
  },
  {
    title: 'Mrs Dalloway',
    authorName: 'Virginia Woolf',
    isbn: '978-0156628709',
    description: 'A modernist novel that follows a day in the life of Clarissa Dalloway in post-World War I England.',
    categoryName: 'Classic Literature',
    publisherName: 'Harcourt',
    fileUrl: 'https://www.gutenberg.org/files/2831/2831-pdf.pdf',
    pages: '194',
    publishedAt: new Date('1925-05-14'),
    keywords: ['modernism', 'stream of consciousness', 'london', 'mental health', 'post-war'],
    price: 11.99,
  },
  {
    title: 'The Old Man and the Sea',
    authorName: 'Ernest Hemingway',
    isbn: '978-0684801223',
    description: 'A short novel about an aging Cuban fisherman\'s epic struggle with a giant marlin.',
    categoryName: 'Classic Literature',
    publisherName: 'Simon & Schuster',
    fileUrl: 'https://www.arvindguptatoys.com/arvindgupta/oldman-sea.pdf',
    pages: '127',
    publishedAt: new Date('1952-09-01'),
    keywords: ['fishing', 'perseverance', 'cuba', 'nature', 'dignity'],
    price: 9.99,
  },
  {
    title: 'The Picture of Dorian Gray',
    authorName: 'Oscar Wilde',
    isbn: '978-0141439570',
    description: 'A philosophical novel about a man who remains young while his portrait ages.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/174/174-pdf.pdf',
    pages: '254',
    publishedAt: new Date('1890-07-01'),
    keywords: ['beauty', 'morality', 'hedonism', 'portrait', 'supernatural'],
    price: 10.99,
  },
  {
    title: 'Wuthering Heights',
    authorName: 'Emily Brontë',
    isbn: '978-0141439556',
    description: 'A tale of passion and revenge on the Yorkshire moors.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/768/768-pdf.pdf',
    pages: '416',
    publishedAt: new Date('1847-12-01'),
    keywords: ['gothic romance', 'revenge', 'moors', 'passion', 'tragedy'],
    price: 11.99,
  },
  {
    title: 'Ulysses',
    authorName: 'James Joyce',
    isbn: '978-0141182803',
    description: 'A modernist novel paralleling Homer\'s Odyssey, set in Dublin over a single day.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/4300/4300-pdf.pdf',
    pages: '732',
    publishedAt: new Date('1922-02-02'),
    keywords: ['modernism', 'stream of consciousness', 'dublin', 'odyssey', 'experimental'],
    price: 15.99,
  },
  {
    title: 'The Metamorphosis',
    authorName: 'Franz Kafka',
    isbn: '978-0553213690',
    description: 'A novella about a man who wakes up transformed into a giant insect.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/5200/5200-pdf.pdf',
    pages: '201',
    publishedAt: new Date('1915-01-01'),
    keywords: ['transformation', 'alienation', 'family', 'absurdism', 'existentialism'],
    price: 8.99,
  },
  // Additional classics
  {
    title: 'Great Expectations',
    authorName: 'Charles Dickens',
    isbn: '978-0141439563',
    description: 'A coming-of-age novel about Pip, an orphan who encounters wealth and love.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1400/1400-pdf.pdf',
    pages: '505',
    publishedAt: new Date('1861-08-01'),
    keywords: ['coming of age', 'social class', 'expectations', 'london', 'bildungsroman'],
    price: 12.99,
  },
  {
    title: 'Anna Karenina',
    authorName: 'Leo Tolstoy',
    isbn: '978-0143035008',
    description: 'A tragic love story set against the backdrop of Russian high society.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1399/1399-pdf.pdf',
    pages: '864',
    publishedAt: new Date('1878-01-01'),
    keywords: ['tragic love', 'adultery', 'russian society', 'morality', 'family'],
    price: 16.99,
  },
  {
    title: 'Jane Eyre',
    authorName: 'Charlotte Brontë',
    isbn: '978-0141441146',
    description: 'A bildungsroman following the experiences of its eponymous heroine.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1260/1260-pdf.pdf',
    pages: '532',
    publishedAt: new Date('1847-10-16'),
    keywords: ['bildungsroman', 'gothic romance', 'independence', 'morality', 'feminism'],
    price: 12.99,
  },
  {
    title: 'Sense and Sensibility',
    authorName: 'Jane Austen',
    isbn: '978-0141439662',
    description: 'A novel about the Dashwood sisters and their romantic adventures.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/161/161-pdf.pdf',
    pages: '409',
    publishedAt: new Date('1811-10-30'),
    keywords: ['romance', 'social class', 'sisters', 'regency', 'love'],
    price: 10.99,
  },
  {
    title: 'Emma',
    authorName: 'Jane Austen',
    isbn: '978-0141439587',
    description: 'A comedy of manners about a young woman who meddles in matchmaking.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/158/158-pdf.pdf',
    pages: '474',
    publishedAt: new Date('1815-12-23'),
    keywords: ['matchmaking', 'comedy', 'regency', 'social class', 'self-discovery'],
    price: 11.99,
  },
  {
    title: 'The Adventures of Tom Sawyer',
    authorName: 'Mark Twain',
    isbn: '978-0143107330',
    description: 'A novel about a mischievous boy growing up along the Mississippi River.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/74/74-pdf.pdf',
    pages: '274',
    publishedAt: new Date('1876-06-01'),
    keywords: ['adventure', 'childhood', 'mississippi', 'mischief', 'friendship'],
    price: 9.99,
  },
  {
    title: 'A Room with a View',
    authorName: 'E.M. Forster',
    isbn: '978-0141441368',
    description: 'A social comedy set in Italy and England about a young woman\'s awakening.',
    categoryName: 'Romance',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/2641/2641-pdf.pdf',
    pages: '230',
    publishedAt: new Date('1908-10-14'),
    keywords: ['romance', 'italy', 'social class', 'awakening', 'edwardian'],
    price: 10.99,
  },
  {
    title: 'Dracula',
    authorName: 'Bram Stoker',
    isbn: '978-0486411095',
    description: 'An epistolary novel about Count Dracula\'s attempt to move to England.',
    categoryName: 'Horror',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/345/345-pdf.pdf',
    pages: '418',
    publishedAt: new Date('1897-05-26'),
    keywords: ['vampire', 'gothic horror', 'transylvania', 'epistolary', 'supernatural'],
    price: 11.99,
  },
  {
    title: 'The Strange Case of Dr. Jekyll and Mr. Hyde',
    authorName: 'Robert Louis Stevenson',
    isbn: '978-0486266886',
    description: 'A novella about a London lawyer who investigates strange occurrences.',
    categoryName: 'Horror',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/43/43-pdf.pdf',
    pages: '144',
    publishedAt: new Date('1886-01-05'),
    keywords: ['dual nature', 'gothic', 'london', 'transformation', 'morality'],
    price: 7.99,
  },
  {
    title: 'The Count of Monte Cristo',
    authorName: 'Alexandre Dumas',
    isbn: '978-0140449266',
    description: 'An adventure novel about wrongful imprisonment, escape, and revenge.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1184/1184-pdf.pdf',
    pages: '1276',
    publishedAt: new Date('1844-08-28'),
    keywords: ['revenge', 'adventure', 'betrayal', 'justice', 'redemption'],
    price: 17.99,
  },
  // More Classics
  {
    title: 'The Iliad',
    authorName: 'Homer',
    isbn: '978-0140275360',
    description: 'An ancient Greek epic poem about the Trojan War.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/6130/6130-pdf.pdf',
    pages: '683',
    publishedAt: new Date('-0750-01-01'),
    keywords: ['epic', 'trojan war', 'ancient greece', 'heroism', 'mythology'],
    price: 14.99,
  },
  {
    title: 'The Odyssey',
    authorName: 'Homer',
    isbn: '978-0140268867',
    description: 'An epic poem about Odysseus\'s journey home after the Trojan War.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1727/1727-pdf.pdf',
    pages: '541',
    publishedAt: new Date('-0700-01-01'),
    keywords: ['epic', 'journey', 'odyssey', 'ancient greece', 'adventure'],
    price: 14.99,
  },
  {
    title: 'Crime and Punishment',
    authorName: 'Fyodor Dostoevsky',
    isbn: '978-0486415871',
    description: 'A psychological novel about a poor student who commits murder.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/2554/2554-pdf.pdf',
    pages: '671',
    publishedAt: new Date('1866-01-01'),
    keywords: ['psychology', 'murder', 'redemption', 'morality', 'russia'],
    price: 15.99,
  },
  {
    title: 'The Brothers Karamazov',
    authorName: 'Fyodor Dostoevsky',
    isbn: '978-0374528379',
    description: 'A philosophical novel exploring faith, doubt, and morality.',
    categoryName: 'Philosophy',
    publisherName: 'Vintage Books',
    fileUrl: 'https://www.gutenberg.org/files/28054/28054-pdf.pdf',
    pages: '824',
    publishedAt: new Date('1880-01-01'),
    keywords: ['philosophy', 'faith', 'morality', 'family', 'russia'],
    price: 17.99,
  },
  {
    title: 'Don Quixote',
    authorName: 'Miguel de Cervantes',
    isbn: '978-0060934347',
    description: 'A Spanish epic about a delusional knight and his adventures.',
    categoryName: 'Classic Literature',
    publisherName: 'HarperCollins',
    fileUrl: 'https://www.gutenberg.org/files/996/996-pdf.pdf',
    pages: '940',
    publishedAt: new Date('1605-01-16'),
    keywords: ['chivalry', 'satire', 'adventure', 'spain', 'delusion'],
    price: 18.99,
  },
  {
    title: 'The Divine Comedy',
    authorName: 'Dante Alighieri',
    isbn: '978-0142437223',
    description: 'An epic poem describing Dante\'s journey through Hell, Purgatory, and Paradise.',
    categoryName: 'Poetry',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/8800/8800-pdf.pdf',
    pages: '798',
    publishedAt: new Date('1320-01-01'),
    keywords: ['epic poetry', 'hell', 'paradise', 'medieval', 'allegory'],
    price: 16.99,
  },
  {
    title: 'Les Misérables',
    authorName: 'Victor Hugo',
    isbn: '978-0140444308',
    description: 'A French historical novel about redemption and revolution.',
    categoryName: 'Historical Fiction',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/135/135-pdf.pdf',
    pages: '1463',
    publishedAt: new Date('1862-01-01'),
    keywords: ['redemption', 'revolution', 'france', 'justice', 'poverty'],
    price: 19.99,
  },
  {
    title: 'The Hunchback of Notre-Dame',
    authorName: 'Victor Hugo',
    isbn: '978-0140443530',
    description: 'A Gothic novel set in 15th-century Paris.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/2610/2610-pdf.pdf',
    pages: '544',
    publishedAt: new Date('1831-01-14'),
    keywords: ['gothic', 'paris', 'notre dame', 'medieval', 'tragedy'],
    price: 13.99,
  },
  {
    title: 'The Canterbury Tales',
    authorName: 'Geoffrey Chaucer',
    isbn: '978-0140424386',
    description: 'A collection of stories told by pilgrims on their way to Canterbury.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/2383/2383-pdf.pdf',
    pages: '504',
    publishedAt: new Date('1400-01-01'),
    keywords: ['medieval', 'pilgrimage', 'tales', 'middle english', 'collection'],
    price: 14.99,
  },
  {
    title: 'Paradise Lost',
    authorName: 'John Milton',
    isbn: '978-0140424393',
    description: 'An epic poem about the Fall of Man and Satan\'s rebellion.',
    categoryName: 'Poetry',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/20/20-pdf.pdf',
    pages: '453',
    publishedAt: new Date('1667-01-01'),
    keywords: ['epic poetry', 'satan', 'fall of man', 'biblical', 'theology'],
    price: 13.99,
  },
  {
    title: 'Leaves of Grass',
    authorName: 'Walt Whitman',
    isbn: '978-0140421996',
    description: 'A poetry collection celebrating nature, democracy, and the human spirit.',
    categoryName: 'Poetry',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1322/1322-pdf.pdf',
    pages: '455',
    publishedAt: new Date('1855-07-04'),
    keywords: ['poetry', 'nature', 'democracy', 'america', 'free verse'],
    price: 12.99,
  },
  {
    title: 'The Scarlet Letter',
    authorName: 'Nathaniel Hawthorne',
    isbn: '978-0142437261',
    description: 'A novel about sin, guilt, and redemption in Puritan Massachusetts.',
    categoryName: 'Classic Literature',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/25344/25344-pdf.pdf',
    pages: '238',
    publishedAt: new Date('1850-03-16'),
    keywords: ['sin', 'guilt', 'puritan', 'adultery', 'redemption'],
    price: 10.99,
  },
  {
    title: 'The Prince',
    authorName: 'Niccolò Machiavelli',
    isbn: '978-0140449150',
    description: 'A political treatise on acquiring and maintaining political power.',
    categoryName: 'Philosophy',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1232/1232-pdf.pdf',
    pages: '140',
    publishedAt: new Date('1532-01-01'),
    keywords: ['politics', 'power', 'leadership', 'philosophy', 'renaissance'],
    price: 8.99,
  },
  {
    title: 'Meditations',
    authorName: 'Marcus Aurelius',
    isbn: '978-0140449334',
    description: 'Personal writings by the Roman Emperor on Stoic philosophy.',
    categoryName: 'Philosophy',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/2680/2680-pdf.pdf',
    pages: '254',
    publishedAt: new Date('0180-01-01'),
    keywords: ['stoicism', 'philosophy', 'roman', 'wisdom', 'self-improvement'],
    price: 11.99,
  },
  {
    title: 'The Republic',
    authorName: 'Plato',
    isbn: '978-0140449143',
    description: 'A Socratic dialogue about justice and the ideal state.',
    categoryName: 'Philosophy',
    publisherName: 'Penguin Random House',
    fileUrl: 'https://www.gutenberg.org/files/1497/1497-pdf.pdf',
    pages: '416',
    publishedAt: new Date('-0380-01-01'),
    keywords: ['philosophy', 'justice', 'politics', 'plato', 'ancient greece'],
    price: 13.99,
  },
  {
    title: 'The Time Machine',
    authorName: 'H.G. Wells',
    isbn: '978-0486284729',
    description: 'A science fiction novel about time travel to the distant future.',
    categoryName: 'Science Fiction',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/35/35-pdf.pdf',
    pages: '118',
    publishedAt: new Date('1895-05-07'),
    keywords: ['time travel', 'future', 'science fiction', 'dystopia', 'evolution'],
    price: 7.99,
  },
  {
    title: 'The War of the Worlds',
    authorName: 'H.G. Wells',
    isbn: '978-0486295060',
    description: 'A science fiction novel about a Martian invasion of Earth.',
    categoryName: 'Science Fiction',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/36/36-pdf.pdf',
    pages: '192',
    publishedAt: new Date('1898-01-01'),
    keywords: ['aliens', 'invasion', 'mars', 'science fiction', 'survival'],
    price: 8.99,
  },
  {
    title: 'Twenty Thousand Leagues Under the Sea',
    authorName: 'Jules Verne',
    isbn: '978-0486448497',
    description: 'An adventure novel about submarine exploration.',
    categoryName: 'Science Fiction',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/164/164-pdf.pdf',
    pages: '377',
    publishedAt: new Date('1870-06-20'),
    keywords: ['submarine', 'ocean', 'adventure', 'science fiction', 'captain nemo'],
    price: 11.99,
  },
  {
    title: 'Around the World in Eighty Days',
    authorName: 'Jules Verne',
    isbn: '978-0486411118',
    description: 'An adventure novel about a race around the world.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/103/103-pdf.pdf',
    pages: '220',
    publishedAt: new Date('1873-01-30'),
    keywords: ['travel', 'adventure', 'race', 'world tour', 'wager'],
    price: 9.99,
  },
  {
    title: 'The Strange Case of Dr Jekyll and Mr Hyde',
    authorName: 'Robert Louis Stevenson',
    isbn: '978-0486266886',
    description: 'A gothic novella about dual nature and transformation.',
    categoryName: 'Horror',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/43/43-pdf.pdf',
    pages: '96',
    publishedAt: new Date('1886-01-05'),
    keywords: ['transformation', 'duality', 'gothic', 'psychology', 'horror'],
    price: 6.99,
  },
  {
    title: 'Treasure Island',
    authorName: 'Robert Louis Stevenson',
    isbn: '978-0486275598',
    description: 'An adventure novel about pirates and buried treasure.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/120/120-pdf.pdf',
    pages: '292',
    publishedAt: new Date('1883-11-14'),
    keywords: ['pirates', 'treasure', 'adventure', 'island', 'coming of age'],
    price: 10.99,
  },
  {
    title: 'Robinson Crusoe',
    authorName: 'Daniel Defoe',
    isbn: '978-0486404271',
    description: 'A novel about a castaway who spends 28 years on a remote island.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/521/521-pdf.pdf',
    pages: '320',
    publishedAt: new Date('1719-04-25'),
    keywords: ['survival', 'island', 'castaway', 'adventure', 'self-reliance'],
    price: 10.99,
  },
  {
    title: 'Gulliver\'s Travels',
    authorName: 'Jonathan Swift',
    isbn: '978-0486292731',
    description: 'A satirical novel about voyages to fantastical lands.',
    categoryName: 'Classic Literature',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/829/829-pdf.pdf',
    pages: '306',
    publishedAt: new Date('1726-10-28'),
    keywords: ['satire', 'fantasy', 'travel', 'lilliput', 'social criticism'],
    price: 10.99,
  },
  {
    title: 'Alice\'s Adventures in Wonderland',
    authorName: 'Lewis Carroll',
    isbn: '978-0486275437',
    description: 'A fantasy novel about a girl who falls down a rabbit hole.',
    categoryName: 'Fantasy',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/11/11-pdf.pdf',
    pages: '96',
    publishedAt: new Date('1865-11-26'),
    keywords: ['fantasy', 'wonderland', 'nonsense', 'children', 'adventure'],
    price: 7.99,
  },
  {
    title: 'Through the Looking-Glass',
    authorName: 'Lewis Carroll',
    isbn: '978-0486408781',
    description: 'A sequel to Alice\'s Adventures in Wonderland.',
    categoryName: 'Fantasy',
    publisherName: 'Dover Publications',
    fileUrl: 'https://www.gutenberg.org/files/12/12-pdf.pdf',
    pages: '124',
    publishedAt: new Date('1871-12-27'),
    keywords: ['fantasy', 'mirror', 'chess', 'alice', 'adventure'],
    price: 7.99,
  },
];

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('📚 Starting Book Library Database Seeding...\n');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.readingHistory.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.recommendationLog.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.checkout.deleteMany();
  await prisma.billingAddress.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.bookCover.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.author.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Database cleaned\n');

  // 1. Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@booklibrary.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      gender: GENDER.MALE,
      profile: {
        create: {
          bio: 'Library administrator and book enthusiast',
          phoneNumber: '+1-555-0100',
          isVerified: true,
          birthdate: new Date('1985-03-15'),
          title: 'Head Librarian',
        },
      },
    },
  });

  const regularUsers = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          password: hashedPassword,
          role: UserRole.MEMBER,
          gender: faker.helpers.arrayElement([GENDER.MALE, GENDER.FEMALE]),
          profile: {
            create: {
              bio: faker.lorem.paragraph(),
              phoneNumber: faker.phone.number(),
              isVerified: Math.random() > 0.3,
              birthdate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
            },
          },
        },
      });
    })
  );

  const allUsers = [adminUser, ...regularUsers];
  console.log(`  ✓ Created ${allUsers.length} users\n`);

  // 2. Create Publishers
  console.log('🏢 Creating publishers...');
  const createdPublishers = await Promise.all(
    PUBLISHERS.map(pub =>
      prisma.publisher.create({
        data: pub,
      })
    )
  );
  console.log(`  ✓ Created ${createdPublishers.length} publishers\n`);

  // 3. Create Categories
  console.log('📂 Creating categories...');
  const createdCategories = await Promise.all(
    CATEGORIES.map(cat =>
      prisma.category.create({
        data: cat,
      })
    )
  );
  console.log(`  ✓ Created ${createdCategories.length} categories\n`);

  // 4. Create Authors
  console.log('✍️ Creating authors...');
  const createdAuthors = await Promise.all(
    AUTHORS.map(author =>
      prisma.author.create({
        data: {
          ...author,
          popularity: Math.random() * 10,
        },
      })
    )
  );
  console.log(`  ✓ Created ${createdAuthors.length} authors\n`);

  // 5. Create Books
  console.log('📖 Creating books with real PDFs...');
  const createdBooks = [];

  for (let i = 0; i < BOOKS.length; i++) {
    try {
      const bookData = BOOKS[i];
      console.log(`  [${i + 1}/${BOOKS.length}] Creating: ${bookData.title}...`);

      const author = createdAuthors.find(a => a.name === bookData.authorName);
      const category = createdCategories.find(c => c.name === bookData.categoryName);
      const publisher = createdPublishers.find(p => p.name === bookData.publisherName);
      const randomUser = faker.helpers.arrayElement(allUsers);

      if (!author || !category || !publisher) {
        console.log(`    ⚠️ Skipping - missing relations`);
        continue;
      }

      const book = await prisma.book.create({
        data: {
          title: bookData.title,
          description: bookData.description,
          isbn: bookData.isbn,
          authorId: author.id,
          userId: randomUser.id,
          publisherId: publisher.id,
          categoryId: category.id,
          fileUrl: bookData.fileUrl,
          fileSize: `${faker.number.int({ min: 500, max: 5000 })} KB`,
          fileFormat: 'PDF',
          language: 'English',
          pages: bookData.pages,
          publishedAt: bookData.publishedAt,
          price: bookData.price,
          available: true,
          keywords: bookData.keywords,
          popularity: faker.number.float({ min: 0, max: 10,  }),
          averageRating: faker.number.float({ min: 3.5, max: 5,  }),
          totalRatings: faker.number.int({ min: 10, max: 1000 }),
          totalFavorites: faker.number.int({ min: 5, max: 500 }),
        },
      });

      createdBooks.push(book);
      console.log(`    ✅ Created successfully`);
      await delay(100);
    } catch (error: any) {
      console.error(`    ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n  ✓ Created ${createdBooks.length} books\n`);

  // 6. Create Ratings
  console.log('⭐ Creating ratings...');
  let ratingsCount = 0;
  for (const book of createdBooks) {
    const numRatings = faker.number.int({ min: 5, max: 20 });
    const usersToRate = faker.helpers.arrayElements(regularUsers, numRatings);

    for (const user of usersToRate) {
      try {
        await prisma.rating.create({
          data: {
            userId: user.id,
            bookId: book.id,
            rating: faker.number.int({ min: 3, max: 5 }),
            review: Math.random() > 0.5 ? faker.lorem.paragraph() : undefined,
          },
        });
        ratingsCount++;
      } catch (error) {
        // Skip duplicate ratings
      }
    }
  }
  console.log(`  ✓ Created ${ratingsCount} ratings\n`);

  // 7. Create Favorites
  console.log('❤️ Creating favorites...');
  let favoritesCount = 0;
  for (const user of regularUsers) {
    const numFavorites = faker.number.int({ min: 3, max: 10 });
    const favBooks = faker.helpers.arrayElements(createdBooks, numFavorites);

    for (const book of favBooks) {
      try {
        await prisma.favorite.create({
          data: {
            userId: user.id,
            bookId: book.id,
          },
        });
        favoritesCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`  ✓ Created ${favoritesCount} favorites\n`);

  // 8. Create Loans
  console.log('📤 Creating loans...');
  let loansCount = 0;
  for (const user of regularUsers) {
    const numLoans = faker.number.int({ min: 1, max: 5 });
    const loanBooks = faker.helpers.arrayElements(createdBooks, numLoans);

    for (const book of loanBooks) {
      const loanDate = faker.date.past({ years: 1 });
      const dueDate = new Date(loanDate);
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks loan period

      const status = Math.random() > 0.3 ? LoanStatus.RETURNED : LoanStatus.ACTIVE;
      const returnDate = status === LoanStatus.RETURNED 
        ? faker.date.between({ from: loanDate, to: dueDate })
        : undefined;

      await prisma.loan.create({
        data: {
          userId: user.id,
          bookId: book.id,
          loanDate,
          dueDate,
          returnDate,
          status,
        },
      });
      loansCount++;
    }
  }
  console.log(`  ✓ Created ${loansCount} loans\n`);

  // 9. Create Reading History
  console.log('📊 Creating reading history...');
  let historyCount = 0;
  for (const user of regularUsers) {
    const numHistory = faker.number.int({ min: 5, max: 15 });
    const historyBooks = faker.helpers.arrayElements(createdBooks, numHistory);

    for (const book of historyBooks) {
      try {
        const startedAt = faker.date.past({ years: 1 });
        const lastReadAt = faker.date.between({ 
          from: startedAt, 
          to: new Date() 
        });
        const completed = Math.random() > 0.4;
        const finishedAt = completed 
          ? faker.date.between({ from: lastReadAt, to: new Date() })
          : undefined;

        await prisma.readingHistory.create({
          data: {
            userId: user.id,
            bookId: book.id,
            startedAt,
            lastReadAt,
            finishedAt,
            pagesRead: completed 
              ? parseInt(book.pages || '0') 
              : faker.number.int({ min: 10, max: parseInt(book.pages || '100') }),
            readingTimeMinutes: faker.number.int({ min: 60, max: 600 }),
            completed,
          },
        });
        historyCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`  ✓ Created ${historyCount} reading history entries\n`);

  // 10. Create User Preferences
  console.log('⚙️ Creating user preferences...');
  let preferencesCount = 0;
  for (const user of regularUsers) {
    // Category preferences
    const favCategories = faker.helpers.arrayElements(createdCategories, 
      faker.number.int({ min: 2, max: 5 })
    );
    
    for (const category of favCategories) {
      try {
        await prisma.userPreference.create({
          data: {
            userId: user.id,
            categoryId: category.id,
            weight: faker.number.float({ min: 1, max: 10,  }),
          },
        });
        preferencesCount++;
      } catch (error) {
        // Skip duplicates
      }
    }

    // Author preferences
    const favAuthors = faker.helpers.arrayElements(createdAuthors, 
      faker.number.int({ min: 1, max: 3 })
    );
    
    for (const author of favAuthors) {
      try {
        await prisma.userPreference.create({
          data: {
            userId: user.id,
            authorId: author.id,
            weight: faker.number.float({ min: 1, max: 10,  }),
          },
        });
        preferencesCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }
  console.log(`  ✓ Created ${preferencesCount} user preferences\n`);

  // 11. Create Recommendation Logs
  console.log('🎯 Creating recommendation logs...');
  let recoCount = 0;
  const algorithms = ['collaborative-filtering', 'content-based', 'hybrid', 'popularity-based'];
  
  for (const user of regularUsers) {
    const numRecommendations = faker.number.int({ min: 10, max: 30 });
    const recoBooks = faker.helpers.arrayElements(createdBooks, numRecommendations);

    for (const book of recoBooks) {
      await prisma.recommendationLog.create({
        data: {
          userId: user.id,
          bookId: book.id,
          algorithm: faker.helpers.arrayElement(algorithms),
          score: faker.number.float({ min: 0, max: 1,  }),
          clicked: Math.random() > 0.7,
          interacted: Math.random() > 0.8,
        },
      });
      recoCount++;
    }
  }
  console.log(`  ✓ Created ${recoCount} recommendation logs\n`);

  // 12. Create Purchases
  console.log('💰 Creating purchases...');
  let purchaseCount = 0;
  
  for (const user of regularUsers.slice(0, 5)) {
    // Create billing address
    const address = await prisma.billingAddress.create({
      data: {
        userId: user.id,
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
      },
    });

    // Create checkout
    const checkoutDate = faker.date.past({ years: 1 });
    const dueDate = new Date(checkoutDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const booksForPurchase = faker.helpers.arrayElements(createdBooks, 
      faker.number.int({ min: 1, max: 5 })
    );

    const totalPrice = booksForPurchase.reduce((sum, book) => sum + book.price, 0);

    const checkout = await prisma.checkout.create({
      data: {
        userId: user.id,
        checkoutDate,
        dueDate,
        totalPrice,
        address: {
          connect: { id: address.id },
        },
      },
    });

    // Create purchases for each book
    for (const book of booksForPurchase) {
      await prisma.purchase.create({
        data: {
          userId: user.id,
          bookId: book.id,
          checkoutId: checkout.id,
          purchaseDate: checkoutDate,
          price: book.price,
          quantity: 1,
        },
      });
      purchaseCount++;
    }
  }
  console.log(`  ✓ Created ${purchaseCount} purchases\n`);

  // Final Summary
  console.log('\n✅ ==========================================');
  console.log('🎉 Book Library Seeding Completed!');
  console.log('============================================\n');

  const finalCounts = {
    users: await prisma.user.count(),
    authors: await prisma.author.count(),
    publishers: await prisma.publisher.count(),
    categories: await prisma.category.count(),
    books: await prisma.book.count(),
    ratings: await prisma.rating.count(),
    favorites: await prisma.favorite.count(),
    loans: await prisma.loan.count(),
    readingHistory: await prisma.readingHistory.count(),
    userPreferences: await prisma.userPreference.count(),
    recommendationLogs: await prisma.recommendationLog.count(),
    purchases: await prisma.purchase.count(),
  };

  console.log('📊 Final Summary:');
  console.log('==================');
  console.log(`✓ Users:               ${finalCounts.users}`);
  console.log(`✓ Authors:             ${finalCounts.authors}`);
  console.log(`✓ Publishers:          ${finalCounts.publishers}`);
  console.log(`✓ Categories:          ${finalCounts.categories}`);
  console.log(`✓ Books:               ${finalCounts.books}`);
  console.log(`✓ Ratings:             ${finalCounts.ratings}`);
  console.log(`✓ Favorites:           ${finalCounts.favorites}`);
  console.log(`✓ Loans:               ${finalCounts.loans}`);
  console.log(`✓ Reading History:     ${finalCounts.readingHistory}`);
  console.log(`✓ User Preferences:    ${finalCounts.userPreferences}`);
  console.log(`✓ Recommendation Logs: ${finalCounts.recommendationLogs}`);
  console.log(`✓ Purchases:           ${finalCounts.purchases}`);
  console.log('==================\n');

  console.log('🔐 Login Credentials:');
  console.log('   Email: admin@booklibrary.com');
  console.log('   Password: password123\n');

  console.log('📚 Features:');
  console.log('   • Real classic books with actual PDF links');
  console.log('   • Historical authors with biographical data');
  console.log('   • Realistic reading patterns and preferences');
  console.log('   • Complete recommendation system data');
  console.log('   • Purchase history and checkouts');
  console.log('   • Active and returned loans');
  console.log('   • User ratings and reviews\n');
}

main()
  .catch((e: any) => {
    console.error('\n❌ ==========================================');
    console.error('💥 Error seeding database:');
    console.error('============================================');
    console.error(e);
    console.error('============================================\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });