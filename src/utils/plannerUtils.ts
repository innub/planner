import { Prisma, SemesterCode, SemesterType } from '@prisma/client';
import { ObjectId } from 'bson';
import { v4 as uuid } from 'uuid';

import DUMMY_PLAN from '../data/add_courses.json';
import { Semester, StudentPlan } from '../modules/common/data';
import { createNewYear } from './utilFunctions';

export interface RecentSemester {
  year: number;
  semester: SemesterCode;
}

// Initial value for plan until data is properly loaded
export const initialPlan: StudentPlan = {
  id: 'empty-plan',
  title: 'Just a Degree Plan',
  major: 'Computer Science',
  semesters: DUMMY_PLAN,
};

const dummySemesters: Semester[] = [
  {
    title: 'Fall 2022',
    code: '2022f',
    courses: [],
  },
  {
    title: 'Spring 2023',
    code: '2023s',
    courses: [],
  },
  {
    title: 'Fall 2023',
    code: '2023f',
    courses: [],
  },
  {
    title: 'Spring 2024',
    code: '2024s',
    courses: [],
  },
  {
    title: 'Fall 2024',
    code: '2024f',
    courses: [],
  },
  {
    title: 'Spring 2025',
    code: '2025s',
    courses: [],
  },
  {
    title: 'Fall 2025',
    code: '2025f',
    courses: [],
  },
  {
    title: 'Spring 2026',
    code: '2026s',
    courses: [],
  },
];

export const dummyPlan: StudentPlan = {
  id: uuid(),
  title: 'Empty Template',
  major: 'Major (Change in settings',
  semesters: dummySemesters,
};

/**
 * Move the item at the given start index to the given end index.
 *
 * @param courses The semester to reorder
 * @param startIndex The starting index of the item to move
 * @param endIndex The destination index of the item to move
 */
export function reorderSemester(courses: string[], startIndex: number, endIndex: number): string[] {
  const result = Array.from(courses);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function reorderList<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function formatDegreeValidationRequest(
  semesters: { code: SemesterCode; id: string; courses: string[] }[],
  degree = 'computer_science_bs',
) {
  return {
    courses: semesters
      .flatMap((s) => s.courses)
      .map((c) => {
        const split = c.split(' ');
        const department = split[0];
        const courseNumber = Number(split[1]);
        const level = Math.floor(courseNumber / 1000);
        const hours = Math.floor((courseNumber - level * 1000) / 100);
        return {
          name: c,
          department: department,
          level,
          hours,
        };
      }),
    bypasses: [],
    degree,
  };
}

export function addCreditsToPlan(
  semesters: { code: SemesterCode; id: string; courses: string[] }[],
  creditsData: { courseCode: string; semesterCode: SemesterCode | null }[],
) {
  // Calculate # years to add
  // Bug: ignores credits transferred in
  let minYear = 10000000;
  creditsData.forEach((credit) => {
    if (credit.semesterCode) {
      if (credit.semesterCode?.semester === 'f') {
        minYear = Math.min(credit.semesterCode.year, minYear);
      } else {
        minYear = Math.min(credit.semesterCode.year - 1, minYear);
      }
    }
  });

  // Add credit years to plan
  const creditSemesters: { courses: string[]; id: string; code: SemesterCode }[] = [];
  for (let year = minYear; year < semesters[0].code.year; year++) {
    const newYear = createNewYear({ semester: 'u', year }).map((sem) => {
      return { ...sem, courses: [] as string[], id: sem.id.toString() };
    });

    // Add credits to year

    newYear.forEach((sem) => {
      creditsData.map((credit) => {
        if (
          credit.semesterCode &&
          credit.semesterCode.semester === sem.code.semester &&
          credit.semesterCode.year === sem.code.year
        ) {
          sem.courses.push(credit.courseCode);
        }
      });
      creditSemesters.push(sem);
    });
  }

  creditSemesters.concat(semesters);
  return creditSemesters;
}