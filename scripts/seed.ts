// Copies the syllabus from lib/syllabus.ts into MongoDB.
// Safe to run more than once: existing records are updated, not duplicated.
// Run with: npm run seed   (needs MONGODB_URI in .env.local)

import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { getSyllabus } from "../lib/syllabus";
import { ClassModel } from "../models/Class";
import { SubjectModel } from "../models/Subject";
import { ChapterModel } from "../models/Chapter";

const upsert = { upsert: true, new: true, setDefaultsOnInsert: true } as const;

async function seed() {
  await connectDB();
  // Create the unique indexes before inserting so duplicates are rejected.
  await Promise.all([
    ClassModel.syncIndexes(),
    SubjectModel.syncIndexes(),
    ChapterModel.syncIndexes(),
  ]);

  let chapterCount = 0;

  for (const cls of getSyllabus()) {
    const classDoc = await ClassModel.findOneAndUpdate(
      { slug: cls.slug },
      { name: cls.name, order: cls.order, isPublished: true },
      upsert,
    );

    for (const subject of cls.subjects) {
      const subjectDoc = await SubjectModel.findOneAndUpdate(
        { classId: classDoc._id, slug: subject.slug },
        {
          name: subject.name,
          book: subject.book,
          order: subject.order,
          isPublished: true,
        },
        upsert,
      );

      for (const chapter of subject.chapters) {
        await ChapterModel.findOneAndUpdate(
          { subjectId: subjectDoc._id, slug: chapter.slug },
          {
            title: chapter.title,
            order: chapter.order,
            part: chapter.part,
            number: chapter.number,
            isPublished: true,
          },
          upsert,
        );
        chapterCount++;
      }
    }
    console.log(`✓ ${cls.name}`);
  }

  console.log(`Done — ${chapterCount} chapters seeded.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
