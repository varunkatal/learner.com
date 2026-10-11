// The launch syllabus (NCERT, session 2026–27). Used to seed MongoDB and,
// until the admin panel exists (Phase 2), as the source for public pages.
//
// Each subject lists its textbook's parts in order; a single-part book has one array.
// Chapter numbers restart in each part, matching how the textbook numbers them.

type RawSubject = {
  name: string;
  slug: string;
  book: string;
  parts: string[][];
};
type RawClass = { grade: number; subjects: RawSubject[] };

const rawSyllabus: RawClass[] = [
  {
    grade: 6,
    subjects: [
      {
        name: "Maths",
        slug: "maths",
        book: "Ganita Prakash",
        parts: [
          [
            "Patterns in Mathematics",
            "Lines and Angles",
            "Number Play",
            "Data Handling and Presentation",
            "Prime Time",
            "Perimeter and Area",
            "Fractions",
            "Playing with Constructions",
            "Symmetry",
            "The Other Side of Zero",
          ],
        ],
      },
      {
        name: "Science",
        slug: "science",
        book: "Curiosity",
        parts: [
          [
            "The Wonderful World of Science",
            "Diversity in the Living World",
            "Mindful Eating: A Path to a Healthy Body",
            "Exploring Magnets",
            "Measurement of Length and Motion",
            "Materials Around Us",
            "Temperature and its Measurement",
            "A Journey through States of Water",
            "Methods of Separation in Everyday Life",
            "Living Creatures: Exploring their Characteristics",
            "Nature's Treasures",
            "Beyond Earth",
          ],
        ],
      },
    ],
  },
  {
    grade: 7,
    subjects: [
      {
        name: "Maths",
        slug: "maths",
        book: "Ganita Prakash",
        parts: [
          [
            "Large Numbers Around Us",
            "Arithmetic Expressions",
            "A Peek Beyond the Point",
            "Expressions using Letter-Numbers",
            "Parallel and Intersecting Lines",
            "Number Play",
            "A Tale of Three Intersecting Lines",
            "Working with Fractions",
          ],
          [
            "Geometric Twins",
            "Operations with Integers",
            "Finding Common Ground",
            "Another Peek Beyond the Point",
            "Connecting the Dots",
            "Constructions and Tilings",
            "Finding the Unknown",
          ],
        ],
      },
      {
        name: "Science",
        slug: "science",
        book: "Curiosity",
        parts: [
          [
            "The Ever-Evolving World of Science",
            "Exploring Substances: Acidic, Basic, and Neutral",
            "Electricity: Circuits and their Components",
            "The World of Metals and Non-metals",
            "Changes Around Us: Physical and Chemical",
            "Adolescence: A Stage of Growth and Change",
            "Heat Transfer in Nature",
            "Measurement of Time and Motion",
            "Life Processes in Animals",
            "Life Processes in Plants",
            "Light: Shadows and Reflections",
            "Earth, Moon, and the Sun",
          ],
        ],
      },
    ],
  },
  {
    grade: 8,
    subjects: [
      {
        name: "Maths",
        slug: "maths",
        book: "Ganita Prakash",
        parts: [
          [
            "A Square and A Cube",
            "Power Play",
            "A Story of Numbers",
            "Quadrilaterals",
            "Number Play",
            "We Distribute, Yet Things Multiply",
            "Proportional Reasoning-1",
          ],
          [
            "Fractions in Disguise",
            "The Baudhayana-Pythagoras Theorem",
            "Proportional Reasoning-2",
            "Exploring Some Geometric Themes",
            "Tales by Dots and Lines",
            "Algebra Play",
            "Area",
          ],
        ],
      },
      {
        name: "Science",
        slug: "science",
        book: "Curiosity",
        parts: [
          [
            "Exploring the Investigative World of Science",
            "The Invisible Living World: Beyond Our Naked Eye",
            "Health: The Ultimate Treasure",
            "Electricity: Magnetic and Heating Effects",
            "Exploring Forces",
            "Pressure, Winds, Storms, and Cyclones",
            "Particulate Nature of Matter",
            "Nature of Matter: Elements, Compounds, and Mixtures",
            "The Amazing World of Solutes, Solvents, and Solutions",
            "Light: Mirrors and Lenses",
            "Keeping Time with the Skies",
            "How Nature Works in Harmony",
            "Our Home: Earth, a Unique Life Sustaining Planet",
          ],
        ],
      },
    ],
  },
  {
    grade: 9,
    subjects: [
      {
        name: "Maths",
        slug: "maths",
        book: "Ganita Manjari",
        // TODO(Varun): add Part 2 chapters once confirmed.
        parts: [
          [
            "Orienting Yourself: The Use of Coordinates",
            "Introduction to Linear Polynomials",
            "The World of Numbers",
            "Exploring Algebraic Identities",
            "I'm Up and Down, and Round and Round",
            "Measuring Space: Perimeter and Area",
            "The Mathematics of Maybe: Introduction to Probability",
            "Predicting What Comes Next: Exploring Sequences and Progressions",
          ],
        ],
      },
      {
        name: "Science",
        slug: "science",
        book: "Exploration",
        parts: [
          [
            "Exploration: Entering the World of Secondary Science",
            "Cell: The Building Block of Life",
            "Tissues in Action",
            "Describing Motion Around Us",
            "Exploring Mixtures and their Separation",
            "How Forces Affect Motion",
            "Work, Energy, and Simple Machines",
            "Journey Inside the Atom",
            "Atomic Foundations of Matter",
            "Sound Waves: Characteristics and Applications",
            "Reproduction: How Life Continues",
            "Patterns in Life: Diversity and Classification",
            "Earth as a System: Energy, Matter, and Life",
          ],
        ],
      },
    ],
  },
  {
    grade: 10,
    subjects: [
      {
        name: "Maths",
        slug: "maths",
        book: "Mathematics",
        parts: [
          [
            "Real Numbers",
            "Polynomials",
            "Pair of Linear Equations in Two Variables",
            "Quadratic Equations",
            "Arithmetic Progressions",
            "Triangles",
            "Coordinate Geometry",
            "Introduction to Trigonometry",
            "Some Applications of Trigonometry",
            "Circles",
            "Areas Related to Circles",
            "Surface Areas and Volumes",
            "Statistics",
            "Probability",
          ],
        ],
      },
      {
        name: "Science",
        slug: "science",
        book: "Science",
        parts: [
          [
            "Chemical Reactions and Equations",
            "Acids, Bases and Salts",
            "Metals and Non-metals",
            "Carbon and its Compounds",
            "Life Processes",
            "Control and Coordination",
            "How do Organisms Reproduce?",
            "Heredity",
            "Light – Reflection and Refraction",
            "The Human Eye and the Colourful World",
            "Electricity",
            "Magnetic Effects of Electric Current",
            "Our Environment",
          ],
        ],
      },
    ],
  },
];

export type CatalogChapter = {
  title: string;
  slug: string;
  order: number; // position across the whole subject (1, 2, 3 …)
  part: number; // textbook part (1 or 2)
  number: number; // chapter number within its part, as printed in the book
};

export type CatalogSubject = {
  name: string;
  slug: string;
  book: string;
  order: number;
  chapters: CatalogChapter[];
};

export type CatalogClass = {
  name: string;
  slug: string;
  grade: number;
  order: number;
  subjects: CatalogSubject[];
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Turns the raw lists above into the shape pages and the seed script use:
// adds slugs, ordering and part numbers.
export function getSyllabus(): CatalogClass[] {
  return rawSyllabus.map((cls, classIndex) => ({
    name: `Class ${cls.grade}`,
    slug: `class-${cls.grade}`,
    grade: cls.grade,
    order: classIndex + 1,
    subjects: cls.subjects.map((subject, subjectIndex) => {
      let order = 0;
      return {
        name: subject.name,
        slug: subject.slug,
        book: subject.book,
        order: subjectIndex + 1,
        chapters: subject.parts.flatMap((titles, partIndex) =>
          titles.map((title, i) => ({
            title,
            slug: slugify(title),
            order: ++order,
            part: partIndex + 1,
            number: i + 1,
          })),
        ),
      };
    }),
  }));
}
