// Comprehensive book data for Text Mastery feature
// This file contains detailed analysis, themes, quotes, and contexts for HSC texts

export interface BookData {
  id: string
  title: string
  author: string
  publicationYear: number | string
  genre: string
  coverImage: string
  introduction: string
  themes: Theme[]
  rubricConnections: RubricConnection[]
  contexts: Contexts
  timelineEvents: TimelineEvent[]
  contemporaryConnections: ContemporaryConnection[]
  additionalResources: AdditionalResource[]
  quotes: Quote[]
  techniques: Technique[]
}

export interface Theme {
  id: string
  title: string
  icon: string
  summary: string
  color: string
  examples: string[]
}

export interface RubricConnection {
  concept: string
  explanation: string
  textConnections: string
}

export interface Contexts {
  historical: Context
  cultural: Context
  biographical: Context
  philosophical: Context
}

export interface Context {
  title: string
  content: string
  keyPoints: string[]
}

export interface TimelineEvent {
  year: number
  event: string
  type: "Author" | "World" | "Book" | "Legacy" | "Contemporary"
}

export interface ContemporaryConnection {
  title: string
  description: string
  modernExample: string
}

export interface AdditionalResource {
  title: string
  author: string
  description: string
  type: string
}

export interface Quote {
  id: string
  text: string
  reference: string
  technique: string
  themes: string[]
  explanation: string
  rubricConnection: string
  chapter: string
  character: string
  significance: "high" | "medium" | "low"
}

export interface Technique {
  name: string
  definition: string
  example?: string
}

// Comprehensive book data for all available books
export const bookData: Record<string, BookData> = {
  "nineteen-eighty-four": {
    id: "nineteen-eighty-four",
    title: "Nineteen Eighty-Four",
    author: "George Orwell",
    publicationYear: 1949,
    genre: "Dystopian Fiction",
    coverImage: "/big-brother-eye.png",
    introduction:
      "A dystopian social science fiction novel that explores themes of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.",
    themes: [
      {
        id: "theme1",
        title: "Totalitarianism and Control",
        icon: "shield",
        summary:
          "Orwell's masterful portrayal of totalitarianism serves as a warning against political systems that seek absolute control over every aspect of human life. The Party, led by the enigmatic figure Big Brother, maintains power through constant surveillance, propaganda, manipulation of history, and brutal punishment.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The omnipresent telescreens that monitor citizens' every move",
          "The Thought Police who detect and punish thoughtcrime",
          "Ministry of Truth's systematic falsification of historical records",
          "The concept of doublethink - holding contradictory beliefs simultaneously",
        ],
      },
      {
        id: "theme2",
        title: "Language and Reality",
        icon: "speech",
        summary:
          "Through Newspeak, the official language of Oceania, Orwell explores how language shapes thought and how controlling language can limit freedom of expression and even thought itself.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "Newspeak - designed to limit freedom of thought",
          "Winston's job rewriting history at the Ministry of Truth",
          "The slogan 'War is Peace, Freedom is Slavery, Ignorance is Strength'",
          "The concept of 'blackwhite' - the ability to believe contradictions",
        ],
      },
      {
        id: "theme3",
        title: "Surveillance and Privacy",
        icon: "eye",
        summary:
          "In the world of Nineteen Eighty-Four, surveillance is pervasive and inescapable. The novel explores how constant monitoring transforms human behavior and psychology, creating a society where genuine privacy is impossible and spontaneity dangerous.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The telescreen in Winston's apartment that cannot be turned off",
          "Children spying on adults, including their parents",
          "Winston searching for blind spots to write his diary",
          "The hidden microphones in the countryside and forests",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The novel presents numerous paradoxes, from the contradictory slogans of the Party ('War is Peace, Freedom is Slavery, Ignorance is Strength') to the paradoxical function of the four ministries.",
        textConnections:
          "The Ministry of Truth spreads lies, the Ministry of Peace wages war, Winston's job is to destroy truth while serving 'Truth'",
      },
      {
        concept: "Emotional Experiences",
        explanation:
          "Orwell presents a complex exploration of human emotions under oppression, including fear, love, hatred, and loyalty.",
        textConnections:
          "Winston and Julia's love as rebellion, the Two Minutes Hate ritual, Winston's conflicted feelings about O'Brien",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written in 1948, Nineteen Eighty-Four reflects Orwell's concerns about totalitarian regimes that rose to power in the early-to-mid 20th century. The novel draws particularly on elements of Stalinism in the Soviet Union and aspects of Nazi Germany.",
        keyPoints: [
          "Written in post-WWII period during early Cold War tensions",
          "Influenced by rise of totalitarian regimes (Soviet Union, Nazi Germany)",
          "Orwell's experiences in the Spanish Civil War shaped his views on propaganda",
          "Published at the beginning of nuclear age and heightened surveillance practices",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The novel emerged during a period of significant social and technological change in Western society. Post-war austerity in Britain formed part of the immediate cultural backdrop.",
        keyPoints: [
          "Post-war austerity in Britain reflected in the novel's depictions of shortages",
          "Growing concerns about mass media manipulation of public opinion",
          "Debates about collectivism vs. individualism in Western political thought",
          "Rising awareness of propaganda techniques following World War II",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "George Orwell drew on his various life experiences in crafting Nineteen Eighty-Four. His time as an imperial police officer in Burma gave him insight into the mechanics of institutional power and oppression.",
        keyPoints: [
          "Orwell's experience as an imperial police officer in Burma",
          "His democratic socialist beliefs and criticism of totalitarian implementations",
          "Firsthand witness to propaganda and historical revisionism in Spanish Civil War",
          "Written while Orwell was critically ill with tuberculosis",
        ],
      },
      philosophical: {
        title: "Philosophical and Literary Context",
        content:
          "Nineteen Eighty-Four engages with several philosophical traditions, particularly those concerned with truth, language, and power. It reflects elements of linguistic determinism through its exploration of how Newspeak limits thought.",
        keyPoints: [
          "Engages with linguistic determinism through Newspeak",
          "Connects to existentialist concerns about authenticity under social pressure",
          "Builds on earlier dystopian traditions (Zamyatin's 'We', Huxley's 'Brave New World')",
          "Expands on themes from Orwell's 'Animal Farm' about corrupted revolutions",
        ],
      },
    },
    timelineEvents: [
      { year: 1903, event: "Birth of George Orwell (Eric Arthur Blair)", type: "Author" },
      { year: 1948, event: "Orwell completes manuscript of Nineteen Eighty-Four", type: "Book" },
      { year: 1949, event: "Publication of Nineteen Eighty-Four", type: "Book" },
      { year: 1950, event: "Death of George Orwell", type: "Author" },
      { year: 2013, event: "Edward Snowden reveals global surveillance programs", type: "Contemporary" },
    ],
    contemporaryConnections: [
      {
        title: "Government Surveillance",
        description:
          "The revelations by Edward Snowden about NSA surveillance programs brought Orwell's predictions about government monitoring into sharp focus.",
        modernExample: "Mass data collection by intelligence agencies, CCTV networks, and facial recognition systems",
      },
      {
        title: "Information Manipulation",
        description:
          "The concept of 'fake news', social media echo chambers, and algorithmic curation of information all relate to Orwell's warnings about the manipulation of facts.",
        modernExample: "Targeted misinformation campaigns, deep fake technology, and media bias",
      },
    ],
    additionalResources: [
      {
        title: "Orwell: A Life in Letters",
        author: "George Orwell (ed. Peter Davison)",
        description: "Collection of Orwell's correspondence providing insight into his thinking while writing Nineteen Eighty-Four",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "q1",
        text: "War is peace. Freedom is slavery. Ignorance is strength.",
        reference: "Part 1, Chapter 1, p. 6",
        technique: "Paradox",
        themes: ["Totalitarianism and Control", "Language and Reality"],
        explanation:
          "This slogan of the Party exemplifies doublethink, requiring citizens to accept contradictory beliefs simultaneously.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Part 1, Chapter 1",
        character: "Party Slogan",
        significance: "high",
      },
      {
        id: "q2",
        text: "Big Brother is watching you.",
        reference: "Part 1, Chapter 1, p. 3",
        technique: "Symbolism",
        themes: ["Surveillance and Privacy", "Totalitarianism and Control"],
        explanation:
          "This ubiquitous slogan symbolizes the omnipresent surveillance state.",
        rubricConnection: "Emotional Experiences",
        chapter: "Part 1, Chapter 1",
        character: "Party Slogan",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Paradox",
        definition: "A statement that appears contradictory but may reveal a deeper truth",
        example: "War is peace. Freedom is slavery. Ignorance is strength.",
      },
      {
        name: "Symbolism",
        definition: "The use of symbols to represent ideas or qualities",
        example: "Big Brother represents the omnipresent surveillance state.",
      },
    ],
  },

  "frankenstein": {
    id: "frankenstein",
    title: "Frankenstein",
    author: "Mary Shelley",
    publicationYear: 1818,
    genre: "Gothic Fiction",
    coverImage: "/frankenstein-book-cover.png",
    introduction:
      "A Gothic novel that explores themes of creation, responsibility, isolation, and the dangers of unchecked ambition through the story of Victor Frankenstein and his creature.",
    themes: [
      {
        id: "theme1",
        title: "Creation and Responsibility",
        icon: "shield",
        summary:
          "Shelley explores the moral implications of creation and the responsibility creators have toward their creations. Victor's abandonment of his creature leads to tragic consequences.",
        color: "bg-red-100 border-red-300",
        examples: [
          "Victor's initial enthusiasm for creating life",
          "His immediate abandonment of the creature upon its animation",
          "The creature's demand for a companion",
          "Victor's refusal to create a female creature",
        ],
      },
      {
        id: "theme2",
        title: "Isolation and Alienation",
        icon: "heart",
        summary:
          "Both Victor and his creature experience profound isolation - Victor through his obsessive pursuits, and the creature through his rejection by society.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "Victor's isolation during his scientific experiments",
          "The creature's solitude in the wilderness",
          "Victor's inability to share his burden with others",
          "The creature's rejection by the De Lacey family",
        ],
      },
      {
        id: "theme3",
        title: "Nature vs. Nurture",
        icon: "book",
        summary:
          "The novel questions whether the creature's violent nature is inherent or learned through his experiences of rejection and abandonment.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The creature's initial benevolent observations of humanity",
          "His gradual turn to violence after repeated rejections",
          "His self-education through reading Paradise Lost and other texts",
          "The contrast between his eloquence and his perceived monstrosity",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The novel presents the paradox of the creature being both victim and monster, and Victor being both creator and destroyer.",
        textConnections:
          "The creature's eloquence despite his monstrous appearance; Victor's pursuit of life leading to death and destruction",
      },
      {
        concept: "Emotional Experiences",
        explanation:
          "Shelley explores intense emotions including obsession, guilt, revenge, and the longing for companionship and acceptance.",
        textConnections:
          "Victor's obsessive pursuit of knowledge; the creature's rage and loneliness; the mutual hatred between creator and creation",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written during the Romantic period, Frankenstein reflects the era's fascination with science, nature, and the supernatural. The Industrial Revolution was transforming society, raising questions about progress and its consequences.",
        keyPoints: [
          "Written during the Romantic movement's emphasis on emotion and nature",
          "Reflects concerns about rapid scientific and technological advancement",
          "Influenced by galvanism experiments and early electrical discoveries",
          "Gothic tradition of exploring the darker aspects of human nature",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The novel emerged from the famous summer of 1816 when Mary Shelley, Percy Shelley, Lord Byron, and others gathered in Switzerland and challenged each other to write ghost stories.",
        keyPoints: [
          "Created during the 'Year Without a Summer' due to volcanic winter",
          "Part of the Romantic literary movement",
          "Reflects changing attitudes toward science and religion",
          "Influenced by Gothic literary traditions",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Mary Shelley wrote Frankenstein when she was just 18 years old. Her experiences with death, including the loss of her mother and later her own children, influenced the novel's themes of creation and loss.",
        keyPoints: [
          "Written by Mary Shelley at age 18",
          "Influenced by her mother Mary Wollstonecraft's feminist ideas",
          "Reflects her experiences with pregnancy, childbirth, and infant loss",
          "Written in the company of Percy Shelley and Lord Byron",
        ],
      },
      philosophical: {
        title: "Philosophical and Literary Context",
        content:
          "The novel engages with Enlightenment ideas about reason and science while also embracing Romantic concerns about emotion, nature, and the limits of human knowledge.",
        keyPoints: [
          "Questions the Enlightenment faith in reason and scientific progress",
          "Explores Romantic themes of nature, emotion, and the sublime",
          "Engages with debates about materialism and the nature of life",
          "Influenced by Paradise Lost and other literary works",
        ],
      },
    },
    timelineEvents: [
      { year: 1797, event: "Birth of Mary Shelley", type: "Author" },
      { year: 1816, event: "The 'ghost story' contest that inspired Frankenstein", type: "Book" },
      { year: 1818, event: "Publication of Frankenstein", type: "Book" },
      { year: 1831, event: "Revised edition of Frankenstein published", type: "Book" },
      { year: 1851, event: "Death of Mary Shelley", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Genetic Engineering and Bioethics",
        description:
          "Modern debates about genetic modification, cloning, and synthetic biology echo Frankenstein's warnings about the responsibilities that come with the power to create life.",
        modernExample: "CRISPR gene editing, synthetic biology, and debates about 'designer babies'",
      },
      {
        title: "Artificial Intelligence",
        description:
          "Contemporary discussions about AI consciousness and rights parallel the creature's demands for recognition and treatment as a sentient being.",
        modernExample: "Debates about AI rights, consciousness, and the responsibility of AI creators",
      },
    ],
    additionalResources: [
      {
        title: "Mary Shelley: Her Life, Her Fiction, Her Monsters",
        author: "Anne K. Mellor",
        description: "Comprehensive analysis of Shelley's life and works",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "f1",
        text: "Beware; for I am fearless, and therefore powerful.",
        reference: "Chapter 20",
        technique: "Characterization",
        themes: ["Isolation and Alienation", "Creation and Responsibility"],
        explanation:
          "The creature's declaration reveals how his abandonment has transformed him into a force of destruction.",
        rubricConnection: "Emotional Experiences",
        chapter: "Chapter 20",
        character: "The Creature",
        significance: "high",
      },
      {
        id: "f2",
        text: "I ought to be thy Adam, but I am rather the fallen angel.",
        reference: "Chapter 10",
        technique: "Allusion",
        themes: ["Creation and Responsibility", "Nature vs. Nurture"],
        explanation:
          "The creature compares himself to both Adam and Satan, highlighting his complex relationship with his creator.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Chapter 10",
        character: "The Creature",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Gothic Elements",
        definition: "Literary devices that create an atmosphere of mystery, suspense, and horror",
        example: "The dark, stormy nights and isolated settings throughout the novel",
      },
      {
        name: "Frame Narrative",
        definition: "A story within a story, often used to provide different perspectives",
        example: "Walton's letters containing Victor's story containing the creature's story",
      },
    ],
  },

  "hamlet": {
    id: "hamlet",
    title: "Hamlet",
    author: "William Shakespeare",
    publicationYear: 1601,
    genre: "Tragedy",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A tragedy that explores themes of revenge, madness, mortality, and the complexity of action versus inaction through the story of Prince Hamlet's quest to avenge his father's murder.",
    themes: [
      {
        id: "theme1",
        title: "Revenge and Justice",
        icon: "shield",
        summary:
          "The play examines different approaches to revenge through Hamlet, Laertes, and Fortinbras, questioning whether revenge can ever truly bring justice.",
        color: "bg-red-100 border-red-300",
        examples: [
          "Hamlet's delayed revenge against Claudius",
          "Laertes' immediate desire for revenge for his father's death",
          "Fortinbras' military action to reclaim his father's lands",
          "The play-within-a-play as Hamlet's method of seeking truth",
        ],
      },
      {
        id: "theme2",
        title: "Madness and Sanity",
        icon: "speech",
        summary:
          "Shakespeare explores the thin line between sanity and madness, examining both genuine mental distress and performed madness as a form of protection or strategy.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "Hamlet's 'antic disposition' - his performed madness",
          "Ophelia's genuine madness following her father's death",
          "The question of whether Hamlet's madness becomes real",
          "The madness of grief and its effects on rational thought",
        ],
      },
      {
        id: "theme3",
        title: "Appearance vs. Reality",
        icon: "eye",
        summary:
          "The play constantly questions what is real and what is performance, from the ghost's authenticity to characters' true motivations and the nature of truth itself.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The ghost of Hamlet's father - is it real or a demon?",
          "Claudius' public face versus his private guilt",
          "Hamlet's performed madness versus his genuine emotional state",
          "The play-within-a-play revealing hidden truths",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "Hamlet is filled with paradoxes: delay in a revenge play, madness that reveals truth, and a hero who causes more death than he prevents.",
        textConnections:
          "Hamlet's intellectual approach to a passionate duty; his madness revealing deeper truths; his moral concerns leading to multiple deaths",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "The play explores the limits of human knowledge and understanding, particularly regarding death, morality, and the supernatural.",
        textConnections:
          "Hamlet's soliloquies questioning existence and knowledge; the uncertainty about the ghost's nature; the mysteries of death and afterlife",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written during the Elizabethan era, Hamlet reflects the political anxieties of Shakespeare's time, including concerns about succession, foreign invasion, and religious conflict.",
        keyPoints: [
          "Written during Elizabeth I's reign, concerns about succession",
          "Reflects anxieties about Catholic vs. Protestant conflicts",
          "The Danish court mirrors Elizabethan court politics",
          "Contemporary interest in revenge tragedy as a genre",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The play emerged during the English Renaissance, a time of cultural flowering and intellectual exploration, including new ideas about psychology, politics, and human nature.",
        keyPoints: [
          "Part of the English Renaissance literary flowering",
          "Reflects new humanistic ideas about individual psychology",
          "Influenced by classical tragedy and contemporary revenge plays",
          "Performed in the new public theaters of London",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Shakespeare wrote Hamlet during his mature period, possibly influenced by the death of his son Hamnet and his own reflections on mortality, fatherhood, and loss.",
        keyPoints: [
          "Written during Shakespeare's mature creative period",
          "Possibly influenced by the death of his son Hamnet (1596)",
          "Reflects Shakespeare's deepening exploration of psychological complexity",
          "Shows influence of his reading of classical and contemporary sources",
        ],
      },
      philosophical: {
        title: "Philosophical and Literary Context",
        content:
          "Hamlet engages with Renaissance humanist philosophy, exploring questions of free will, moral action, and the nature of knowledge and reality.",
        keyPoints: [
          "Engages with Renaissance humanist ideas about individual agency",
          "Explores classical and Christian approaches to ethics and mortality",
          "Reflects contemporary interest in Stoic philosophy",
          "Draws on classical tragedy while innovating dramatic form",
        ],
      },
    },
    timelineEvents: [
      { year: 1564, event: "Birth of William Shakespeare", type: "Author" },
      { year: 1596, event: "Death of Shakespeare's son Hamnet", type: "Author" },
      { year: 1600, event: "Probable composition of Hamlet", type: "Book" },
      { year: 1603, event: "First quarto of Hamlet published", type: "Book" },
      { year: 1616, event: "Death of William Shakespeare", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Mental Health Awareness",
        description:
          "Modern understanding of depression, PTSD, and grief provides new insights into Hamlet's psychological state and behavior.",
        modernExample: "Clinical depression, trauma responses, and the psychological effects of loss and betrayal",
      },
      {
        title: "Political Corruption and Truth",
        description:
          "Contemporary concerns about political corruption, media manipulation, and the difficulty of determining truth in complex situations.",
        modernExample: "Political scandals, media spin, and the challenge of finding truth in polarized environments",
      },
    ],
    additionalResources: [
      {
        title: "Hamlet in Purgatory",
        author: "Stephen Greenblatt",
        description: "Explores the religious and cultural contexts of the ghost in Hamlet",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "h1",
        text: "To be or not to be, that is the question.",
        reference: "Act 3, Scene 1",
        technique: "Soliloquy",
        themes: ["Madness and Sanity", "Revenge and Justice"],
        explanation:
          "Hamlet's most famous soliloquy explores the fundamental question of existence and the contemplation of suicide as escape from suffering.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Act 3, Scene 1",
        character: "Hamlet",
        significance: "high",
      },
      {
        id: "h2",
        text: "Something is rotten in the state of Denmark.",
        reference: "Act 1, Scene 4",
        technique: "Metaphor",
        themes: ["Appearance vs. Reality", "Revenge and Justice"],
        explanation:
          "Marcellus' observation suggests that corruption has infected the entire kingdom, not just the royal court.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Act 1, Scene 4",
        character: "Marcellus",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Soliloquy",
        definition: "A dramatic device where a character speaks their thoughts aloud when alone",
        example: "Hamlet's 'To be or not to be' soliloquy",
      },
      {
        name: "Dramatic Irony",
        definition: "When the audience knows something that characters on stage do not",
        example: "The audience knows Hamlet is only pretending to be mad",
      },
    ],
  },

  "great-gatsby": {
    id: "great-gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publicationYear: 1925,
    genre: "Novel",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A novel that explores themes of wealth, class, love, and the American Dream in the Jazz Age.",
    themes: [
      {
        id: "theme1",
        title: "The American Dream",
        icon: "star",
        summary:
          "The novel critiques the idea of the American Dream, revealing its emptiness and the disillusionment it brings.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The Gatsby mansion as a symbol of the American Dream",
          "The contrast between the glamorous exterior and the decaying interior",
          "The tragic endings of characters who chase the American Dream",
          "The theme of the green light at the end of Daisy's dock",
        ],
      },
      {
        id: "theme2",
        title: "Class and Wealth",
        icon: "dollar-sign",
        summary:
          "The novel explores the social hierarchy and the consequences of wealth and class, particularly in the Roaring Twenties.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "The stark contrast between the wealthy elite and the working class",
          "The Gatsby mansion as a symbol of excessive wealth",
          "The theme of the Valley of Ashes representing the forgotten working class",
          "The social climbing of characters like Tom and Daisy Buchanan",
        ],
      },
      {
        id: "theme3",
        title: "Love and Desire",
        icon: "heart",
        summary:
          "The novel explores the complexities of love, desire, and the consequences of unfulfilled longing.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The tragic love triangle between Gatsby, Daisy, and Tom",
          "The theme of the green light at the end of Daisy's dock",
          "The unattainable nature of love and the pain it causes",
          "The theme of the Valley of Ashes representing unfulfilled desires",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The novel presents paradoxes such as the emptiness of the American Dream and the unattainable nature of love.",
        textConnections:
          "The Gatsby mansion as a symbol of the American Dream's emptiness; the unattainable nature of love and the pain it causes",
      },
      {
        concept: "Emotional Experiences",
        explanation:
          "The novel explores intense emotions such as longing, desire, and the pain of unfulfilled love.",
        textConnections:
          "The tragic love triangle between Gatsby, Daisy, and Tom; the theme of the green light at the end of Daisy's dock",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written during the Roaring Twenties, The Great Gatsby reflects the era's fascination with wealth, excess, and the American Dream.",
        keyPoints: [
          "Written during the Roaring Twenties, a time of economic prosperity",
          "Reflects the social and cultural changes of the Jazz Age",
          "The novel critiques the excesses and emptiness of the American Dream",
          "Explores the social hierarchy and class divisions of the time",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The novel emerged from the literary movement of the Lost Generation, which questioned the values and ideals of the modern world.",
        keyPoints: [
          "Part of the Lost Generation literary movement",
          "Reflects the cultural and social changes of the Jazz Age",
          "Critiques the excesses and emptiness of the American Dream",
          "Explores the social hierarchy and class divisions of the time",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "F. Scott Fitzgerald wrote The Great Gatsby during a period of personal crisis, including the end of his marriage and the death of his daughter.",
        keyPoints: [
          "Written during a period of personal crisis for Fitzgerald",
          "The novel reflects Fitzgerald's experiences and observations",
          "The characters and themes reflect Fitzgerald's own struggles and concerns",
          "The novel was inspired by Fitzgerald's experiences in the Roaring Twenties",
        ],
      },
      philosophical: {
        title: "Philosophical and Literary Context",
        content:
          "The novel engages with philosophical ideas about the nature of reality, the American Dream, and the human condition.",
        keyPoints: [
          "Explores the nature of reality and the American Dream",
          "Reflects on the human condition and the pursuit of happiness",
          "Draws on classical and modern literary traditions",
          "Influenced by the philosophical and cultural currents of its time",
        ],
      },
    },
    timelineEvents: [
      { year: 1896, event: "Birth of F. Scott Fitzgerald", type: "Author" },
      { year: 1925, event: "Publication of The Great Gatsby", type: "Book" },
      { year: 1926, event: "Death of F. Scott Fitzgerald", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Wealth and Inequality",
        description:
          "The novel's exploration of wealth, class, and the American Dream resonates with contemporary debates about inequality and social mobility.",
        modernExample: "The wealth gap, income inequality, and the pursuit of the American Dream",
      },
      {
        title: "Love and Desire",
        description:
          "The novel's exploration of love, desire, and the pain of unfulfilled longing continues to resonate with modern readers.",
        modernExample: "The complexities of love, desire, and the consequences of unfulfilled longing",
      },
    ],
    additionalResources: [
      {
        title: "The Great Gatsby and the American Dream",
        author: "Carl Van Doren",
        description: "An analysis of the novel's critique of the American Dream",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "g1",
        text: "You are a son of God.",
        reference: "Chapter 5",
        technique: "Dialogue",
        themes: ["The American Dream", "Love and Desire"],
        explanation:
          "Nick Carraway's words to Gatsby reflect the American Dream's promise of success and the allure of wealth.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Chapter 5",
        character: "Nick Carraway",
        significance: "high",
      },
      {
        id: "g2",
        text: "I'm a fool, and a coward, and everything's terrible, but I'm in love.",
        reference: "Chapter 9",
        technique: "Monologue",
        themes: ["Love and Desire", "Class and Wealth"],
        explanation:
          "Gatsby's declaration of love for Daisy Buchanan reflects the pain of unfulfilled longing and the emptiness of the American Dream.",
        rubricConnection: "Emotional Experiences",
        chapter: "Chapter 9",
        character: "Jay Gatsby",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Stream of Consciousness",
        definition: "A narrative technique that presents the inner thoughts and feelings of a character",
        example: "The opening section of the novel presents Nick Carraway's stream of consciousness",
      },
      {
        name: "Symbolism",
        definition: "The use of symbols to represent ideas or qualities",
        example: "The green light at the end of Daisy's dock symbolizes the unattainable nature of love",
      },
    ],
  },

  "slessor-poems": {
    id: "slessor-poems",
    title: "Selected Poems",
    author: "Kenneth Slessor",
    publicationYear: "Various",
    genre: "Poetry",
    coverImage: null,
    introduction:
      "Poetry that explores themes of time, memory, and Australian landscape.",
    themes: [
      {
        id: "theme1",
        title: "Time and Memory",
        icon: "clock",
        summary:
          "Slessor's poems delve into the complexities of time, memory, and the passage of years.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The interplay between past and present in 'The Old Man's Dream'",
          "The exploration of memory and loss in 'The Old Man's Dream'",
          "The theme of time's relentless flow in 'The Old Man's Dream'",
          "The contrast between the timelessness of nature and the fleeting nature of life",
        ],
      },
      {
        id: "theme2",
        title: "Australian Landscape",
        icon: "map-pin",
        summary:
          "Slessor's poems capture the beauty and complexity of the Australian landscape, from the outback to the coast.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "The vastness and isolation of the outback in 'The Old Man's Dream'",
          "The bustling yet indifferent city in 'William Street'",
          "The artificiality and consumerism of 'Crowds'",
          "The search for meaning amidst urban sprawl",
          "The contrast between natural and artificial environments",
        ],
      },
      {
        id: "theme3",
        title: "Memory and the Past",
        icon: "book-open",
        summary:
          "Slessor explores the power of memory to preserve or distort the past, and the relationship between personal memory and historical time.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The memories invoked in 'Five Bells' about Joe Lynch",
          "The struggle to hold onto transient moments in 'Out of Time'",
          "The elusive nature of the past",
          "The role of nostalgia and remembrance",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "Slessor's poetry often presents paradoxes, such as the simultaneity of past and present, or the vitality of death in 'Five Bells'.",
        textConnections:
          "The dead returning to life in memory; the beauty found in decay; the presence of absence",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "His poems explore the human mind's attempts to comprehend time, memory, and the vastness of existence, often highlighting the limitations of this capacity.",
        textConnections:
          "The struggle to grasp the nature of time; the limits of memory; the search for meaning in a chaotic world",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Slessor's poetry spans a period of significant change in Australia (early to mid-20th century), including the impact of two World Wars and the Great Depression.",
        keyPoints: [
          "Interwar period and post-WWII Australia",
          "Influence of modernism in literature and art",
          "Development of Australian identity and nationalism",
          "The Great Depression's impact on society",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "His work is central to Australian modernism, reflecting a departure from traditional poetic forms and a focus on Australian subjects and landscapes.",
        keyPoints: [
          "Australian modernist movement in poetry",
          "Influence of French Symbolism and T.S. Eliot",
          "Focus on urban Australian landscapes (Sydney)",
          "Development of a distinct Australian poetic voice",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Slessor worked as a journalist and war correspondent, experiences that influenced his observational skills and his engagement with reality.",
        keyPoints: [
          "Slessor's career as a journalist and editor",
          "His role as an official war correspondent in WWII",
          "His love for Sydney and its harbor",
          "His engagement with philosophical questions about time",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "Slessor's poetry engages with existentialist concerns about the fleeting nature of life, the search for meaning, and the individual's place in the universe.",
        keyPoints: [
          "Existentialist themes of meaninglessness and transience",
          "Philosophical questions about the nature of time",
          "The individual's confrontation with oblivion",
          "The role of memory in constructing reality",
        ],
      },
    },
    timelineEvents: [
      { year: 1901, event: "Birth of Kenneth Slessor", type: "Author" },
      { year: 1926, event: "Earth Visitors published", type: "Book" },
      { year: 1942, event: "One Hundred Poems published", type: "Book" },
      { year: 1971, event: "Death of Kenneth Slessor", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Urbanization and Identity",
        description:
          "Slessor's exploration of urban life and its impact on identity remains relevant in an increasingly urbanized world.",
        modernExample: "The impact of mega-cities on individual well-being, urban alienation, and the search for community in cities.",
      },
      {
        title: "The Digital Age and Memory",
        description:
          "His concerns about memory and the past resonate with contemporary discussions about digital archiving, personal data, and the way technology shapes our remembrance.",
        modernExample: "Social media's impact on memory, digital footprints, and the permanence/impermanence of online data.",
      },
    ],
    additionalResources: [
      {
        title: "Kenneth Slessor: Critical Assessments",
        author: "Various (ed. A.K. Thomson)",
        description: "Collection of critical essays on Slessor's poetry.",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "slessor1",
        text: "I looked out on the world with a feeling of inexpressible relief.",
        reference: "Out of Time",
        technique: "Irony",
        themes: ["Time and Mortality"],
        explanation:
          "The irony of finding relief in the face of time's ceaseless flow, a temporary escape from mortality.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Out of Time",
        character: "Speaker",
        significance: "high",
      },
      {
        id: "slessor2",
        text: "Five bells, five bells, five bells...",
        reference: "Five Bells",
        technique: "Repetition",
        themes: ["Time and Mortality", "Memory and the Past"],
        explanation:
          "The repetition emphasizes the relentless passage of time and the lingering presence of memory, particularly the memory of Joe Lynch.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Five Bells",
        character: "Speaker",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Imagery",
        definition: "Vivid descriptive language that appeals to the senses.",
        example: "The detailed descriptions of Sydney Harbour in 'Five Bells'.",
      },
      {
        name: "Personification",
        definition: "Attributing human qualities or actions to inanimate objects or abstract ideas.",
        example: "Time being personified as a 'great lord'.",
      },
    ],
  },

  "all-the-light": {
    id: "all-the-light",
    title: "All the Light We Cannot See",
    author: "Anthony Doerr",
    publicationYear: 2014,
    genre: "Historical Fiction",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A novel set during World War II, following the parallel lives of a blind French girl and a young German orphan, exploring themes of war, morality, destiny, and the power of human connection.",
    themes: [
      {
        id: "theme1",
        title: "War and Humanity",
        icon: "shield-alert",
        summary:
          "The novel portrays the devastating impact of war on individuals and communities, while also highlighting acts of kindness, resilience, and the enduring human spirit amidst chaos.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The destruction of Saint-Malo by bombing",
          "Werner's moral dilemmas as a German soldier",
          "Marie-Laure's resilience in occupied France",
          "The hidden acts of resistance and compassion",
        ],
      },
      {
        id: "theme2",
        title: "Destiny and Free Will",
        icon: "route",
        summary:
          "Doerr explores the interplay between fate and individual choice, suggesting how seemingly random events can converge to shape lives, and how characters make choices that define their morality.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "The parallel paths of Marie-Laure and Werner",
          "The role of the Sea of Flames diamond in their lives",
          "Werner's choices regarding the Nazi regime",
          "The convergence of their fates in Saint-Malo",
        ],
      },
      {
        id: "theme3",
        title: "The Power of Connection",
        icon: "link",
        summary:
          "The novel emphasizes the profound importance of human connection, even fleeting or indirect, in sustaining hope and meaning during times of extreme adversity.",
        color: "bg-green-100 border-green-300",
        examples: [
          "Marie-Laure's relationship with her father and great-uncle",
          "Werner's bond with Jutta and Frederick",
          "The unexpected and brief encounter between Marie-Laure and Werner",
          "The power of radio broadcasts to connect people",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The novel is rich in paradoxes, such as light being 'unseen' by the blind, or the capacity for both extreme cruelty and profound kindness during wartime.",
        textConnections:
          "Marie-Laure's blindness granting her a different kind of 'sight'; the beauty of radio waves carrying both propaganda and comfort; the hidden resistance within an occupied city",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "Doerr explores the different ways humans perceive and understand the world, particularly through sensory experience (sight, sound) and the limitations of knowledge in extreme circumstances.",
        textConnections:
          "Marie-Laure's navigation by touch and memory; Werner's talent for understanding radio frequencies; the inability of characters to fully grasp the war's scale or impact",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "The novel is set primarily during World War II, focusing on the German occupation of France and the Allied bombing campaigns, particularly the siege of Saint-Malo.",
        keyPoints: [
          "World War II (1939-1945) and its impact on Europe",
          "German occupation of France and the French Resistance",
          "The siege and bombing of Saint-Malo in 1944",
          "Technological advancements in radio and cryptography during the war",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "Doerr blends historical fact with fictional narrative, drawing on European history and emphasizing themes of resilience and the preservation of culture amidst destruction.",
        keyPoints: [
          "European cultural heritage and its destruction during wartime",
          "The power of storytelling and literature in preserving human experience",
          "The concept of 'total war' and its impact on civilians",
          "The role of folklore and myth (e.g., the Sea of Flames diamond)",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Anthony Doerr's extensive research into World War II, blind navigation, and the history of Saint-Malo informs the rich detail and authenticity of the novel.",
        keyPoints: [
          "Doerr's meticulous research into WWII and Saint-Malo",
          "His interest in sensory perception and the natural world",
          "Inspired by a trip to Saint-Malo and a blind girl on a train",
          "His focus on small-scale human stories within grand historical events",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "The novel engages with philosophical questions about morality in wartime, the nature of good and evil, and the choices individuals make when faced with impossible circumstances.",
        keyPoints: [
          "Existential choices and moral responsibility in wartime",
          "The nature of human kindness and cruelty",
          "The role of empathy in understanding others",
          "Philosophical debates on fate versus free will",
        ],
      },
    },
    timelineEvents: [
      { year: 1934, event: "Marie-Laure LeBlanc born in Paris", type: "Book" },
      { year: 1939, event: "World War II begins", type: "World" },
      { year: 1940, event: "Werner Pfennig born in Zollverein", type: "Book" },
      { year: 1944, event: "Siege of Saint-Malo", type: "World" },
      { year: 2014, event: "Publication of All the Light We Cannot See", type: "Book" },
    ],
    contemporaryConnections: [
      {
        title: "Refugee Crises & Displacement",
        description:
          "The displacement of civilians during WWII in the novel resonates with contemporary global refugee crises and the challenges faced by those forced to flee their homes.",
        modernExample: "Syrian refugee crisis, ongoing conflicts leading to displacement, challenges of asylum seekers.",
      },
      {
        title: "Disinformation & Propaganda",
        description:
          "Werner's role in tracking illegal radio broadcasts highlights the power of information and propaganda in wartime, a theme relevant to modern 'fake news' and information warfare.",
        modernExample: "State-sponsored disinformation campaigns, social media propaganda, and media literacy debates.",
      },
    ],
    additionalResources: [
      {
        title: "The Nightingale",
        author: "Kristin Hannah",
        description: "Another acclaimed historical novel set in occupied France during WWII.",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "atl1",
        text: "Open your eyes and see what you can with them before they close forever.",
        reference: "Chapter 53",
        technique: "Metaphor/Didacticism",
        themes: ["Human Capacity for Understanding", "Mortality"],
        explanation:
          "Etienne's message, originally from his brother, encourages active perception and appreciation of life amidst impending darkness, particularly poignant for Marie-Laure's blindness.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Chapter 53",
        character: "Etienne LeBlanc",
        significance: "high",
      },
      {
        id: "atl2",
        text: "The brain is an amazing thing. It invents stories, revises them, adorns them with tiny details that may or may not be true.",
        reference: "Chapter 72",
        technique: "Metacommentary",
        themes: ["Memory", "Truth and Illusion"],
        explanation:
          "This quote reflects on the subjective nature of memory and storytelling, hinting at how individuals construct their own realities, especially in traumatic times.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "Chapter 72",
        character: "Narrator",
        significance: "medium",
      },
    ],
    techniques: [
      {
        name: "Parallel Narratives",
        definition: "Two or more distinct storylines presented simultaneously or interleaved.",
        example: "The alternating chapters following Marie-Laure and Werner.",
      },
      {
        name: "Sensory Imagery",
        definition: "Descriptive language appealing to the five senses.",
        example: "Detailed descriptions of sounds and textures for Marie-Laure's experience.",
      },
    ],
  },

  "crucible": {
    id: "crucible",
    title: "The Crucible",
    author: "Arthur Miller",
    publicationYear: 1953,
    genre: "Drama",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A play about the Salem witch trials that serves as an allegory for McCarthyism and the Red Scare in 1950s America.",
    themes: [
      {
        id: "theme1",
        title: "Mass Hysteria",
        icon: "shield",
        summary:
          "The play explores how fear and paranoia can spread through a community, leading to irrational behavior and false accusations.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The rapid spread of witchcraft accusations",
          "The girls' collective hysteria in court",
          "The community's willingness to believe impossible claims",
          "The role of fear in driving irrational behavior",
        ],
      },
      {
        id: "theme2",
        title: "Reputation and Integrity",
        icon: "heart",
        summary:
          "The play examines how people's concern for their reputation can lead them to make moral compromises or stand firm in their principles.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "John Proctor's struggle with his reputation",
          "Reverend Parris's concern for his position",
          "The importance of a good name in Salem",
          "The choice between truth and social standing",
        ],
      },
      {
        id: "theme3",
        title: "Power and Authority",
        icon: "eye",
        summary:
          "The play explores how those in authority can abuse their power and how the powerless can manipulate the system.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The court's absolute authority in trials",
          "Abigail's manipulation of the girls",
          "The power of religious authority in Salem",
          "The abuse of legal and social power",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The play presents numerous paradoxes, such as the court claiming to seek truth while ignoring evidence, and the girls' accusations being both false and believed.",
        textConnections:
          "The court's claim to seek truth while ignoring evidence; the paradox of false accusations being believed; the contradiction between religious values and actions",
      },
      {
        concept: "Emotional Experiences",
        explanation:
          "The poems deeply explore human emotions including love, loss, nostalgia, and the complex feelings associated with aging and memory.",
        textConnections:
          "The emotional impact of memory; the feelings associated with aging; the complex emotions of love and loss",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Dobson wrote during a period of significant change in Australian society and literature, from the post-war period through the late 20th century.",
        keyPoints: [
          "Post-war Australian society",
          "The development of Australian literature",
          "Changing social and cultural values",
          "The influence of international literary movements",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "Her work reflects the cultural developments of mid-20th century Australia and her engagement with European artistic traditions.",
        keyPoints: [
          "Australian cultural development",
          "Influence of European art and literature",
          "The role of women in Australian literature",
          "The development of Australian poetic voice",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Dobson's background in art history and her travels in Europe influenced her poetic themes and her interest in visual art.",
        keyPoints: [
          "Her background in art history",
          "Her travels in Europe",
          "Her long literary career",
          "Her influence on Australian poetry",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "Her poetry engages with philosophical questions about time, memory, art, and the nature of human experience and creativity.",
        keyPoints: [
          "Philosophical questions about time and memory",
          "The nature of artistic creation",
          "Questions about human experience",
          "The relationship between art and truth",
        ],
      },
    },
    timelineEvents: [
      { year: 1920, event: "Birth of Rosemary Dobson", type: "Author" },
      { year: 1944, event: "First poetry collection published", type: "Book" },
      { year: 2012, event: "Death of Rosemary Dobson", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Aging and Memory",
        description:
          "Dobson's exploration of aging and memory connects to contemporary discussions about aging populations and memory preservation.",
        modernExample: "Aging population concerns, memory research, dementia awareness",
      },
      {
        title: "Art and Technology",
        description:
          "Her interest in art and creativity connects to modern discussions about the role of art in the digital age.",
        modernExample: "Digital art, AI-generated creativity, the future of artistic expression",
      },
    ],
    additionalResources: [
      {
        title: "Rosemary Dobson: A Portrait",
        author: "Various",
        description: "Collection of essays about Dobson's life and work",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "dp1",
        text: "Time is the substance I am made of. Time is a river which sweeps me along, but I am the river.",
        reference: "Cock Crow",
        technique: "Metaphor",
        themes: ["Time and Memory"],
        explanation:
          "This quote uses the metaphor of a river to explore the relationship between time and human identity.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Cock Crow",
        character: "Speaker",
        significance: "high",
      },
      {
        id: "dp2",
        text: "The painter's hand, the poet's eye, / Both seek the truth that lies behind the lie.",
        reference: "The Painter",
        technique: "Parallelism",
        themes: ["Art and Creativity"],
        explanation:
          "This quote suggests that both painting and poetry seek to reveal deeper truths about reality.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "The Painter",
        character: "Speaker",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Imagery",
        definition: "Vivid descriptive language that appeals to the senses",
        example: "Detailed descriptions of paintings and visual scenes",
      },
      {
        name: "Metaphor",
        definition: "A comparison between two unlike things without using 'like' or 'as'",
        example: "Time as a river in 'Cock Crow'",
      },
    ],
  },

  "boy-behind-curtain": {
    id: "boy-behind-curtain",
    title: "The Boy Behind the Curtain",
    author: "Tim Winton",
    publicationYear: 2016,
    genre: "Memoir",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A memoir that explores Winton's life, from his childhood in Western Australia to his development as a writer, examining themes of place, family, and the creative process.",
    themes: [
      {
        id: "theme1",
        title: "Place and Identity",
        icon: "map",
        summary:
          "The memoir explores how the Western Australian landscape and environment have shaped Winton's identity and his writing.",
        color: "bg-red-100 border-red-300",
        examples: [
          "His connection to the Western Australian coast",
          "The influence of the natural environment",
          "The importance of place in his writing",
          "His environmental activism",
        ],
      },
      {
        id: "theme2",
        title: "Family and Relationships",
        icon: "heart",
        summary:
          "Winton examines the complex dynamics of family relationships and how they have influenced his life and work.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "His relationship with his father",
          "The impact of his family's religious background",
          "His own experiences as a father",
          "The role of family in shaping identity",
        ],
      },
      {
        id: "theme3",
        title: "Writing and Creativity",
        icon: "pen",
        summary:
          "The memoir explores Winton's development as a writer and his understanding of the creative process.",
        color: "bg-green-100 border-green-300",
        examples: [
          "His early experiences with writing",
          "The challenges of the creative process",
          "His relationship with language",
          "The role of observation in his work",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Emotional Experiences",
        explanation:
          "The memoir deeply explores Winton's emotional experiences, including fear, love, loss, and the complex feelings associated with family and place.",
        textConnections:
          "His fear as a child; his love for his family and place; his grief and loss; his joy in writing and nature",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "The memoir examines how Winton has come to understand himself, his family, and his place in the world through writing and reflection.",
        textConnections:
          "His growing understanding of his father; his insights into place and identity; his comprehension of the creative process",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "The memoir spans several decades of Australian history, from the 1960s to the present, reflecting changes in Australian society and culture.",
        keyPoints: [
          "Post-war Australian society",
          "The development of Australian literature",
          "Environmental awareness and activism",
          "Changes in Australian family life",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "Winton's work reflects the development of Australian cultural identity and the growing recognition of Australian literature and environmental concerns.",
        keyPoints: [
          "The development of Australian literature",
          "Growing environmental consciousness",
          "Australian cultural identity",
          "The role of place in Australian culture",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Winton's background in Western Australia and his experiences as a writer and environmental activist have deeply influenced his work.",
        keyPoints: [
          "His Western Australian background",
          "His development as a writer",
          "His environmental activism",
          "His family and religious background",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "The memoir engages with philosophical questions about identity, place, creativity, and the relationship between humans and the natural world.",
        keyPoints: [
          "Questions about personal identity",
          "The relationship between humans and nature",
          "The nature of creativity",
          "Philosophical questions about place and belonging",
        ],
      },
    },
    timelineEvents: [
      { year: 1960, event: "Birth of Tim Winton", type: "Author" },
      { year: 1981, event: "First novel published", type: "Book" },
      { year: 2016, event: "Publication of The Boy Behind the Curtain", type: "Book" },
    ],
    contemporaryConnections: [
      {
        title: "Environmental Awareness",
        description:
          "Winton's environmental concerns connect to contemporary discussions about climate change and environmental protection.",
        modernExample: "Climate change activism, environmental protection, sustainability movements",
      },
      {
        title: "Australian Identity",
        description:
          "His exploration of Australian identity and place remains relevant to contemporary discussions about what it means to be Australian.",
        modernExample: "Discussions about Australian identity, multiculturalism, connection to place",
      },
    ],
    additionalResources: [
      {
        title: "Cloudstreet",
        author: "Tim Winton",
        description: "Winton's most famous novel about Australian family life",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "bbc1",
        text: "I was the boy behind the curtain, watching the world go by.",
        reference: "Chapter 1",
        technique: "Metaphor",
        themes: ["Writing and Creativity", "Family and Relationships"],
        explanation:
          "This metaphor captures Winton's sense of being an observer, both as a child and as a writer.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "Chapter 1",
        character: "Tim Winton",
        significance: "high",
      },
      {
        id: "bbc2",
        text: "The sea was always there, like a great breathing thing.",
        reference: "Chapter 2",
        technique: "Personification",
        themes: ["Place and Identity"],
        explanation:
          "This personification of the sea emphasizes its living presence and importance in Winton's life.",
        rubricConnection: "Emotional Experiences",
        chapter: "Chapter 2",
        character: "Tim Winton",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Memoir",
        definition: "A narrative written from personal experience",
        example: "Winton's first-person account of his life and experiences",
      },
      {
        name: "Vivid Description",
        definition: "Detailed, sensory language that creates strong mental images",
        example: "His descriptions of the Western Australian landscape",
      },
    ],
  },

  "billy-elliot": {
    id: "billy-elliot",
    title: "Billy Elliot",
    author: "Melvin Burgess (novel) / Lee Hall (screenplay)",
    publicationYear: 2001,
    genre: "Drama",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A story about a young boy who discovers a passion for ballet dancing in a mining community during the 1984-85 UK miners' strike, exploring themes of gender, class, and following one's dreams.",
    themes: [
      {
        id: "theme1",
        title: "Gender and Identity",
        icon: "person",
        summary:
          "The story explores traditional gender roles and the challenges of pursuing interests that don't conform to societal expectations.",
        color: "bg-red-100 border-red-300",
        examples: [
          "Billy's interest in ballet challenging gender norms",
          "His father's initial resistance to his dancing",
          "The community's expectations of boys",
          "Billy's struggle to be accepted",
        ],
      },
      {
        id: "theme2",
        title: "Class and Social Mobility",
        icon: "stairs",
        summary:
          "The story examines the relationship between social class and opportunity, particularly in the context of the miners' strike.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "The impact of the miners' strike on the family",
          "The economic barriers to pursuing dance",
          "The contrast between working-class and middle-class opportunities",
          "Billy's journey from mining community to Royal Ballet School",
        ],
      },
      {
        id: "theme3",
        title: "Pursuing Dreams",
        icon: "star",
        summary:
          "The story celebrates the courage and determination required to pursue one's dreams against all odds.",
        color: "bg-green-100 border-green-300",
        examples: [
          "Billy's determination to dance despite obstacles",
          "His family's eventual support",
          "The sacrifices made to pursue his dream",
          "The joy and fulfillment of following his passion",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Emotional Experiences",
        explanation:
          "The story deeply explores the emotional experiences of pursuing dreams, facing prejudice, and dealing with family conflict.",
        textConnections:
          "Billy's passion for dance; his fear of rejection; his family's conflicted emotions; the joy of artistic expression",
      },
      {
        concept: "Relationships",
        explanation:
          "The story examines how relationships are tested and strengthened by Billy's pursuit of his dreams and the family's response to the miners' strike.",
        textConnections:
          "Billy's relationship with his father; the family's unity during the strike; Billy's relationship with his dance teacher",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Set during the 1984-85 UK miners' strike, the story reflects the social and economic challenges faced by mining communities during this period.",
        keyPoints: [
          "The 1984-85 UK miners' strike",
          "Thatcher's economic policies",
          "The decline of traditional industries",
          "Social and economic changes in Britain",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The story reflects changing attitudes toward gender roles and the arts in working-class communities during the 1980s.",
        keyPoints: [
          "Changing gender roles in the 1980s",
          "The role of the arts in working-class communities",
          "The impact of economic change on culture",
          "The development of British cinema",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Lee Hall's background in working-class Newcastle and his interest in social issues influenced the story's themes and setting.",
        keyPoints: [
          "Hall's working-class background",
          "His interest in social issues",
          "His experience with the arts",
          "His commitment to working-class stories",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "The story engages with philosophical questions about individual freedom, social responsibility, and the nature of artistic expression.",
        keyPoints: [
          "Questions about individual vs. collective good",
          "The nature of artistic expression",
          "Philosophical questions about gender and identity",
          "The relationship between art and society",
        ],
      },
    },
    timelineEvents: [
      { year: 1984, event: "UK miners' strike begins", type: "World" },
      { year: 1985, event: "Miners' strike ends", type: "World" },
      { year: 2000, event: "Film release", type: "Book" },
      { year: 2001, event: "Novel publication", type: "Book" },
    ],
    contemporaryConnections: [
      {
        title: "Gender and Identity",
        description:
          "The story's exploration of gender roles and identity remains relevant to contemporary discussions about gender fluidity and breaking stereotypes.",
        modernExample: "Gender fluidity, breaking gender stereotypes, LGBTQ+ rights",
      },
      {
        title: "Social Mobility",
        description:
          "The story's examination of class and opportunity connects to ongoing discussions about social mobility and access to the arts.",
        modernExample: "Criminal justice reform, debates about punishment vs. rehabilitation, legal interpretation",
      },
    ],
    additionalResources: [
      {
        title: "Billy Elliot: The Musical",
        author: "Lee Hall & Elton John",
        description: "Musical adaptation of the story",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "be1",
        text: "I don't want a childhood. I want to be a ballet dancer.",
        reference: "Scene 1",
        technique: "Direct Statement",
        themes: ["Pursuing Dreams", "Gender and Identity"],
        explanation:
          "This quote captures Billy's determination and his rejection of traditional childhood expectations.",
        rubricConnection: "Emotional Experiences",
        chapter: "Scene 1",
        character: "Billy Elliot",
        significance: "high",
      },
      {
        id: "be2",
        text: "It's not just poofs, Dad. Some ballet dancers are as fit as athletes.",
        reference: "Scene 3",
        technique: "Direct Address",
        themes: ["Gender and Identity", "Class and Social Mobility"],
        explanation:
          "This quote shows Billy challenging his father's prejudices and educating him about ballet.",
        rubricConnection: "Relationships",
        chapter: "Scene 3",
        character: "Billy Elliot",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Dialogue",
        definition: "Conversation between characters that reveals character and advances plot",
        example: "Billy's conversations with his family about dancing",
      },
      {
        name: "Character Development",
        definition: "The way a character changes and grows throughout the story",
        example: "Billy's growth from uncertain boy to confident dancer",
      },
    ],
  },

  "waste-land": {
    id: "waste-land",
    title: "The Waste Land",
    author: "T.S. Eliot",
    publicationYear: 1922,
    genre: "Modernist Poetry",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction:
      "A landmark modernist poem that explores the spiritual and cultural desolation of post-World War I Europe through fragmented narratives and rich allusions.",
    themes: [
      {
        id: "theme1",
        title: "Spiritual Desolation",
        icon: "cross",
        summary:
          "The poem explores the spiritual emptiness and loss of meaning in modern society, particularly in the aftermath of World War I.",
        color: "bg-red-100 border-red-300",
        examples: [
          "The Fisher King myth and spiritual sterility",
          "The lack of meaningful religious experience",
          "The search for spiritual renewal",
          "The contrast between past and present spiritual life",
        ],
      },
      {
        id: "theme2",
        title: "Cultural Fragmentation",
        icon: "puzzle",
        summary:
          "The poem reflects the fragmentation of modern culture and the breakdown of traditional values and structures.",
        color: "bg-blue-100 border-blue-300",
        examples: [
          "The fragmented structure of the poem",
          "The mixing of different cultural references",
          "The breakdown of traditional narrative",
          "The loss of cultural coherence",
        ],
      },
      {
        id: "theme3",
        title: "Death and Rebirth",
        icon: "phoenix",
        summary:
          "The poem explores themes of death, decay, and the possibility of renewal and regeneration.",
        color: "bg-green-100 border-green-300",
        examples: [
          "The Fisher King myth of death and renewal",
          "The seasonal cycle of death and rebirth",
          "The possibility of spiritual regeneration",
          "The contrast between sterility and fertility",
        ],
      },
    ],
    rubricConnections: [
      {
        concept: "Anomalies and Paradoxes",
        explanation:
          "The poem is filled with paradoxes and contradictions, reflecting the fragmented and contradictory nature of modern experience.",
        textConnections:
          "The paradox of life in death; the contradiction between past and present; the fragmented nature of modern consciousness",
      },
      {
        concept: "Human Capacity for Understanding",
        explanation:
          "The poem explores the limits of human understanding and the difficulty of making sense of modern experience.",
        textConnections:
          "The difficulty of understanding modern life; the fragmented nature of consciousness; the search for meaning in chaos",
      },
    ],
    contexts: {
      historical: {
        title: "Historical Context",
        content:
          "Written in the aftermath of World War I, the poem reflects the devastation and disillusionment of the post-war period.",
        keyPoints: [
          "The impact of World War I",
          "Post-war disillusionment",
          "The decline of European empires",
          "The rise of modernism",
        ],
      },
      cultural: {
        title: "Cultural Context",
        content:
          "The poem reflects the modernist movement's response to the breakdown of traditional cultural values and structures.",
        keyPoints: [
          "The modernist literary movement",
          "The breakdown of traditional values",
          "The influence of psychology and anthropology",
          "The role of myth and ritual",
        ],
      },
      biographical: {
        title: "Biographical Context",
        content:
          "Eliot's personal struggles and his conversion to Anglicanism influenced the poem's themes of spiritual crisis and renewal.",
        keyPoints: [
          "Eliot's personal crisis",
          "His later conversion to Anglicanism",
          "His interest in myth and ritual",
          "His development as a poet",
        ],
      },
      philosophical: {
        title: "Philosophical Context",
        content:
          "The poem engages with philosophical questions about meaning, existence, and the nature of human experience in the modern world.",
        keyPoints: [
          "Existential questions about meaning",
          "The nature of human consciousness",
          "Philosophical questions about time and history",
          "The relationship between individual and collective experience",
        ],
      },
    },
    timelineEvents: [
      { year: 1888, event: "Birth of T.S. Eliot", type: "Author" },
      { year: 1914, event: "World War I begins", type: "World" },
      { year: 1918, event: "World War I ends", type: "World" },
      { year: 1922, event: "Publication of The Waste Land", type: "Book" },
      { year: 1965, event: "Death of T.S. Eliot", type: "Author" },
    ],
    contemporaryConnections: [
      {
        title: "Modern Anxiety",
        description:
          "The poem's exploration of modern anxiety and spiritual emptiness connects to contemporary concerns about meaning and purpose.",
        modernExample: "Existential anxiety, spiritual searching, the search for meaning in modern life",
      },
      {
        title: "Cultural Fragmentation",
        description:
          "The poem's reflection on cultural fragmentation remains relevant to discussions about the impact of technology and globalization.",
        modernExample: "Social media fragmentation, globalization, cultural identity in the digital age",
      },
    ],
    additionalResources: [
      {
        title: "The Waste Land: A Facsimile and Transcript",
        author: "T.S. Eliot",
        description: "Original manuscript with Ezra Pound's edits",
        type: "Book",
      },
    ],
    quotes: [
      {
        id: "wl1",
        text: "April is the cruellest month, breeding / Lilacs out of the dead land, mixing / Memory and desire, stirring / Dull roots with spring rain.",
        reference: "The Burial of the Dead",
        technique: "Paradox",
        themes: ["Death and Rebirth", "Spiritual Desolation"],
        explanation:
          "This opening paradox suggests that spring, normally associated with renewal, brings pain by stirring memories and desires.",
        rubricConnection: "Anomalies and Paradoxes",
        chapter: "The Burial of the Dead",
        character: "Speaker",
        significance: "high",
      },
      {
        id: "wl2",
        text: "I will show you fear in a handful of dust.",
        reference: "The Burial of the Dead",
        technique: "Metaphor",
        themes: ["Spiritual Desolation", "Death and Rebirth"],
        explanation:
          "This metaphor suggests that even the smallest things can reveal the fundamental fear and emptiness of modern life.",
        rubricConnection: "Human Capacity for Understanding",
        chapter: "The Burial of the Dead",
        character: "Speaker",
        significance: "high",
      },
    ],
    techniques: [
      {
        name: "Allusion",
        definition: "A reference to another work of literature, art, or history",
        example: "References to the Fisher King myth, Dante, and Shakespeare",
      },
      {
        name: "Fragmentation",
        definition: "The breaking up of traditional narrative structure",
        example: "The poem's fragmented structure and multiple voices",
      },
    ],
  },
};

// Helper function to get book data by ID
export const getBookData = (textId: string): BookData => {
  return bookData[textId] || {
    id: textId,
    title: "Book Not Found",
    author: "Unknown",
    publicationYear: "Unknown",
    genre: "Unknown",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction: "This book's detailed content is not yet available. Please check back later or contact support.",
    themes: [],
    rubricConnections: [],
    contexts: {
      historical: { title: "Historical Context", content: "Content not available.", keyPoints: [] },
      cultural: { title: "Cultural Context", content: "Content not available.", keyPoints: [] },
      biographical: { title: "Biographical Context", content: "Content not available.", keyPoints: [] },
      philosophical: { title: "Philosophical Context", content: "Content not available.", keyPoints: [] },
    },
    timelineEvents: [],
    contemporaryConnections: [],
    additionalResources: [],
    quotes: [],
    techniques: [],
  };
}; 