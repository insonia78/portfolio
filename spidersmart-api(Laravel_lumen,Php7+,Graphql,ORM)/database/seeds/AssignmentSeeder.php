<?php

use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('assignment')->delete();
        DB::table('assignment_section')->delete();
        DB::table('question')->delete();

        // generate assignments for all books
        $books = DB::table('book')->select('id', 'level_id', 'title')->get();
        $book_assignments = []; $i = 1;
        $book_assignment_sec = []; $j = 1;
        $book_assignment_q = []; $k = 1;
        $book_assignment_qa = []; $l = 1;
        foreach ($books as $book) {
            $book_assignments[] = [
              'id' => $i,
              'level_id' => $book->level_id,
              'book_id' => $book->id,
              'title' => 'Assignment for ' . $book->title,
              'description' => 'This is the assignment that corresponds to ' . $book->title
            ];

            $book_assignment_sec = array_merge($book_assignment_sec, [
                [
                    'id' => $j,
                    'assignment_id' => $i,
                    'title' => 'Vocabulary'
                ],[
                    'id' => $j+1,
                    'assignment_id' => $i,
                    'title' => 'Reading Comprehension'
                ],[
                    'id' => $j+2,
                    'assignment_id' => $i,
                    'title' => 'Essay'
                ]
            ]);

            for ($y = 0; $y < 10; $y++) {
                $book_assignment_q[] = [
                    'id' => $k,
                    'assignment_id' => $i,
                    'assignment_section_id' => $j,
                    'type' => 'vocab',
                    'question' => ['Cat', 'Dog', 'House', 'Bird', 'Car', 'Airplane', 'Person', 'World', 'Duck', 'Cow'][$y],
                    'answer' => null
                ];
                $k++;
            }
            for ($y = 0; $y < 5; $y++) {
                $book_assignment_q[] = [
                    'id' => $k,
                    'assignment_id' => $i,
                    'assignment_section_id' => $j+1,
                    'type' => 'short_answer',
                    'question' => 'This is reading comprehension question #' . ($y+1),
                    'answer' => 'This is the correct answer'
                ];
                $k++;
            }
            $book_assignment_q[] = [
                'id' => $k,
                'assignment_id' => $i,
                'assignment_section_id' => $j+2,
                'type' => 'essay',
                'question' => '<p>Describe the premise of the story in three body paragraphs.</p>',
                'answer' => null
            ];
            $k++;
            $j+=3;
            $i++;
        }
        DB::table('assignment')->insert($book_assignments);
        DB::table('assignment_section')->insert($book_assignment_sec);
        DB::table('question')->insert($book_assignment_q);

        // generate some math assignments
        DB::table('assignment')->insert([
            [
              'id' => $i+1,
              'level_id' => 13,
              'title' => '1-2: Addition',
              'description' => 'Introduction to addition.'
            ],
            [
                'id' => $i+2,
                'level_id' => 13,
                'title' => '1-4: Sums with 5',
                'description' => 'Numbers which combine to make 5.'
            ],
            [
                'id' => $i+3,
                'level_id' => 14,
                'title' => '2-3: Skip Counting',
                'description' => 'Learning about skip counting.'
            ],
            [
                'id' => $i+4,
                'level_id' => 14,
                'title' => '2-6: Addition and Subtraction',
                'description' => 'Addition and subtraction practice.'
            ],
            [
                'id' => $i+5,
                'level_id' => 15,
                'title' => '3-3: Place Value of Digits',
                'description' => 'Learning about each place value.'
            ],
            [
                'id' => $i+6,
                'level_id' => 15,
                'title' => '3-5: Estimating Sums and Differences',
                'description' => 'Working on estimation with addition and subtraction.'
            ],
            [
                'id' => $i+7,
                'level_id' => 16,
                'title' => '4-2: Place Value of Thousands',
                'description' => 'More place value practice, this time with thousands.'
            ],
            [
                'id' => $i+8,
                'level_id' => 16,
                'title' => '4-6: Intro. to Rounding',
                'description' => 'Learning about rounding numbers.'
            ],
            [
                'id' => $i+9,
                'level_id' => 17,
                'title' => '5-2: Place Value of Decimals',
                'description' => 'More place value practice, this time with decimals.'
            ],
            [
                'id' => $i+10,
                'level_id' => 17,
                'title' => '5-9: Four Operations with Decimals',
                'description' => 'Practice with all four operations with decimals.'
            ],
            [
                'id' => $i+11,
                'level_id' => 18,
                'title' => '6-1: Ratios',
                'description' => 'Introduction to ratios.'
            ],
            [
                'id' => $i+12,
                'level_id' => 18,
                'title' => '6-2: Proportions',
                'description' => 'Introduction to proportions.'
            ],
            [
                'id' => $i+13,
                'level_id' => 19,
                'title' => '7-2: Operations w/ Integers',
                'description' => 'Practice with operations on integers.'
            ],
            [
                'id' => $i+14,
                'level_id' => 19,
                'title' => '7-4: Exponents',
                'description' => 'Introduction to exponents.'
            ],
            [
                'id' => $i+15,
                'level_id' => 20,
                'title' => '8-2: Square Roots',
                'description' => 'Introduction to square roots.'
            ],
            [
                'id' => $i+16,
                'level_id' => 20,
                'title' => '8-4: Percent',
                'description' => 'Introduction to percentages.'
            ]
        ]);

    }
}
