<?php

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('student')->delete();
        DB::table('teacher')->delete();
        DB::table('director')->delete();
        DB::table('guardian')->delete();
        DB::table('user')->delete();

        // create data for users, addresses, and contacts
        $director_names = ['Vanessa Wheeler', 'Shirley Otterson', 'Margaret Ledbetter', 'Jimmy Montalvo', 'Rebecca Davis'];
        $teacher_names = ['Amanda Dixon', 'Joseph Penson', 'Brian Gilmore', 'Shawn Furtado', 'Charles Carnes', 'Xavier Meek', 'Arthur Loomis', 'Brian Aiello'];
        $student_names = [
            'Mitchell Prince', 'Hector Ayers', 'Gina Shields', 'Nehemiah Wagner', 'Monserrat Schmidt',
            'Hamza Lozano', 'Salvatore Howell', 'Julie Lang', 'Jakayla Greer', 'Kaeden Prince',
            'Alden Yu', 'Lacey Mcconnell', 'Kai Han', 'Sonal Kang', 'Jagadish Gang',
            'Jiang Kuang', 'Ah-Jung-Hee Tamboli', 'Hardeep Lu', 'Varghese Bachchan', 'Iseul Wen',
            'Hari Kumar', 'Myeong Misra', 'Eun-Yeong Rhee', 'Neela Korrapati', 'Ji-Hun Li',
            'Zhou Jin', 'Xue Chung', 'Abhilash Mishra', 'Mukta Guan', 'Jia Wong'
        ];
        $addresses = [
            [
                'street_address' => '464 Lawrence Street',
                'city' => 'Cumberland',
                'state' => 'RI',
                'postal_code' => '02864'
            ],
            [
                'street_address' => '294 Vernon Circle',
                'city' => 'Hickory',
                'state' => 'NC',
                'postal_code' => '28601'
            ],
            [
                'street_address' => '8210 Argyle Street',
                'city' => 'Festerville Trevose',
                'state' => 'PA',
                'postal_code' => '19053'
            ],
            [
                'street_address' => '8483 Hickory Street',
                'city' => 'Erie',
                'state' => 'PA',
                'postal_code' => '16506'
            ],
            [
                'street_address' => '786 Grant Court',
                'city' => 'Glenview',
                'state' => 'IL',
                'postal_code' => '60025'
            ],
            [
                'street_address' => '221 Peg Shop Drive',
                'city' => 'Toledo',
                'state' => 'OH',
                'postal_code' => '43612'
            ]
        ];

        // insert users
        $users = [[
            'id' => 1,
            'type' => 'administrator',
            'first_name' => 'Super',
            'last_name' => 'User'
        ]];
        $directors = [];
        $teachers = [];
        $students = [];
        $i = 2;
        foreach ($director_names as $director) {
            $users[] = [
                'id' => $i,
                'type' => 'director',
                'first_name' => explode(' ', $director)[0],
                'last_name' => explode(' ', $director)[1]
            ];
            $directors[] = [ 'id' => $i ];
            $i++;
        }
        foreach ($teacher_names as $teacher) {
            $users[] = [
                'id' => $i,
                'type' => 'teacher',
                'first_name' => explode(' ', $teacher)[0],
                'last_name' => explode(' ', $teacher)[1]
            ];
            $teachers[] = [ 'id' => $i ];
            $i++;
        }
        foreach ($student_names as $student) {
            $users[] = [
                'id' => $i,
                'type' => 'student',
                'first_name' => explode(' ', $student)[0],
                'last_name' => explode(' ', $student)[1]
            ];
            $students[] = [
                'id' => $i,
                'dob' => '2010-04-12 00:00:00',
                'gender' => ($i%2 == 0) ? 'M' : 'F',
                'school' => 'Any School USA'
            ];
            $i++;
        }
        DB::table('user')->insert($users);
        DB::table('director')->insert($directors);
        DB::table('teacher')->insert($teachers);
        DB::table('student')->insert($students);

        // insert address data
        $insert_addresses = [];
        for ($i=0; $i < sizeof($users); $i++) {
            $address = $addresses[$i % sizeof($addresses)];
            $insert_addresses[] = array_merge($address, [
                'id' => $i+1,
                'user_id' => $i+1,
                'title' => 'Home Address',
                'country' => 'USA'
            ]);
        }
        DB::table('user_address')->insert($insert_addresses);

        // insert user contact data
        $insert_contacts = [];
        $cid = 1;
        foreach ($students as $student) {

//        for ($i=1; $i <= sizeof($users); $i++) {
            $insert_contacts = array_merge($insert_contacts, [
                [
                    'id' => $cid++,
                    'user_id' => $student['id'],
                    'title' => 'Dad Mobile',
                    'type' => 'mobile_phone',
                    'description' => 'Father\'s mobile phone number.',
                    'value' => '3014502941'
                ],
                [
                    'id' => $cid++,
                    'user_id' => $student['id'],
                    'title' => 'Mom Mobile',
                    'type' => 'mobile_phone',
                    'description' => 'Mother\'s mobile phone number.',
                    'value' => '3014502942'
                ],
                [
                    'id' => $cid++,
                    'user_id' => $student['id'],
                    'title' => 'Home Phone',
                    'type' => 'home_phone',
                    'description' => 'House landline phone number.',
                    'value' => '3014502943'
                ],
                [
                    'id' => $cid++,
                    'user_id' => $student['id'],
                    'title' => 'Grandmother Mobile',
                    'type' => 'mobile_phone',
                    'description' => 'Grandmother\'s mobile phone - emergency contact.',
                    'value' => '3014502942'
                ],
                [
                    'id' => $cid++,
                    'user_id' => $student['id'],
                    'title' => 'Mom Email',
                    'type' => 'email',
                    'description' => 'Mother\'s email address.',
                    'value' => 'momemail@gmail.com'
                ]
            ]);
        }
        DB::table('user_contact')->insert($insert_contacts);
    }
}
