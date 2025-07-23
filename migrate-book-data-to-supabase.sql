-- Migration script to populate detailed book content tables
-- This script contains all the data from book-data.ts migrated to Supabase
-- Run this AFTER running detailed-book-content-schema.sql

-- ============================================================================
-- POPULATE DETAILED CONTEXTS FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

-- Historical Context
INSERT INTO public.book_detailed_contexts (book_id, context_type, title, sections) VALUES
('nineteen-eighty-four', 'historical', 'Historical Context', '[
  {
    "content": [
      "Written in 1948 (with the title being a simple inversion of the year), Nineteen Eighty-Four reflects Orwell''s concerns about totalitarian regimes that rose to power in the early-to-mid 20th century. The novel draws particularly on elements of Stalinism in the Soviet Union and aspects of Nazi Germany.",
      "The novel emerged from a world that had just witnessed the horrors of World War II and was beginning to grapple with the implications of the atomic age. The geopolitical landscape was rapidly changing, with the emergence of two superpowers - the United States and Soviet Union - locked in an ideological struggle that would define the next several decades.",
      "Orwell was particularly influenced by the show trials in the Soviet Union during the 1930s, where prominent Communist Party members were forced to confess to crimes they had not committed. This directly influenced the novel''s portrayal of Winston''s eventual capitulation and his forced love for Big Brother.",
      "The concept of perpetual war between the three superstates (Oceania, Eurasia, and Eastasia) reflects the emerging Cold War dynamics, where shifting alliances and proxy conflicts would become the norm rather than direct confrontation between major powers."
    ]
  }
]');

-- Political Context
INSERT INTO public.book_detailed_contexts (book_id, context_type, title, sections) VALUES
('nineteen-eighty-four', 'political', 'Political Context', '[
  {
    "content": [
      "Orwell wrote Nineteen Eighty-Four as a warning against totalitarianism in all its forms. Having witnessed the rise of fascism in Europe and the corruption of socialist ideals in the Soviet Union, Orwell sought to demonstrate how political power could be used to completely control human thought and behavior.",
      "The novel serves as a critique of totalitarianism regardless of its political orientation. Orwell, himself a democratic socialist, was deeply concerned about how revolutionary movements could be corrupted by those seeking absolute power.",
      "The Party''s use of doublethink and Newspeak reflects Orwell''s observations about how political movements manipulate language to control thought. The concept of ''thoughtcrime'' represents the ultimate extension of political control - the regulation not just of actions, but of thoughts themselves.",
      "The novel''s portrayal of the Inner Party, Outer Party, and proles reflects Orwell''s understanding of how totalitarian systems create hierarchies that serve to maintain control while preventing unified resistance."
    ]
  }
]');

-- Biographical Context
INSERT INTO public.book_detailed_contexts (book_id, context_type, title, sections) VALUES
('nineteen-eighty-four', 'biographical', 'Biographical Context', '[
  {
    "content": [
      "George Orwell (Eric Arthur Blair, 1903-1950) drew extensively on his personal experiences in crafting Nineteen Eighty-Four. His time as an imperial police officer in Burma, his experiences of poverty, and particularly his participation in the Spanish Civil War all informed the novel''s themes and imagery.",
      "Orwell''s experiences in Burma gave him firsthand knowledge of how imperial power operates and how institutions can dehumanize both the oppressed and the oppressor. This experience informed his understanding of how power corrupts and how systems of control function.",
      "His participation in the Spanish Civil War was particularly formative. Fighting with the POUM (Workers'' Party of Marxist Unification), Orwell witnessed how different leftist factions turned on each other, and how propaganda was used to rewrite recent history. The experience of being hunted by former allies directly influenced the novel''s themes of betrayal and the malleability of truth.",
      "The novel was written while Orwell was seriously ill with tuberculosis on the remote Scottish island of Jura. His declining health and isolation may have contributed to the novel''s bleak tone and its exploration of physical and psychological suffering."
    ]
  }
]');

-- Philosophical Context
INSERT INTO public.book_detailed_contexts (book_id, context_type, title, sections) VALUES
('nineteen-eighty-four', 'philosophical', 'Philosophical Context', '[
  {
    "content": [
      "Nineteen Eighty-Four engages with several philosophical traditions, particularly those concerned with truth, language, and power. The novel explores questions about the nature of reality, the relationship between language and thought, and the limits of human resistance to oppression.",
      "The novel''s exploration of Newspeak reflects engagement with the Sapir-Whorf hypothesis - the idea that language shapes thought. By systematically reducing vocabulary and eliminating words that express dissent, the Party attempts to make rebellion literally unthinkable.",
      "The novel also engages with existentialist philosophy, particularly in its exploration of Winston''s struggle to maintain authentic selfhood in the face of overwhelming social pressure. The question of whether Winston''s final capitulation represents the destruction of his essential self or merely a pragmatic survival strategy reflects existentialist concerns about authenticity and bad faith.",
      "The novel''s treatment of truth and reality anticipates postmodern concerns about the constructed nature of knowledge while simultaneously asserting the importance of objective truth as a foundation for human dignity and resistance."
    ]
  }
]');

-- ============================================================================
-- POPULATE RUBRIC CONNECTIONS FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

-- Anomalies and Paradoxes
INSERT INTO public.book_rubric_connections (book_id, rubric_type, title, subsections) VALUES
('nineteen-eighty-four', 'anomaliesAndParadoxes', 'Anomalies and Paradoxes', '[
  {
    "title": "Doublethink and Contradictory Beliefs",
    "content": [
      "The Party''s slogans \"War is Peace, Freedom is Slavery, Ignorance is Strength\" exemplify the central paradox of the novel - the requirement to hold contradictory beliefs simultaneously. The Ministry of Truth spreads lies, the Ministry of Peace wages war, and Winston''s job is to destroy truth while serving the Ministry of \"Truth.\"",
      "These paradoxes reveal how totalitarian systems exploit human cognitive flexibility to maintain control. The ability to accept contradictions becomes a survival mechanism, but also represents the destruction of logical thought."
    ]
  },
  {
    "title": "The Paradox of Memory and History",
    "content": [
      "The novel presents the paradox of a society where the past is constantly rewritten, making history both all-important and completely malleable. \"Who controls the past controls the future; who controls the present controls the past\" demonstrates how control of information creates a reality where truth becomes whatever those in power declare it to be."
    ]
  }
]');

-- Emotional Experiences
INSERT INTO public.book_rubric_connections (book_id, rubric_type, title, subsections) VALUES
('nineteen-eighty-four', 'emotionalExperiences', 'Emotional Experiences', '[
  {
    "title": "Love as Rebellion and Vulnerability",
    "content": [
      "Winston and Julia''s love represents both the ultimate act of rebellion against the Party and their greatest vulnerability to its control. Their affair becomes an act of political rebellion, while the Party attempts to eliminate all personal loyalties. Winston''s eventual betrayal of Julia in Room 101 shows how totalitarian systems seek to monopolize emotional loyalty."
    ]
  },
  {
    "title": "Fear and Psychological Control",
    "content": [
      "The Party uses fear as its primary tool for emotional control, from the constant threat of surveillance to the ultimate terror of Room 101. The omnipresent threat of the Thought Police, the use of personalized fears, and the Two Minutes Hate as directed emotional release demonstrate how fear becomes both a tool of control and a fundamental human experience that the Party exploits."
    ]
  }
]');

-- Relationships
INSERT INTO public.book_rubric_connections (book_id, rubric_type, title, subsections) VALUES
('nineteen-eighty-four', 'relationships', 'Relationships', '[
  {
    "title": "Corrupted Family and Social Bonds",
    "content": [
      "The Party systematically corrupts natural human relationships, turning children against parents and spouses against each other. Children are encouraged to spy on and report their parents, Winston''s marriage to Katherine represents a loveless Party duty, and the Junior Spies organization turns family bonds into surveillance networks."
    ]
  },
  {
    "title": "Friendship and Betrayal",
    "content": [
      "The novel explores how genuine human connection becomes impossible when trust is systematically undermined by the threat of betrayal. Winston''s relationship with O''Brien - mentor, friend, and ultimately torturer - along with the betrayal between Winston and Julia under torture, shows how the destruction of trust serves the Party''s goal of isolating citizens."
    ]
  }
]');

-- Human Capacity for Understanding
INSERT INTO public.book_rubric_connections (book_id, rubric_type, title, subsections) VALUES
('nineteen-eighty-four', 'humanCapacityForUnderstanding', 'Human Capacity for Understanding', '[
  {
    "title": "The Struggle for Truth and Reality",
    "content": [
      "Winston''s desperate attempt to maintain his grip on objective reality represents the fundamental human need to understand and make sense of experience. \"Freedom is the freedom to say that two plus two make four\" and Winston''s diary as an attempt to record truth demonstrate how the capacity for independent thought and recognition of objective truth are essential to human dignity."
    ]
  },
  {
    "title": "Language and Thought",
    "content": [
      "Through Newspeak, the novel explores how language shapes understanding and how controlling language can limit the capacity for complex thought. Newspeak is designed to make thoughtcrime impossible through the gradual reduction of vocabulary, showing how totalitarian control extends beyond actions to the very capacity for understanding and resistance."
    ]
  }
]');

-- ============================================================================
-- POPULATE PLOT SUMMARY FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

INSERT INTO public.book_plot_summaries (book_id, parts) VALUES
('nineteen-eighty-four', '[
  {
    "title": "Part One: The World of Winston Smith",
    "description": "Introduction to Winston''s world and his first acts of rebellion",
    "chapters": [
      {
        "title": "Chapter 1: Winston''s World",
        "summary": "Winston Smith returns to Victory Mansions and begins writing in his diary, an act of rebellion against the Party. We are introduced to the world of Oceania, Big Brother, and the omnipresent telescreens. The Two Minutes Hate ritual is introduced, along with Winston''s complex feelings toward O''Brien.",
        "significance": "Establishes the oppressive world and Winston''s first act of rebellion."
      },
      {
        "title": "Chapter 2: The Parsons Family",
        "summary": "Winston helps his neighbor Mrs. Parsons with her plumbing while her children, members of the Junior Spies, play at hanging traitors and express their desire to see public executions. Mrs. Parsons fears her own children, demonstrating how the Party corrupts family relationships.",
        "significance": "Shows how the Party corrupts family bonds and uses children as surveillance tools."
      },
      {
        "title": "Chapter 3: Dreams and Memories",
        "summary": "Winston dreams of his mother and sister, and of the ''Golden Country.'' He reflects on his fragmented memories of the past and his inability to verify historical facts. The chapter explores the importance of personal memory against the Party''s control over the past.",
        "significance": "Explores the importance of personal memory and the Party''s control over the past."
      },
      {
        "title": "Chapter 4: The Ministry of Truth",
        "summary": "Winston''s work at the Ministry of Truth is detailed, showing how history is constantly rewritten to match the Party''s current narrative. The concept of ''unpersons'' is introduced through Winston''s fabrication of Comrade Ogilvy''s biography, demonstrating the systematic falsification of history.",
        "significance": "Demonstrates how the Party controls reality by controlling information."
      },
      {
        "title": "Chapter 5: Newspeak and Syme",
        "summary": "Winston lunches with Syme, a philologist working on the Newspeak dictionary. Syme explains how Newspeak will eventually make thoughtcrime impossible by eliminating the words needed to express dissent. Winston realizes that Syme will be vaporized for his intelligence.",
        "significance": "Explores how language shapes thought and the Party''s ultimate goal of thought control."
      },
      {
        "title": "Chapter 6: Winston''s Marriage",
        "summary": "Winston recalls his marriage to Katherine, a rigid Party member who viewed sex as a duty to the Party. Their relationship was loveless and eventually ended when Katherine disappeared, showing how the Party corrupts intimate relationships and controls sexuality.",
        "significance": "Shows how the Party corrupts even the most intimate human relationships."
      },
      {
        "title": "Chapter 7: The Proles",
        "summary": "Winston reflects on the proles (proletariat) as the only hope for revolution, but realizes they are kept ignorant and distracted. He struggles with questions about the past and objective truth, encountering an old prole in a pub who cannot provide the historical verification Winston seeks.",
        "significance": "Explores the possibility of resistance and the nature of truth."
      },
      {
        "title": "Chapter 8: Mr. Charrington''s Shop",
        "summary": "Winston visits Mr. Charrington''s antique shop in the prole district and rents the room above it. He purchases a coral paperweight and begins to plan his rebellion more seriously, taking a concrete step toward resistance by securing a private space.",
        "significance": "Winston takes a concrete step toward rebellion by securing a private space."
      }
    ]
  },
  {
    "title": "Part Two: The Love Affair",
    "description": "Winston''s relationship with Julia and his recruitment into the Brotherhood",
    "chapters": [
      {
        "title": "Chapter 1: Julia''s Note",
        "summary": "Julia passes Winston a note declaring her love. They arrange to meet in the countryside, away from the telescreens and surveillance. This marks the beginning of Winston''s most significant act of rebellion.",
        "significance": "Beginning of Winston''s most significant rebellion through love."
      },
      {
        "title": "Chapter 2: The Golden Country",
        "summary": "Winston and Julia meet in the countryside - the ''Golden Country'' from Winston''s dreams. They make love and discuss their hatred of the Party, with Julia revealing her pragmatic approach to rebellion.",
        "significance": "Represents the possibility of genuine human connection and natural beauty."
      },
      {
        "title": "Chapter 3: Julia''s Story",
        "summary": "Julia tells Winston about her past relationships and her practical approach to surviving under the Party. Winston learns about her cynical but effective methods of rebellion, revealing different approaches to resistance.",
        "significance": "Reveals different approaches to resistance and survival under totalitarianism."
      },
      {
        "title": "Chapter 4: The Room Above the Shop",
        "summary": "Winston and Julia begin meeting regularly in the room above Mr. Charrington''s shop. They create a private world away from Party surveillance, representing the height of Winston''s rebellion and happiness.",
        "significance": "Creates a temporary sanctuary from Party control."
      },
      {
        "title": "Chapter 5: Syme''s Disappearance",
        "summary": "Syme disappears, becoming an ''unperson'' as Winston predicted. Winston and Julia continue their affair while maintaining their public facades, demonstrating the Party''s ruthless elimination of potential threats.",
        "significance": "Demonstrates the Party''s systematic elimination of intelligent individuals."
      },
      {
        "title": "Chapter 6: O''Brien''s Invitation",
        "summary": "O''Brien approaches Winston and gives him his address, ostensibly to lend him a Newspeak dictionary. Winston believes this is an invitation to join the resistance, setting up the trap that will ultimately destroy him.",
        "significance": "Sets up the elaborate trap that will lead to Winston''s downfall."
      },
      {
        "title": "Chapter 7: Winston''s Mother",
        "summary": "Winston remembers his mother''s disappearance and his own selfish behavior as a child. He reflects on the difference between private and public loyalties, exploring the importance of personal memory and family bonds.",
        "significance": "Explores the importance of family bonds and personal loyalty."
      },
      {
        "title": "Chapter 8: O''Brien''s Apartment",
        "summary": "Winston and Julia visit O''Brien, who recruits them into the Brotherhood, the supposed resistance organization. They receive a copy of Goldstein''s book, representing the apparent culmination of Winston''s rebellion, though actually a trap.",
        "significance": "The apparent culmination of Winston''s rebellion, but actually the completion of his entrapment."
      },
      {
        "title": "Chapter 9: Goldstein''s Book",
        "summary": "Winston reads from Goldstein''s book, ''The Theory and Practice of Oligarchical Collectivism,'' which explains the true nature of the Party''s power, the concept of perpetual war, and the three-class system, providing theoretical framework for understanding the Party''s methods.",
        "significance": "Provides theoretical understanding of how totalitarian power operates."
      },
      {
        "title": "Chapter 10: The Arrest",
        "summary": "Winston and Julia are arrested in their room above Mr. Charrington''s shop. Mr. Charrington is revealed to be a member of the Thought Police, marking the collapse of Winston''s rebellion and the end of his relationship with Julia.",
        "significance": "The collapse of Winston''s rebellion and the revelation of the trap."
      }
    ]
  },
  {
    "title": "Part Three: The Ministry of Love",
    "description": "Winston''s torture, re-education, and ultimate defeat",
    "chapters": [
      {
        "title": "Chapter 1: The Ministry of Love",
        "summary": "Winston is imprisoned in the Ministry of Love, where he encounters other prisoners and begins to understand the true nature of the Party''s power. Winston enters the final phase of his destruction and re-education.",
        "significance": "Beginning of Winston''s systematic breaking and re-education."
      },
      {
        "title": "Chapter 2: O''Brien the Torturer",
        "summary": "O''Brien reveals himself as Winston''s torturer and begins the process of breaking down Winston''s resistance through physical and psychological torture. The revelation of O''Brien''s true nature marks the beginning of Winston''s systematic breaking.",
        "significance": "Reveals the extent of the Party''s deception and control."
      },
      {
        "title": "Chapter 3: Breaking Winston",
        "summary": "O''Brien continues Winston''s torture and re-education, forcing him to accept the Party''s version of reality and abandon his belief in objective truth. Winston''s grip on objective reality is systematically destroyed through the famous ''five fingers'' scene.",
        "significance": "Demonstrates the destruction of Winston''s belief in objective reality."
      },
      {
        "title": "Chapter 4: Room 101",
        "summary": "Winston is taken to Room 101, where he faces his worst fear - rats. Under this ultimate torture, he betrays Julia and begs for her to be tortured instead, representing his final breaking point and the destruction of his last human loyalty.",
        "significance": "Winston''s final breaking point and betrayal of his last human connection."
      },
      {
        "title": "Chapter 5: The Chestnut Tree Café",
        "summary": "Winston, now released and broken, sits in the Chestnut Tree Café. He encounters Julia briefly but they are both completely changed. Winston realizes he loves Big Brother, representing the complete victory of the Party over Winston''s mind and spirit.",
        "significance": "The complete victory of totalitarianism over individual consciousness."
      }
    ]
  }
]');

-- ============================================================================
-- POPULATE CONTEMPORARY CONNECTIONS FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

INSERT INTO public.book_contemporary_connections (book_id, sections) VALUES
('nineteen-eighty-four', '[
  {
    "title": "Digital Surveillance and Privacy",
    "subsections": [
      {
        "title": "Government Mass Surveillance",
        "content": [
          "Orwell''s telescreens and Thought Police find their modern equivalent in government mass surveillance programs. The NSA''s data collection, PRISM program, and mass surveillance revealed by Edward Snowden demonstrate how modern technology has created surveillance capabilities that rival or exceed those in Orwell''s dystopia.",
          "While Orwell imagined forced surveillance through telescreens, modern surveillance often operates through voluntary participation in digital platforms, making it potentially more pervasive and effective. Examples include metadata collection from phone calls and internet usage, facial recognition systems in public spaces, location tracking through smartphones and apps, and social media monitoring and analysis."
        ]
      },
      {
        "title": "Corporate Data Collection",
        "content": [
          "The Party''s complete knowledge of citizens'' activities and thoughts has parallels in tech companies collecting vast amounts of personal data for targeted advertising and behavioral prediction. Unlike the Party''s political motivations, corporate surveillance is driven by profit, but the result is similarly comprehensive knowledge of individual behavior and preferences.",
          "Examples include Google''s data collection across all services, Facebook''s tracking of users across the internet, Amazon''s Alexa recording conversations, and predictive algorithms based on browsing and purchase history."
        ]
      }
    ]
  },
  {
    "title": "Information Manipulation and ''Post-Truth''",
    "subsections": [
      {
        "title": "Fake News and Disinformation",
        "content": [
          "The Ministry of Truth''s constant rewriting of history and spreading of false information finds modern parallels in the deliberate spread of false information through social media and partisan news sources. While Orwell imagined centralized control of information, modern disinformation operates through decentralized networks, making it harder to identify and counter but equally effective at undermining shared truth.",
          "Examples include deliberate misinformation campaigns during elections, COVID-19 conspiracy theories and health misinformation, climate change denial despite scientific consensus, and deep fake technology creating false video evidence."
        ]
      },
      {
        "title": "Echo Chambers and Filter Bubbles",
        "content": [
          "The Party''s control over information, ensuring citizens only received Party-approved viewpoints, has parallels in social media algorithms creating personalized information bubbles that reinforce existing beliefs. Rather than imposed censorship, modern technology creates voluntary isolation from challenging information, potentially more effective than Orwell''s forced conformity.",
          "Examples include Facebook and Twitter algorithms showing similar content, YouTube recommendation systems creating ideological rabbit holes, personalized news feeds that confirm biases, and geographic and social segregation reinforced by technology."
        ]
      }
    ]
  }
]');

-- ============================================================================
-- POPULATE ESSAY GUIDE FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

INSERT INTO public.book_essay_guides (book_id, structure, techniques, mistakes, sample_question, tips) VALUES
('nineteen-eighty-four', 
'{
  "title": "Essay Structure",
  "parts": [
    {
      "title": "Introduction",
      "wordCount": "150-200 words",
      "content": [
        "Your introduction should hook the reader and establish your argument. Include an opening hook with an engaging statement about human experience or the text''s relevance. Provide brief context mentioning Orwell, publication date, and genre. Most importantly, include a clear thesis statement addressing the question and rubric, followed by brief signposting that outlines your main arguments."
      ],
      "example": "\"The capacity for human understanding becomes both a source of hope and vulnerability when confronted with systematic oppression. George Orwell''s dystopian novel Nineteen Eighty-Four (1949) explores how totalitarian regimes exploit the paradoxes inherent in human experience to maintain absolute control...\""
    },
    {
      "title": "Body Paragraphs",
      "wordCount": "200-250 words each",
      "content": [
        "Use the PEEL structure: Point (clear topic sentence linking to thesis), Evidence (specific quotes and textual references), Explain (analysis of techniques and meaning), and Link (connect back to thesis and question)."
      ],
      "example": "Orwell demonstrates how language manipulation creates paradoxes that undermine human understanding. The Party''s slogan \"War is Peace, Freedom is Slavery, Ignorance is Strength\" exemplifies doublethink, where the paradoxical structure forces citizens to accept contradictory beliefs simultaneously. The use of parallelism in the slogans creates a rhythmic, memorable quality that normalizes the impossible, revealing how totalitarian systems exploit the human capacity for understanding by deliberately creating cognitive dissonance."
    },
    {
      "title": "Conclusion",
      "wordCount": "100-150 words",
      "content": [
        "Synthesize your argument and explore broader implications. Restate your thesis in new words, synthesize your main arguments, discuss broader implications for human experience, and if appropriate, mention contemporary relevance."
      ]
    }
  ]
}',
'{
  "title": "Essential Techniques for Analysis",
  "categories": [
    {
      "title": "Literary Techniques",
      "techniques": [
        {
          "name": "Symbolism",
          "description": "Big Brother represents the omnipresent state, telescreens symbolize surveillance, Room 101 represents ultimate fear and breaking point."
        },
        {
          "name": "Paradox",
          "description": "Party slogans create logical contradictions, doublethink requires holding contradictory beliefs simultaneously."
        },
        {
          "name": "Irony",
          "description": "Ministry names contradict their functions (Ministry of Truth spreads lies), Winston''s job involves destroying truth."
        },
        {
          "name": "Imagery",
          "description": "Dystopian setting creates oppressive atmosphere, surveillance imagery emphasizes lack of privacy."
        }
      ]
    },
    {
      "title": "Narrative Techniques",
      "techniques": [
        {
          "name": "Third Person Limited",
          "description": "Winston''s perspective allows readers to experience his internal thoughts and gradual breaking."
        },
        {
          "name": "Foreshadowing",
          "description": "\"We shall meet in the place where there is no darkness\" hints at Winston''s eventual torture."
        },
        {
          "name": "Stream of Consciousness",
          "description": "Winston''s diary entries and internal monologue reveal his psychological state."
        },
        {
          "name": "Juxtaposition",
          "description": "Past versus present, truth versus lies, love versus betrayal create thematic contrasts."
        }
      ]
    }
  ]
}',
'{
  "title": "Common Mistakes to Avoid",
  "dontDo": [
    "Retell the plot without analysis",
    "Use quotes without explaining their significance",
    "Ignore the specific question asked",
    "Write about themes without textual evidence",
    "Use overly complex language unnecessarily",
    "Forget to link back to the rubric concepts"
  ],
  "doInstead": [
    "Analyze how techniques create meaning",
    "Embed quotes seamlessly into your analysis",
    "Address the question directly throughout",
    "Support every claim with specific evidence",
    "Write clearly and precisely",
    "Connect themes to rubric concepts explicitly"
  ]
}',
'{
  "title": "Sample HSC Question",
  "question": "\"Texts explore the paradoxes and inconsistencies in human behaviour and motivations.\" To what extent does this statement apply to your prescribed text?",
  "approach": [
    "Identifying key paradoxes in Winston''s character and motivations",
    "Analyzing how the Party creates and exploits human inconsistencies",
    "Examining the paradox of love and betrayal in Winston and Julia''s relationship",
    "Discussing how doublethink represents the ultimate human paradox",
    "Connecting to broader human experiences and contemporary relevance"
  ]
}',
'{
  "title": "Writing Tips",
  "phases": [
    {
      "title": "Before You Write",
      "tips": [
        "Read the question carefully and identify key terms",
        "Plan your argument and select relevant quotes",
        "Consider how your examples connect to the rubric",
        "Organize your ideas logically"
      ]
    },
    {
      "title": "While Writing",
      "tips": [
        "Keep referring back to the question",
        "Use topic sentences to guide your paragraphs",
        "Integrate quotes smoothly into your sentences",
        "Explain the significance of your evidence",
        "Use sophisticated vocabulary appropriately"
      ]
    },
    {
      "title": "After Writing",
      "tips": [
        "Check that you''ve answered the question",
        "Ensure your argument is clear and consistent",
        "Verify that all quotes are accurate",
        "Proofread for grammar and spelling errors"
      ]
    }
  ]
}'
);

-- ============================================================================
-- POPULATE QUOTES FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

INSERT INTO public.book_quotes (book_id, quote_id, text, reference, technique, themes, explanation, rubric_connection, chapter, character, significance) VALUES
('nineteen-eighty-four', 'q1', 'War is peace. Freedom is slavery. Ignorance is strength.', 'Part 1, Chapter 1, p. 6', 'Paradox', ARRAY['Totalitarianism and Control', 'Language and Reality'], 'This slogan of the Party exemplifies doublethink, requiring citizens to accept contradictory beliefs simultaneously.', 'Anomalies and Paradoxes', 'Part 1, Chapter 1', 'Party Slogan', 'high'),
('nineteen-eighty-four', 'q2', 'Big Brother is watching you.', 'Part 1, Chapter 1, p. 3', 'Symbolism', ARRAY['Surveillance and Privacy', 'Totalitarianism and Control'], 'This ubiquitous slogan symbolizes the omnipresent surveillance state.', 'Emotional Experiences', 'Part 1, Chapter 1', 'Party Slogan', 'high');

-- ============================================================================
-- POPULATE TECHNIQUES FOR NINETEEN EIGHTY-FOUR
-- ============================================================================

INSERT INTO public.book_techniques (book_id, name, definition, example) VALUES
('nineteen-eighty-four', 'Paradox', 'A statement that appears contradictory but may reveal a deeper truth', 'War is peace. Freedom is slavery. Ignorance is strength.'),
('nineteen-eighty-four', 'Symbolism', 'The use of symbols to represent ideas or qualities', 'Big Brother represents the omnipresent surveillance state.');

-- Verification query
SELECT 
    'Migration completed!' as status,
    (SELECT COUNT(*) FROM public.book_detailed_contexts) as contexts_count,
    (SELECT COUNT(*) FROM public.book_rubric_connections) as rubric_connections_count,
    (SELECT COUNT(*) FROM public.book_plot_summaries) as plot_summaries_count,
    (SELECT COUNT(*) FROM public.book_contemporary_connections) as contemporary_connections_count,
    (SELECT COUNT(*) FROM public.book_essay_guides) as essay_guides_count,
    (SELECT COUNT(*) FROM public.book_quotes) as quotes_count,
    (SELECT COUNT(*) FROM public.book_techniques) as techniques_count; 