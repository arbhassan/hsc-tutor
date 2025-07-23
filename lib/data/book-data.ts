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
  quotes: Quote[]
  techniques: Technique[]
  
  // Detailed content for lesson pages
  detailedContexts: DetailedContexts
  detailedRubricConnections: DetailedRubricConnections
  plotSummary: PlotSummary
  detailedContemporaryConnections: DetailedContemporaryConnections
  essayGuide: EssayGuide
  
  // Legacy fields for backward compatibility
  rubricConnections: RubricConnection[]
  contexts: Contexts
  timelineEvents: TimelineEvent[]
  contemporaryConnections: ContemporaryConnection[]
  additionalResources: AdditionalResource[]
}

export interface Theme {
  id: string
  title: string
  icon: string
  summary: string
  color: string
  examples: string[]
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

// Detailed Context Interfaces
export interface DetailedContexts {
  historical: DetailedContext
  political: DetailedContext
  biographical: DetailedContext
  philosophical: DetailedContext
}

export interface DetailedContext {
  title: string
  sections: ContextSection[]
}

export interface ContextSection {
  title?: string
  content: string[]
}

// Detailed Rubric Connections
export interface DetailedRubricConnections {
  anomaliesAndParadoxes: RubricSection
  emotionalExperiences: RubricSection
  relationships: RubricSection
  humanCapacityForUnderstanding: RubricSection
}

export interface RubricSection {
  title: string
  subsections: RubricSubsection[]
}

export interface RubricSubsection {
  title: string
  content: string[]
}

// Plot Summary
export interface PlotSummary {
  parts: PlotPart[]
}

export interface PlotPart {
  title: string
  description?: string
  chapters: PlotChapter[]
}

export interface PlotChapter {
  title: string
  summary: string
  significance: string
}

// Detailed Contemporary Connections
export interface DetailedContemporaryConnections {
  sections: ContemporarySection[]
}

export interface ContemporarySection {
  title: string
  subsections: ContemporarySubsection[]
}

export interface ContemporarySubsection {
  title: string
  content: string[]
}

// Essay Guide
export interface EssayGuide {
  structure: EssayStructureSection
  techniques: EssayTechniquesSection
  mistakes: EssayMistakesSection
  sampleQuestion: SampleQuestionSection
  tips: EssayTipsSection
}

export interface EssayStructureSection {
  title: string
  parts: EssayStructurePart[]
}

export interface EssayStructurePart {
  title: string
  wordCount?: string
  content: string[]
  example?: string
}

export interface EssayTechniquesSection {
  title: string
  categories: TechniqueCategory[]
}

export interface TechniqueCategory {
  title: string
  techniques: TechniqueItem[]
}

export interface TechniqueItem {
  name: string
  description: string
}

export interface EssayMistakesSection {
  title: string
  dontDo: string[]
  doInstead: string[]
}

export interface SampleQuestionSection {
  title: string
  question: string
  approach: string[]
}

export interface EssayTipsSection {
  title: string
  phases: TipsPhase[]
}

export interface TipsPhase {
  title: string
  tips: string[]
}

// Legacy interfaces for backward compatibility
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

    detailedContexts: {
      historical: {
        title: "Historical Context",
        sections: [
          {
            content: [
              "Written in 1948 (with the title being a simple inversion of the year), Nineteen Eighty-Four reflects Orwell's concerns about totalitarian regimes that rose to power in the early-to-mid 20th century. The novel draws particularly on elements of Stalinism in the Soviet Union and aspects of Nazi Germany.",
              "The novel emerged from a world that had just witnessed the horrors of World War II and was beginning to grapple with the implications of the atomic age. The geopolitical landscape was rapidly changing, with the emergence of two superpowers - the United States and Soviet Union - locked in an ideological struggle that would define the next several decades.",
              "Orwell was particularly influenced by the show trials in the Soviet Union during the 1930s, where prominent Communist Party members were forced to confess to crimes they had not committed. This directly influenced the novel's portrayal of Winston's eventual capitulation and his forced love for Big Brother.",
              "The concept of perpetual war between the three superstates (Oceania, Eurasia, and Eastasia) reflects the emerging Cold War dynamics, where shifting alliances and proxy conflicts would become the norm rather than direct confrontation between major powers."
            ]
          }
        ]
      },
      political: {
        title: "Political Context",
        sections: [
          {
            content: [
              "Orwell wrote Nineteen Eighty-Four as a warning against totalitarianism in all its forms. Having witnessed the rise of fascism in Europe and the corruption of socialist ideals in the Soviet Union, Orwell sought to demonstrate how political power could be used to completely control human thought and behavior.",
              "The novel serves as a critique of totalitarianism regardless of its political orientation. Orwell, himself a democratic socialist, was deeply concerned about how revolutionary movements could be corrupted by those seeking absolute power.",
              "The Party's use of doublethink and Newspeak reflects Orwell's observations about how political movements manipulate language to control thought. The concept of 'thoughtcrime' represents the ultimate extension of political control - the regulation not just of actions, but of thoughts themselves.",
              "The novel's portrayal of the Inner Party, Outer Party, and proles reflects Orwell's understanding of how totalitarian systems create hierarchies that serve to maintain control while preventing unified resistance."
            ]
          }
        ]
      },
      biographical: {
        title: "Biographical Context",
        sections: [
          {
            content: [
              "George Orwell (Eric Arthur Blair, 1903-1950) drew extensively on his personal experiences in crafting Nineteen Eighty-Four. His time as an imperial police officer in Burma, his experiences of poverty, and particularly his participation in the Spanish Civil War all informed the novel's themes and imagery.",
              "Orwell's experiences in Burma gave him firsthand knowledge of how imperial power operates and how institutions can dehumanize both the oppressed and the oppressor. This experience informed his understanding of how power corrupts and how systems of control function.",
              "His participation in the Spanish Civil War was particularly formative. Fighting with the POUM (Workers' Party of Marxist Unification), Orwell witnessed how different leftist factions turned on each other, and how propaganda was used to rewrite recent history. The experience of being hunted by former allies directly influenced the novel's themes of betrayal and the malleability of truth.",
              "The novel was written while Orwell was seriously ill with tuberculosis on the remote Scottish island of Jura. His declining health and isolation may have contributed to the novel's bleak tone and its exploration of physical and psychological suffering."
            ]
          }
        ]
      },
      philosophical: {
        title: "Philosophical Context",
        sections: [
          {
            content: [
              "Nineteen Eighty-Four engages with several philosophical traditions, particularly those concerned with truth, language, and power. The novel explores questions about the nature of reality, the relationship between language and thought, and the limits of human resistance to oppression.",
              "The novel's exploration of Newspeak reflects engagement with the Sapir-Whorf hypothesis - the idea that language shapes thought. By systematically reducing vocabulary and eliminating words that express dissent, the Party attempts to make rebellion literally unthinkable.",
              "The novel also engages with existentialist philosophy, particularly in its exploration of Winston's struggle to maintain authentic selfhood in the face of overwhelming social pressure. The question of whether Winston's final capitulation represents the destruction of his essential self or merely a pragmatic survival strategy reflects existentialist concerns about authenticity and bad faith.",
              "The novel's treatment of truth and reality anticipates postmodern concerns about the constructed nature of knowledge while simultaneously asserting the importance of objective truth as a foundation for human dignity and resistance."
            ]
          }
        ]
      }
    },

    detailedRubricConnections: {
      anomaliesAndParadoxes: {
        title: "Anomalies and Paradoxes",
        subsections: [
          {
            title: "Doublethink and Contradictory Beliefs",
            content: [
              "The Party's slogans 'War is Peace, Freedom is Slavery, Ignorance is Strength' exemplify the central paradox of the novel - the requirement to hold contradictory beliefs simultaneously. The Ministry of Truth spreads lies, the Ministry of Peace wages war, and Winston's job is to destroy truth while serving the Ministry of 'Truth.'",
              "These paradoxes reveal how totalitarian systems exploit human cognitive flexibility to maintain control. The ability to accept contradictions becomes a survival mechanism, but also represents the destruction of logical thought."
            ]
          },
          {
            title: "The Paradox of Memory and History",
            content: [
              "The novel presents the paradox of a society where the past is constantly rewritten, making history both all-important and completely malleable. 'Who controls the past controls the future; who controls the present controls the past' demonstrates how control of information creates a reality where truth becomes whatever those in power declare it to be."
            ]
          }
        ]
      },
      emotionalExperiences: {
        title: "Emotional Experiences",
        subsections: [
          {
            title: "Love as Rebellion and Vulnerability",
            content: [
              "Winston and Julia's love represents both the ultimate act of rebellion against the Party and their greatest vulnerability to its control. Their affair becomes an act of political rebellion, while the Party attempts to eliminate all personal loyalties. Winston's eventual betrayal of Julia in Room 101 shows how totalitarian systems seek to monopolize emotional loyalty."
            ]
          },
          {
            title: "Fear and Psychological Control",
            content: [
              "The Party uses fear as its primary tool for emotional control, from the constant threat of surveillance to the ultimate terror of Room 101. The omnipresent threat of the Thought Police, the use of personalized fears, and the Two Minutes Hate as directed emotional release demonstrate how fear becomes both a tool of control and a fundamental human experience that the Party exploits."
            ]
          }
        ]
      },
      relationships: {
        title: "Relationships",
        subsections: [
          {
            title: "Corrupted Family and Social Bonds",
            content: [
              "The Party systematically corrupts natural human relationships, turning children against parents and spouses against each other. Children are encouraged to spy on and report their parents, Winston's marriage to Katherine represents a loveless Party duty, and the Junior Spies organization turns family bonds into surveillance networks."
            ]
          },
          {
            title: "Friendship and Betrayal",
            content: [
              "The novel explores how genuine human connection becomes impossible when trust is systematically undermined by the threat of betrayal. Winston's relationship with O'Brien - mentor, friend, and ultimately torturer - along with the betrayal between Winston and Julia under torture, shows how the destruction of trust serves the Party's goal of isolating citizens."
            ]
          }
        ]
      },
      humanCapacityForUnderstanding: {
        title: "Human Capacity for Understanding",
        subsections: [
          {
            title: "The Struggle for Truth and Reality",
            content: [
              "Winston's desperate attempt to maintain his grip on objective reality represents the fundamental human need to understand and make sense of experience. 'Freedom is the freedom to say that two plus two make four' and Winston's diary as an attempt to record truth demonstrate how the capacity for independent thought and recognition of objective truth are essential to human dignity."
            ]
          },
          {
            title: "Language and Thought",
            content: [
              "Through Newspeak, the novel explores how language shapes understanding and how controlling language can limit the capacity for complex thought. Newspeak is designed to make thoughtcrime impossible through the gradual reduction of vocabulary, showing how totalitarian control extends beyond actions to the very capacity for understanding and resistance."
            ]
          }
        ]
      }
    },

    plotSummary: {
      parts: [
        {
          title: "Part One: The World of Winston Smith",
          description: "Introduction to Winston's world and his first acts of rebellion",
          chapters: [
            {
              title: "Chapter 1: Winston's World",
              summary: "Winston Smith returns to Victory Mansions and begins writing in his diary, an act of rebellion against the Party. We are introduced to the world of Oceania, Big Brother, and the omnipresent telescreens. The Two Minutes Hate ritual is introduced, along with Winston's complex feelings toward O'Brien.",
              significance: "Establishes the oppressive world and Winston's first act of rebellion."
            },
            {
              title: "Chapter 2: The Parsons Family",
              summary: "Winston helps his neighbor Mrs. Parsons with her plumbing while her children, members of the Junior Spies, play at hanging traitors and express their desire to see public executions. Mrs. Parsons fears her own children, demonstrating how the Party corrupts family relationships.",
              significance: "Shows how the Party corrupts family bonds and uses children as surveillance tools."
            },
            {
              title: "Chapter 3: Dreams and Memories",
              summary: "Winston dreams of his mother and sister, and of the 'Golden Country.' He reflects on his fragmented memories of the past and his inability to verify historical facts. The chapter explores the importance of personal memory against the Party's control over the past.",
              significance: "Explores the importance of personal memory and the Party's control over the past."
            },
            {
              title: "Chapter 4: The Ministry of Truth",
              summary: "Winston's work at the Ministry of Truth is detailed, showing how history is constantly rewritten to match the Party's current narrative. The concept of 'unpersons' is introduced through Winston's fabrication of Comrade Ogilvy's biography, demonstrating the systematic falsification of history.",
              significance: "Demonstrates how the Party controls reality by controlling information."
            },
            {
              title: "Chapter 5: Newspeak and Syme",
              summary: "Winston lunches with Syme, a philologist working on the Newspeak dictionary. Syme explains how Newspeak will eventually make thoughtcrime impossible by eliminating the words needed to express dissent. Winston realizes that Syme will be vaporized for his intelligence.",
              significance: "Explores how language shapes thought and the Party's ultimate goal of thought control."
            },
            {
              title: "Chapter 6: Winston's Marriage",
              summary: "Winston recalls his marriage to Katherine, a rigid Party member who viewed sex as a duty to the Party. Their relationship was loveless and eventually ended when Katherine disappeared, showing how the Party corrupts intimate relationships and controls sexuality.",
              significance: "Shows how the Party corrupts even the most intimate human relationships."
            },
            {
              title: "Chapter 7: The Proles",
              summary: "Winston reflects on the proles (proletariat) as the only hope for revolution, but realizes they are kept ignorant and distracted. He struggles with questions about the past and objective truth, encountering an old prole in a pub who cannot provide the historical verification Winston seeks.",
              significance: "Explores the possibility of resistance and the nature of truth."
            },
            {
              title: "Chapter 8: Mr. Charrington's Shop",
              summary: "Winston visits Mr. Charrington's antique shop in the prole district and rents the room above it. He purchases a coral paperweight and begins to plan his rebellion more seriously, taking a concrete step toward resistance by securing a private space.",
              significance: "Winston takes a concrete step toward rebellion by securing a private space."
            }
          ]
        },
        {
          title: "Part Two: The Love Affair",
          description: "Winston's relationship with Julia and his recruitment into the Brotherhood",
          chapters: [
            {
              title: "Chapter 1: Julia's Note",
              summary: "Julia passes Winston a note declaring her love. They arrange to meet in the countryside, away from the telescreens and surveillance. This marks the beginning of Winston's most significant act of rebellion.",
              significance: "Beginning of Winston's most significant rebellion through love."
            },
            {
              title: "Chapter 2: The Golden Country",
              summary: "Winston and Julia meet in the countryside - the 'Golden Country' from Winston's dreams. They make love and discuss their hatred of the Party, with Julia revealing her pragmatic approach to rebellion.",
              significance: "Represents the possibility of genuine human connection and natural beauty."
            },
            {
              title: "Chapter 3: Julia's Story",
              summary: "Julia tells Winston about her past relationships and her practical approach to surviving under the Party. Winston learns about her cynical but effective methods of rebellion, revealing different approaches to resistance.",
              significance: "Reveals different approaches to resistance and survival under totalitarianism."
            },
            {
              title: "Chapter 4: The Room Above the Shop",
              summary: "Winston and Julia begin meeting regularly in the room above Mr. Charrington's shop. They create a private world away from Party surveillance, representing the height of Winston's rebellion and happiness.",
              significance: "Creates a temporary sanctuary from Party control."
            },
            {
              title: "Chapter 5: Syme's Disappearance",
              summary: "Syme disappears, becoming an 'unperson' as Winston predicted. Winston and Julia continue their affair while maintaining their public facades, demonstrating the Party's ruthless elimination of potential threats.",
              significance: "Demonstrates the Party's systematic elimination of intelligent individuals."
            },
            {
              title: "Chapter 6: O'Brien's Invitation",
              summary: "O'Brien approaches Winston and gives him his address, ostensibly to lend him a Newspeak dictionary. Winston believes this is an invitation to join the resistance, setting up the trap that will ultimately destroy him.",
              significance: "Sets up the elaborate trap that will lead to Winston's downfall."
            },
            {
              title: "Chapter 7: Winston's Mother",
              summary: "Winston remembers his mother's disappearance and his own selfish behavior as a child. He reflects on the difference between private and public loyalties, exploring the importance of personal memory and family bonds.",
              significance: "Explores the importance of family bonds and personal loyalty."
            },
            {
              title: "Chapter 8: O'Brien's Apartment",
              summary: "Winston and Julia visit O'Brien, who recruits them into the Brotherhood, the supposed resistance organization. They receive a copy of Goldstein's book, representing the apparent culmination of Winston's rebellion, though actually a trap.",
              significance: "The apparent culmination of Winston's rebellion, but actually the completion of his entrapment."
            },
            {
              title: "Chapter 9: Goldstein's Book",
              summary: "Winston reads from Goldstein's book, 'The Theory and Practice of Oligarchical Collectivism,' which explains the true nature of the Party's power, the concept of perpetual war, and the three-class system, providing theoretical framework for understanding the Party's methods.",
              significance: "Provides theoretical understanding of how totalitarian power operates."
            },
            {
              title: "Chapter 10: The Arrest",
              summary: "Winston and Julia are arrested in their room above Mr. Charrington's shop. Mr. Charrington is revealed to be a member of the Thought Police, marking the collapse of Winston's rebellion and the end of his relationship with Julia.",
              significance: "The collapse of Winston's rebellion and the revelation of the trap."
            }
          ]
        },
        {
          title: "Part Three: The Ministry of Love",
          description: "Winston's torture, re-education, and ultimate defeat",
          chapters: [
            {
              title: "Chapter 1: The Ministry of Love",
              summary: "Winston is imprisoned in the Ministry of Love, where he encounters other prisoners and begins to understand the true nature of the Party's power. Winston enters the final phase of his destruction and re-education.",
              significance: "Beginning of Winston's systematic breaking and re-education."
            },
            {
              title: "Chapter 2: O'Brien the Torturer",
              summary: "O'Brien reveals himself as Winston's torturer and begins the process of breaking down Winston's resistance through physical and psychological torture. The revelation of O'Brien's true nature marks the beginning of Winston's systematic breaking.",
              significance: "Reveals the extent of the Party's deception and control."
            },
            {
              title: "Chapter 3: Breaking Winston",
              summary: "O'Brien continues Winston's torture and re-education, forcing him to accept the Party's version of reality and abandon his belief in objective truth. Winston's grip on objective reality is systematically destroyed through the famous 'five fingers' scene.",
              significance: "Demonstrates the destruction of Winston's belief in objective reality."
            },
            {
              title: "Chapter 4: Room 101",
              summary: "Winston is taken to Room 101, where he faces his worst fear - rats. Under this ultimate torture, he betrays Julia and begs for her to be tortured instead, representing his final breaking point and the destruction of his last human loyalty.",
              significance: "Winston's final breaking point and betrayal of his last human connection."
            },
            {
              title: "Chapter 5: The Chestnut Tree Café",
              summary: "Winston, now released and broken, sits in the Chestnut Tree Café. He encounters Julia briefly but they are both completely changed. Winston realizes he loves Big Brother, representing the complete victory of the Party over Winston's mind and spirit.",
              significance: "The complete victory of totalitarianism over individual consciousness."
            }
          ]
        }
      ]
    },

    detailedContemporaryConnections: {
      sections: [
        {
          title: "Digital Surveillance and Privacy",
          subsections: [
            {
              title: "Government Mass Surveillance",
              content: [
                "Orwell's telescreens and Thought Police find their modern equivalent in government mass surveillance programs. The NSA's data collection, PRISM program, and mass surveillance revealed by Edward Snowden demonstrate how modern technology has created surveillance capabilities that rival or exceed those in Orwell's dystopia.",
                "While Orwell imagined forced surveillance through telescreens, modern surveillance often operates through voluntary participation in digital platforms, making it potentially more pervasive and effective. Examples include metadata collection from phone calls and internet usage, facial recognition systems in public spaces, location tracking through smartphones and apps, and social media monitoring and analysis."
              ]
            },
            {
              title: "Corporate Data Collection",
              content: [
                "The Party's complete knowledge of citizens' activities and thoughts has parallels in tech companies collecting vast amounts of personal data for targeted advertising and behavioral prediction. Unlike the Party's political motivations, corporate surveillance is driven by profit, but the result is similarly comprehensive knowledge of individual behavior and preferences.",
                "Examples include Google's data collection across all services, Facebook's tracking of users across the internet, Amazon's Alexa recording conversations, and predictive algorithms based on browsing and purchase history."
              ]
            }
          ]
        },
        {
          title: "Information Manipulation and 'Post-Truth'",
          subsections: [
            {
              title: "Fake News and Disinformation",
              content: [
                "The Ministry of Truth's constant rewriting of history and spreading of false information finds modern parallels in the deliberate spread of false information through social media and partisan news sources. While Orwell imagined centralized control of information, modern disinformation operates through decentralized networks, making it harder to identify and counter but equally effective at undermining shared truth.",
                "Examples include deliberate misinformation campaigns during elections, COVID-19 conspiracy theories and health misinformation, climate change denial despite scientific consensus, and deep fake technology creating false video evidence."
              ]
            },
            {
              title: "Echo Chambers and Filter Bubbles",
              content: [
                "The Party's control over information, ensuring citizens only received Party-approved viewpoints, has parallels in social media algorithms creating personalized information bubbles that reinforce existing beliefs. Rather than imposed censorship, modern technology creates voluntary isolation from challenging information, potentially more effective than Orwell's forced conformity.",
                "Examples include Facebook and Twitter algorithms showing similar content, YouTube recommendation systems creating ideological rabbit holes, personalized news feeds that confirm biases, and geographic and social segregation reinforced by technology."
              ]
            }
          ]
        },
        {
          title: "Language Control and Thought Policing",
          subsections: [
            {
              title: "Political Correctness and Cancel Culture",
              content: [
                "Newspeak's limitation of expressible thoughts and thoughtcrime's punishment of dissent find modern parallels in social and professional consequences for expressing certain viewpoints or using particular language. While not government-imposed like Newspeak, social pressure to conform to approved language and ideas can have similar effects on free expression and thought.",
                "Examples include social media bans and deplatforming for controversial speech, professional consequences for expressing unpopular opinions, university campus speech codes and safe spaces, and corporate diversity and inclusion language requirements."
              ]
            },
            {
              title: "Euphemisms and Doublespeak",
              content: [
                "The Party's use of language to obscure reality (War is Peace, Freedom is Slavery) has modern parallels in political and corporate language designed to obscure uncomfortable truths. Modern euphemisms serve similar functions to Orwell's doublespeak, making harsh realities more palatable and avoiding direct confrontation with difficult truths.",
                "Examples include 'enhanced interrogation' instead of torture, 'collateral damage' instead of civilian casualties, 'rightsizing' instead of layoffs, and 'alternative facts' instead of lies."
              ]
            }
          ]
        },
        {
          title: "Technology and Social Control",
          subsections: [
            {
              title: "Smart Devices and IoT Surveillance",
              content: [
                "Orwell's telescreens that cannot be turned off find modern parallels in smart speakers, phones, and IoT devices that are always listening and collecting data. Unlike Orwell's forced surveillance, modern devices are voluntarily adopted for convenience, making surveillance more pervasive and accepted.",
                "Examples include Amazon Alexa and Google Home always listening, smart TVs with cameras and microphones, fitness trackers monitoring health and location, and smart home devices collecting behavioral data."
              ]
            },
            {
              title: "Social Credit and Behavioral Modification",
              content: [
                "The Party's system of rewards and punishments to control behavior finds modern expression in China's social credit system and algorithmic behavior modification. Modern technology enables more sophisticated and automated systems of behavioral control than Orwell imagined, using data analysis and algorithmic decision-making.",
                "Examples include China's social credit system affecting access to services, algorithmic hiring and lending decisions, social media addiction and behavioral manipulation, and gamification of compliance and conformity."
              ]
            }
          ]
        },
        {
          title: "Modern Authoritarianism",
          subsections: [
            {
              title: "Populist Authoritarianism",
              content: [
                "Big Brother as the beloved leader who embodies the will of the people finds parallels in populist leaders claiming to represent 'the people' against established institutions. Modern authoritarian leaders often gain power through democratic means while gradually undermining democratic institutions, a more subtle approach than Orwell's totalitarian state.",
                "Examples include attacks on press freedom and 'fake news' claims, undermining of judicial independence, cult of personality around political leaders, and use of social media to bypass traditional media."
              ]
            },
            {
              title: "Nationalism and Enemy Creation",
              content: [
                "Oceania's perpetual war with Eurasia and Eastasia, with shifting enemies, finds parallels in political movements creating and shifting focus between various 'enemies' to maintain unity. Like Orwell's shifting alliances, modern political movements often require external or internal enemies to maintain cohesion and justify authoritarian measures.",
                "Examples include immigration as a political wedge issue, trade wars and economic nationalism, cultural wars and identity politics, and conspiracy theories about internal enemies."
              ]
            }
          ]
        }
      ]
    },

    essayGuide: {
      structure: {
        title: "Essay Structure",
        parts: [
          {
            title: "Introduction",
            wordCount: "150-200 words",
            content: [
              "Your introduction should hook the reader and establish your argument. Include an opening hook with an engaging statement about human experience or the text's relevance. Provide brief context mentioning Orwell, publication date, and genre. Most importantly, include a clear thesis statement addressing the question and rubric, followed by brief signposting that outlines your main arguments."
            ],
            example: "\"The capacity for human understanding becomes both a source of hope and vulnerability when confronted with systematic oppression. George Orwell's dystopian novel Nineteen Eighty-Four (1949) explores how totalitarian regimes exploit the paradoxes inherent in human experience to maintain absolute control...\""
          },
          {
            title: "Body Paragraphs",
            wordCount: "200-250 words each",
            content: [
              "Use the PEEL structure: Point (clear topic sentence linking to thesis), Evidence (specific quotes and textual references), Explain (analysis of techniques and meaning), and Link (connect back to thesis and question)."
            ],
            example: "Orwell demonstrates how language manipulation creates paradoxes that undermine human understanding. The Party's slogan \"War is Peace, Freedom is Slavery, Ignorance is Strength\" exemplifies doublethink, where the paradoxical structure forces citizens to accept contradictory beliefs simultaneously. The use of parallelism in the slogans creates a rhythmic, memorable quality that normalizes the impossible, revealing how totalitarian systems exploit the human capacity for understanding by deliberately creating cognitive dissonance."
          },
          {
            title: "Conclusion",
            wordCount: "100-150 words",
            content: [
              "Synthesize your argument and explore broader implications. Restate your thesis in new words, synthesize your main arguments, discuss broader implications for human experience, and if appropriate, mention contemporary relevance."
            ]
          }
        ]
      },
      techniques: {
        title: "Essential Techniques for Analysis",
        categories: [
          {
            title: "Literary Techniques",
            techniques: [
              {
                name: "Symbolism",
                description: "Big Brother represents the omnipresent state, telescreens symbolize surveillance, Room 101 represents ultimate fear and breaking point."
              },
              {
                name: "Paradox",
                description: "Party slogans create logical contradictions, doublethink requires holding contradictory beliefs simultaneously."
              },
              {
                name: "Irony",
                description: "Ministry names contradict their functions (Ministry of Truth spreads lies), Winston's job involves destroying truth."
              },
              {
                name: "Imagery",
                description: "Dystopian setting creates oppressive atmosphere, surveillance imagery emphasizes lack of privacy."
              }
            ]
          },
          {
            title: "Narrative Techniques",
            techniques: [
              {
                name: "Third Person Limited",
                description: "Winston's perspective allows readers to experience his internal thoughts and gradual breaking."
              },
              {
                name: "Foreshadowing",
                description: "\"We shall meet in the place where there is no darkness\" hints at Winston's eventual torture."
              },
              {
                name: "Stream of Consciousness",
                description: "Winston's diary entries and internal monologue reveal his psychological state."
              },
              {
                name: "Juxtaposition",
                description: "Past versus present, truth versus lies, love versus betrayal create thematic contrasts."
              }
            ]
          }
        ]
      },
      mistakes: {
        title: "Common Mistakes to Avoid",
        dontDo: [
          "Retell the plot without analysis",
          "Use quotes without explaining their significance",
          "Ignore the specific question asked",
          "Write about themes without textual evidence",
          "Use overly complex language unnecessarily",
          "Forget to link back to the rubric concepts"
        ],
        doInstead: [
          "Analyze how techniques create meaning",
          "Embed quotes seamlessly into your analysis",
          "Address the question directly throughout",
          "Support every claim with specific evidence",
          "Write clearly and precisely",
          "Connect themes to rubric concepts explicitly"
        ]
      },
      sampleQuestion: {
        title: "Sample HSC Question",
        question: "\"Texts explore the paradoxes and inconsistencies in human behaviour and motivations.\" To what extent does this statement apply to your prescribed text?",
        approach: [
          "Identifying key paradoxes in Winston's character and motivations",
          "Analyzing how the Party creates and exploits human inconsistencies",
          "Examining the paradox of love and betrayal in Winston and Julia's relationship",
          "Discussing how doublethink represents the ultimate human paradox",
          "Connecting to broader human experiences and contemporary relevance"
        ]
      },
      tips: {
        title: "Writing Tips",
        phases: [
          {
            title: "Before You Write",
            tips: [
              "Read the question carefully and identify key terms",
              "Plan your argument and select relevant quotes",
              "Consider how your examples connect to the rubric",
              "Organize your ideas logically"
            ]
          },
          {
            title: "While Writing",
            tips: [
              "Keep referring back to the question",
              "Use topic sentences to guide your paragraphs",
              "Integrate quotes smoothly into your sentences",
              "Explain the significance of your evidence",
              "Use sophisticated vocabulary appropriately"
            ]
          },
          {
            title: "After Writing",
            tips: [
              "Check that you've answered the question",
              "Ensure your argument is clear and consistent",
              "Verify that all quotes are accurate",
              "Proofread for grammar and spelling errors"
            ]
          }
        ]
      }
    },

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

    // Legacy fields for backward compatibility
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
  },

  // ... (other books would follow the same structure)
};

// Helper function to get book data by ID
export const getBookData = async (textId: string): Promise<BookData> => {
  // First try to get data from Supabase
  try {
    const { detailedBookService } = await import('@/lib/services/detailed-book-service')
    const supabaseData = await detailedBookService.getBookData(textId)
    
    if (supabaseData) {
      return supabaseData
    }
  } catch (error) {
    console.warn('Failed to fetch from Supabase, falling back to static data:', error)
  }

  // Fallback to static data
  return bookData[textId] || {
    id: textId,
    title: "Book Not Found",
    author: "Unknown",
    publicationYear: "Unknown",
    genre: "Unknown",
    coverImage: "/placeholder.svg?height=120&width=200",
    introduction: "This book's detailed content is not yet available. Please check back later or contact support.",
    themes: [],
    quotes: [],
    techniques: [],
    detailedContexts: {
      historical: { title: "Historical Context", sections: [] },
      political: { title: "Political Context", sections: [] },
      biographical: { title: "Biographical Context", sections: [] },
      philosophical: { title: "Philosophical Context", sections: [] },
    },
    detailedRubricConnections: {
      anomaliesAndParadoxes: { title: "Anomalies and Paradoxes", subsections: [] },
      emotionalExperiences: { title: "Emotional Experiences", subsections: [] },
      relationships: { title: "Relationships", subsections: [] },
      humanCapacityForUnderstanding: { title: "Human Capacity for Understanding", subsections: [] },
    },
    plotSummary: { parts: [] },
    detailedContemporaryConnections: { sections: [] },
    essayGuide: {
      structure: { title: "Essay Structure", parts: [] },
      techniques: { title: "Essential Techniques for Analysis", categories: [] },
      mistakes: { title: "Common Mistakes to Avoid", dontDo: [], doInstead: [] },
      sampleQuestion: { title: "Sample HSC Question", question: "", approach: [] },
      tips: { title: "Writing Tips", phases: [] }
    },
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
  };
}; 