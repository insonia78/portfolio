<?php

use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('book')->delete();
        DB::table('author')->delete();
        DB::table('publisher')->delete();
        DB::table('genre')->delete();

        DB::table('author')->insert([
            [ 'id' => 1, 'name' => 'Dahl, Roald' ],
            [ 'id' => 2, 'name' => 'Lobel, Arnold' ],
            [ 'id' => 3, 'name' => 'Adler, David A.' ],
            [ 'id' => 4, 'name' => 'Rowling, J.K.' ],
            [ 'id' => 5, 'name' => 'Kwame, Alexander' ],
            [ 'id' => 6, 'name' => 'Collins, Suzanne' ],
            [ 'id' => 7, 'name' => 'Card, Orson Scott' ],
            [ 'id' => 8, 'name' => 'Hemingway, Ernest' ],
            [ 'id' => 9, 'name' => 'Tolkien, J.R.R.' ],
            [ 'id' => 10, 'name' => 'Fitzgerald, F. Scott' ],
            [ 'id' => 11, 'name' => 'Gladwell, Malcolm' ]
        ]);

        DB::table('genre')->insert([
            [ 'id' => 1, 'name' => 'Fiction' ],
            [ 'id' => 2, 'name' => 'Non-Fiction' ],
            [ 'id' => 3, 'name' => 'Adventure' ],
            [ 'id' => 4, 'name' => 'Fantasy' ],
            [ 'id' => 5, 'name' => 'Mystery/Suspense' ],
            [ 'id' => 6, 'name' => 'Biography' ],
            [ 'id' => 7, 'name' => 'History' ],
            [ 'id' => 8, 'name' => 'Humor' ],
            [ 'id' => 9, 'name' => 'Science-Fiction' ],
            [ 'id' => 10, 'name' => 'American Literature' ],
            [ 'id' => 11, 'name' => 'Thought-Provoking' ],
            [ 'id' => 12, 'name' => 'Multicultural' ]
        ]);

        DB::table('publisher')->insert([
            [ 'id' => 1, 'name' => 'Random House' ],
            [ 'id' => 2, 'name' => 'Harper Trophy' ],
            [ 'id' => 3, 'name' => 'Penguin' ],
            [ 'id' => 4, 'name' => 'Harcourt Books' ]
        ]);

        DB::table('book')->insert([
            [
                'id' => 1,
                'level_id' => 1,
                'title' => 'Uncle Elephant',
                'description' => '<p>When Mother and Father Elephant are lost at sea, their son goes to live with Uncle Elephant. Uncle Elephant and his nephew have lots of wonderful times together. But the best time of all is the happy day that Mother and Father Elephant come home again.</p>',
                'isbn' => '0-06-444104-0',
                'cover_image' => 'tumblr_lqkl12GJPo1qfhr6z.jpg'
            ],
            [
                'id' => 2,
                'level_id' => 1,
                'title' => 'Frog and Toad Are Friends',
                'description' => '<p>Frog and Toad are best friends.  They always do nice things for each other.  When one of them needs help, the other is always there.  In this book, there are five different stories about their friendship.</p>',
                'isbn' => '0-590-04529-6',
                'cover_image' => 'frog_and_toad_are_friends.jpg'
            ],
            [
                'id' => 3,
                'level_id' => 1,
                'title' => 'Frog and Toad Together',
                'description' => '<p>Frog and Toad are good friends. They like to do things together. Here are five stories about some of the things they do.</p>',
                'isbn' => '0-06-444021-4',
                'cover_image' => 'frog_and_toad_together.jpg'
            ],
            [
                'id' => 4,
                'level_id' => 2,
                'title' => 'Cam Jansen and the Mystery at the Haunted House',
                'description' => '<p>Cam Jansen and her friend Eric are visiting an amusement park with her aunt and uncle. Bumper cars and the Haunted House are exciting enough, but then Aunt Katie\'s wallet is stolen. Who could have taken it? Does Cam, with her amazing photographic memory, have a ghost of a chance at finding the thief?</p>',
                'isbn' => '0590216945',
                'cover_image' => 'haunted.jpg'
            ],
            [
                'id' => 5,
                'level_id' => 2,
                'title' => 'Cam Jansen and the Mystery of the Stolen Corn Popper',
                'description' => '<p>When a customer realizes that his shopping bag -- containing a newly purchased corn popper-- has been stolen, Cam and Eric put their school supply shopping on hold. Now they\'re looking for something far more mysterious -- a thief!</p>',
                'isbn' => '9780142401781',
                'cover_image' => 'Book_Cam_theStolenCornPopper.jpg'
            ],
            [
                'id' => 6,
                'level_id' => 2,
                'title' => 'A Picture Book of Jesse Owens',
                'description' => '<p>Jesse Owens is considered to be the all-time greatest track-and-field athlete.  In the 1936 Olympic Games, he won four gold medals.</p>',
                'isbn' => '0590494392',
                'cover_image' => 'picture_book_of_jesse_owens_a.jpg'
            ],
            [
                'id' => 7,
                'level_id' => 3,
                'title' => 'The Twits',
                'description' => '<p>Mr. and Mrs. Twit are smelly, ugly, nasty people. They constantly play mean jokes on each other. They consider it fun to torment the animals that live with them. Then one day, their pet monkeys, the Muggle-Wumps, decide to get revenge.</p>',
                'isbn' => '0-14-130107-4',
                'cover_image' => 'twits_the.jpg'
            ],
            [
                'id' => 8,
                'level_id' => 3,
                'title' => 'Fantastic Mr. Fox',
                'description' => '<p>Boggis, Bunce and Bean, the three farmers, are determined to catch Mr. Fox.  Together they come up with many ideas of how to capture him, but nobody can outsmart the Fantastic Mr. Fox!</p>',
                'isbn' => '0140328726',
                'cover_image' => 'fantastic_mr._fox.jpg'
            ],
            [
                'id' => 9,
                'level_id' => 3,
                'title' => 'The Giraffe and the Pelly and Me',
                'description' => '<p>In this humorous story, three animals put their talents together to start a window-washing business.</p>',
                'isbn' => '0439163676',
                'cover_image' => 'giraffe_and_the_pelly_and_me_the.jpg'
            ],
            [
                'id' => 10,
                'level_id' => 4,
                'title' => 'Charlie and the Chocolate Factory',
                'description' => '<p>The wonderful Willie Wonka, owner of the chocolate factory, is sponsoring a contest. There are five Golden Tickets hidden inside Wonka bars. The five lucky people who find them will go on a special tour of Mr. Wonka\'s factory. When Charlie wins the fifth Golden Ticket, he enters the factory with the other winners and experiences a world of wondrous surprises.</p>',
                'isbn' => '9780142410318',
                'cover_image' => 'charlie_and_the_chocolate_factory.jpg'
            ],
            [
                'id' => 11,
                'level_id' => 4,
                'title' => 'Charlie and the Great Glass Elevator',
                'description' => '<p>Charlie Bucket takes off in the flying elevator again with his family and his new friend Willie Wonka. This time they embark on a fantastic journey through outer space. They visit the first space hotel, battle the Vernicious Knids, and even save the world!</p>',
                'isbn' => '9780142410325',
                'cover_image' => 'charlie_and_the_great_glass_elevator.jpg'
            ],
            [
                'id' => 12,
                'level_id' => 4,
                'title' => 'George\'s Marvelous Medicine',
                'description' => '<p>George is left alone in the house with his grouchy grandmother when he suddenly has a marvelous idea. He decides to brew a special medicine to "cure" Grandma of her horrible personality. George finds the most disgusting ingredients and produces his medicine. However, the results of the mixture are an amazing surprise--even to George!</p>',
                'isbn' => '0-590-03274-7',
                'cover_image' => 'georges_marvelous_medicine.jpg'
            ],
            [
                'id' => 13,
                'level_id' => 5,
                'title' => 'Matilda',
                'description' => '<p>Matilda is a genius with horrible parents.  Even at school, there is the headmistress, Miss Trunchbull, a kid-hating bully.  Matilda is determined to get rid of "The Trunchbull" so that the kids can learn and have fun in school.  The only good grown-up in Matilda\'s life is her beloved teacher Miss Honey.</p>',
                'isbn' => '014034294X',
                'cover_image' => 'matilda.jpg'
            ],
            [
                'id' => 14,
                'level_id' => 5,
                'title' => 'James and the Giant Peach',
                'description' => '<p>James\'s parents are dead, and he lives with his two horrible aunts. He wishes he could get away from them. One day he meets a little man who gives him some magic crystals. James trips and accidentally spills the crystals by the old peach tree. The next morning a giant peach is sitting where the crystals had spilled. Suddenly, events begin to occur which change James\'s life forever.</p>',
                'isbn' => '0-14-037424-8',
                'cover_image' => 'james_and_the_giant_peach.gif'
            ],
            [
                'id' => 15,
                'level_id' => 5,
                'title' => 'The BFG',
                'description' => '<p>"BFG" stands for Big Friendly Giant and that\'s exactly who snatches Sophie from her bedroom one night.  The BFG is the giant who brings dreams, and together he and Sophie share quite an adventure.</p>',
                'isbn' => '0-14-130105-8',
                'cover_image' => 'bfg_the.jpg'
            ],
            [
                'id' => 16,
                'level_id' => 6,
                'title' => 'Harry Potter and the Sorcerer\'s Stone',
                'description' => '<p>Harry Potter is living with his horrible aunt and uncle when he receives several mysterious messages inviting him to enroll at Hogwart\'s School for wizards.  When Harry gets to Hogwart\'s, he discovers the truth about himself and begins a new life full of magic, mystery and adventure. </p>',
                'isbn' => '059035342X',
                'cover_image' => 'harry_potter_and_the_sorcerer_s_stone.jpg'
            ],
            [
                'id' => 17,
                'level_id' => 6,
                'title' => 'Harry Potter and the Prisoner of Azkaban',
                'description' => '<p>As Harry Potter begins his third year at Hogwarts, he is disturbed by the news that Sirius Black, the heir apparent to the evil Voldemort has escaped from Azkaban prison. Black has left clues indicating that he is on his way to Hogwarts to get Harry! Soon Harry and his friends are caught up in one of their most challenging and frightening adventures.</p>',
                'isbn' => '439136369',
                'cover_image' => 'harry_potter_and_the_prisoner_of_azkaban.jpg'
            ],
            [
                'id' => 18,
                'level_id' => 6,
                'title' => 'Harry Potter and the Chamber of Secrets',
                'description' => '<p>It is Harry\'s second year at Hogwarts, and new horrors are occurring at the school.  Many of the students have been attacked, and Harry is in danger.</p>',
                'isbn' => '0439064872',
                'cover_image' => 'harry_potter_and_the_chamber_of_secrets.jpg'
            ],
            [
                'id' => 19,
                'level_id' => 7,
                'title' => 'The Crossover',
                'description' => '<p><em>"With a bolt of lightning on my kicks . . .The court is SIZZLING. My sweat is DRIZZLING. Stop all that quivering. Cuz tonight I&rsquo;m delivering,</em>" announces dread-locked, 12-year old Josh Bell. He&nbsp;and his twin brother Jordan&nbsp;are awesome on the&nbsp;court. But Josh has more than basketball in his blood; he\'s got mad beats, too, that tell his family\'s story in verse, in this fast and furious&nbsp;middle grade novel of family and brotherhood from Kwame Alexander.</p>',
                'isbn' => '9780544107717',
                'cover_image' => 'crossover.jpg'
            ],
            [
                'id' => 20,
                'level_id' => 7,
                'title' => 'Booked',
                'description' => '<p><em>"With a bolt of lightning on my kicks . . .The court is SIZZLING. My sweat is DRIZZLING. Stop all that quivering. Cuz tonight I&rsquo;m delivering,</em>" announces dread-locked, 12-year old Josh Bell. He&nbsp;and his twin brother Jordan&nbsp;are awesome on the&nbsp;court. But Josh has more than basketball in his blood; he\'s got mad beats, too, that tell his family\'s story in verse, in this fast and furious&nbsp;middle grade novel of family and brotherhood from Kwame Alexander.</p>',
                'isbn' => '9780544570986',
                'cover_image' => 'booked.jpg'
            ],
            [
                'id' => 21,
                'level_id' => 8,
                'title' => 'Rebound',
                'description' => '<p><em>"With a bolt of lightning on my kicks . . .The court is SIZZLING. My sweat is DRIZZLING. Stop all that quivering. Cuz tonight I&rsquo;m delivering,</em>" announces dread-locked, 12-year old Josh Bell. He&nbsp;and his twin brother Jordan&nbsp;are awesome on the&nbsp;court. But Josh has more than basketball in his blood; he\'s got mad beats, too, that tell his family\'s story in verse, in this fast and furious&nbsp;middle grade novel of family and brotherhood from Kwame Alexander.</p>',
                'isbn' => '978-1783447206',
                'cover_image' => 'rebound.jpg'
            ],
            [
                'id' => 22,
                'level_id' => 8,
                'title' => 'The Hunger Games',
                'description' => '<p>Katniss is a 16-year-old girl living with her mother and younger sister in the poorest district of Panem, the remains of what used be the United States. Long ago the districts waged war on the Capitol and were defeated. As part of the surrender terms, each district agreed to send one boy and one girl to appear in an annual televised event called, "The Hunger Games." The terrain, rules, and level of audience participation may change but one thing is constant: kill or be killed. When Kat\'s sister is chosen by lottery, Kat steps up to go in her place.</p>',
                'isbn' => '0439023521',
                'cover_image' => 'hunger_games_the.jpg'
            ],
            [
                'id' => 23,
                'level_id' => 9,
                'title' => 'The Hobbit',
                'description' => '<p>This wonderful fantasy story takes the reader into the world of the hobbits, little people from Middle-earth. It is the story of one of the hobbits, Bilbo Baggins, who discovers the One Ring of Power and brings it back to his shire.</p>',
                'isbn' => '0345272579',
                'cover_image' => 'hobbit_the.jpg'
            ],
            [
                'id' => 24,
                'level_id' => 9,
                'title' => 'Ender\'s Game',
                'description' => '<p>Once again, the Earth is threatened by the alien "buggers."  The survival of the human species depends on a military genius who can defeat the buggers.  Enter Ender Wiggin.  Brilliant.  Ruthless.  Cunning.  A tactical and strategic master.  And a child.  Recruited for military training by the world government, Ender\'s childhood ends the moment he enters his new home: Battleschool.  Among the elite recruits, Ender proves himself to be a genius among geniuses.  In simulated war games he excels.  But is the pressure and loneliness taking a toll on Ender?  Simulations are one thing.  How will Ender perform in real combat conditions?  After all, Battleschool is just a game.  Right?</p>',
                'isbn' => '0765342294',
                'cover_image' => 'ender_s_game.jpg'
            ],
            [
                'id' => 25,
                'level_id' => 10,
                'title' => 'The Lord of the Rings: Fellowship of the Ring',
                'description' => '<p>This is the first volume in The Lord of the Rings Trilogy.  It explains the fateful power of the One Ring.  The fellowship is formed and the nine members begin their quest.</p>',
                'isbn' => '0345272587',
                'cover_image' => 'fellowship_of_the_ring_the.jpg'
            ],
            [
                'id' => 26,
                'level_id' => 11,
                'title' => 'The Great Gatsby',
                'description' => '<p>In the glitter and romance of the Jazz Age, a young man searches for love and success.</p>',
                'isbn' => '0684717603',
                'cover_image' => 'https://panel.spidersmart.com/upload/images/books/great_gatsby_the.jpg'
            ],
            [
                'id' => 27,
                'level_id' => 12,
                'title' => 'Blink',
                'description' => '<p>Blink is a book about how we think without thinking, about choices that seem to be made in an instant - in the blink of an eye - that actually aren\'t as simple as they seem. Why are some people brilliant decision makers, while others are consistently inept? Why do some people follow their instincts and win, while others end up stumbling into error? How do our brains really work - in the office, in the classroom, in the kitchen, and in the bedroom? And why are the best decisions often those that are impossible to explain to others?</p>',
                'isbn' => '0316172324',
                'cover_image' => 'blink.jpg'
            ],
            [
                'id' => 28,
                'level_id' => 30,
                'title' => 'Elmo Says Achoo!',
                'description' => '<p>Elmo has an itchy nose - what will he do?  Say Achoo!</p>',
                'isbn' => '9780375803116',
                'cover_image' => 'achoo.jpg'
            ],
            [
                'id' => 29,
                'level_id' => 31,
                'title' => 'Happy Birthday, Thomas',
                'description' => '<p>It\'s Thomas\'s birthday, but will he make it home in time to celebrate?</p>',
                'isbn' => '9780679808091',
                'cover_image' => 'happy_bday_thomas.jpg'
            ],
            [
                'id' => 30,
                'level_id' => 32,
                'title' => 'Dragon\'s Scales',
                'description' => '<p>What are those scaly things on that dragon?  They\'re scales of course.</p>',
                'isbn' => '0679883819',
                'cover_image' => 'dragon_s_scales.jpg'
            ],
            [
                'id' => 31,
                'level_id' => 33,
                'title' => 'Choppers!',
                'description' => '<p>Trucks, cars, and choppers!  What makes them different?</p>',
                'isbn' => '0375825177',
                'cover_image' => 'choppers.jpg'
            ],
        ]);

        DB::table('book_author')->insert([
            [ 'book_id' => 1, 'author_id' => 2 ],
            [ 'book_id' => 2, 'author_id' => 2 ],
            [ 'book_id' => 3, 'author_id' => 2 ],
            [ 'book_id' => 4, 'author_id' => 3 ],
            [ 'book_id' => 5, 'author_id' => 3 ],
            [ 'book_id' => 6, 'author_id' => 3 ],
            [ 'book_id' => 7, 'author_id' => 1 ],
            [ 'book_id' => 8, 'author_id' => 1 ],
            [ 'book_id' => 9, 'author_id' => 1 ],
            [ 'book_id' => 10, 'author_id' => 1 ],
            [ 'book_id' => 11, 'author_id' => 1 ],
            [ 'book_id' => 12, 'author_id' => 1 ],
            [ 'book_id' => 13, 'author_id' => 1 ],
            [ 'book_id' => 14, 'author_id' => 1 ],
            [ 'book_id' => 15, 'author_id' => 1 ],
            [ 'book_id' => 16, 'author_id' => 4 ],
            [ 'book_id' => 17, 'author_id' => 4 ],
            [ 'book_id' => 18, 'author_id' => 4 ],
            [ 'book_id' => 19, 'author_id' => 5 ],
            [ 'book_id' => 20, 'author_id' => 5 ],
            [ 'book_id' => 21, 'author_id' => 5 ],
            [ 'book_id' => 22, 'author_id' => 6 ],
            [ 'book_id' => 23, 'author_id' => 9 ],
            [ 'book_id' => 24, 'author_id' => 7 ],
            [ 'book_id' => 25, 'author_id' => 9 ],
            [ 'book_id' => 26, 'author_id' => 9 ],
            [ 'book_id' => 27, 'author_id' => 10 ],
            [ 'book_id' => 28, 'author_id' => 11 ],
            [ 'book_id' => 29, 'author_id' => 2 ],
            [ 'book_id' => 30, 'author_id' => 2 ],
            [ 'book_id' => 31, 'author_id' => 2 ]
        ]);

        DB::table('book_genre')->insert([
            [ 'book_id' => 1, 'genre_id' => 1 ],
            [ 'book_id' => 1, 'genre_id' => 8 ],
            [ 'book_id' => 2, 'genre_id' => 1 ],
            [ 'book_id' => 2, 'genre_id' => 8 ],
            [ 'book_id' => 3, 'genre_id' => 1 ],
            [ 'book_id' => 3, 'genre_id' => 8 ],
            [ 'book_id' => 4, 'genre_id' => 1 ],
            [ 'book_id' => 4, 'genre_id' => 8 ],
            [ 'book_id' => 4, 'genre_id' => 5 ],
            [ 'book_id' => 5, 'genre_id' => 1 ],
            [ 'book_id' => 5, 'genre_id' => 8 ],
            [ 'book_id' => 5, 'genre_id' => 5 ],
            [ 'book_id' => 6, 'genre_id' => 2 ],
            [ 'book_id' => 6, 'genre_id' => 7 ],
            [ 'book_id' => 6, 'genre_id' => 8 ],
            [ 'book_id' => 7, 'genre_id' => 1 ],
            [ 'book_id' => 7, 'genre_id' => 8 ],
            [ 'book_id' => 7, 'genre_id' => 3 ],
            [ 'book_id' => 8, 'genre_id' => 1 ],
            [ 'book_id' => 8, 'genre_id' => 8 ],
            [ 'book_id' => 8, 'genre_id' => 3 ],
            [ 'book_id' => 9, 'genre_id' => 1 ],
            [ 'book_id' => 9, 'genre_id' => 8 ],
            [ 'book_id' => 9, 'genre_id' => 3 ],
            [ 'book_id' => 10, 'genre_id' => 1 ],
            [ 'book_id' => 10, 'genre_id' => 8 ],
            [ 'book_id' => 10, 'genre_id' => 3 ],
            [ 'book_id' => 11, 'genre_id' => 1 ],
            [ 'book_id' => 11, 'genre_id' => 8 ],
            [ 'book_id' => 11, 'genre_id' => 3 ],
            [ 'book_id' => 12, 'genre_id' => 1 ],
            [ 'book_id' => 12, 'genre_id' => 8 ],
            [ 'book_id' => 12, 'genre_id' => 3 ],
            [ 'book_id' => 13, 'genre_id' => 1 ],
            [ 'book_id' => 13, 'genre_id' => 8 ],
            [ 'book_id' => 13, 'genre_id' => 3 ],
            [ 'book_id' => 14, 'genre_id' => 1 ],
            [ 'book_id' => 14, 'genre_id' => 8 ],
            [ 'book_id' => 14, 'genre_id' => 3 ],
            [ 'book_id' => 15, 'genre_id' => 1 ],
            [ 'book_id' => 15, 'genre_id' => 8 ],
            [ 'book_id' => 15, 'genre_id' => 3 ],
            [ 'book_id' => 16, 'genre_id' => 1 ],
            [ 'book_id' => 16, 'genre_id' => 3 ],
            [ 'book_id' => 16, 'genre_id' => 4 ],
            [ 'book_id' => 17, 'genre_id' => 1 ],
            [ 'book_id' => 17, 'genre_id' => 3 ],
            [ 'book_id' => 17, 'genre_id' => 4 ],
            [ 'book_id' => 18, 'genre_id' => 1 ],
            [ 'book_id' => 18, 'genre_id' => 3 ],
            [ 'book_id' => 18, 'genre_id' => 4 ],
            [ 'book_id' => 19, 'genre_id' => 1 ],
            [ 'book_id' => 19, 'genre_id' => 3 ],
            [ 'book_id' => 19, 'genre_id' => 12 ],
            [ 'book_id' => 20, 'genre_id' => 1 ],
            [ 'book_id' => 20, 'genre_id' => 3 ],
            [ 'book_id' => 20, 'genre_id' => 12 ],
            [ 'book_id' => 21, 'genre_id' => 1 ],
            [ 'book_id' => 21, 'genre_id' => 3 ],
            [ 'book_id' => 21, 'genre_id' => 12 ],
            [ 'book_id' => 22, 'genre_id' => 1 ],
            [ 'book_id' => 22, 'genre_id' => 3 ],
            [ 'book_id' => 22, 'genre_id' => 4 ],
            [ 'book_id' => 23, 'genre_id' => 1 ],
            [ 'book_id' => 23, 'genre_id' => 3 ],
            [ 'book_id' => 23, 'genre_id' => 4 ],
            [ 'book_id' => 24, 'genre_id' => 1 ],
            [ 'book_id' => 24, 'genre_id' => 3 ],
            [ 'book_id' => 24, 'genre_id' => 4 ],
            [ 'book_id' => 25, 'genre_id' => 1 ],
            [ 'book_id' => 25, 'genre_id' => 3 ],
            [ 'book_id' => 25, 'genre_id' => 4 ],
            [ 'book_id' => 26, 'genre_id' => 1 ],
            [ 'book_id' => 26, 'genre_id' => 10 ],
            [ 'book_id' => 26, 'genre_id' => 11 ],
            [ 'book_id' => 26, 'genre_id' => 7 ],
            [ 'book_id' => 27, 'genre_id' => 2 ],
            [ 'book_id' => 27, 'genre_id' => 11 ],
            [ 'book_id' => 28, 'genre_id' => 1 ],
            [ 'book_id' => 28, 'genre_id' => 8 ],
            [ 'book_id' => 29, 'genre_id' => 1 ],
            [ 'book_id' => 29, 'genre_id' => 8 ],
            [ 'book_id' => 30, 'genre_id' => 1 ],
            [ 'book_id' => 30, 'genre_id' => 8 ],
            [ 'book_id' => 31, 'genre_id' => 1 ],
            [ 'book_id' => 31, 'genre_id' => 8 ]
        ]);

        DB::table('book_publisher')->insert([
            [ 'book_id' => 1, 'publisher_id' => 3 ],
            [ 'book_id' => 2, 'publisher_id' => 3 ],
            [ 'book_id' => 3, 'publisher_id' => 3 ],
            [ 'book_id' => 4, 'publisher_id' => 2 ],
            [ 'book_id' => 5, 'publisher_id' => 2 ],
            [ 'book_id' => 6, 'publisher_id' => 4 ],
            [ 'book_id' => 7, 'publisher_id' => 1 ],
            [ 'book_id' => 8, 'publisher_id' => 1 ],
            [ 'book_id' => 9, 'publisher_id' => 1 ],
            [ 'book_id' => 10, 'publisher_id' => 1 ],
            [ 'book_id' => 11, 'publisher_id' => 1 ],
            [ 'book_id' => 12, 'publisher_id' => 1 ],
            [ 'book_id' => 13, 'publisher_id' => 1 ],
            [ 'book_id' => 14, 'publisher_id' => 1 ],
            [ 'book_id' => 15, 'publisher_id' => 1 ],
            [ 'book_id' => 16, 'publisher_id' => 1 ],
            [ 'book_id' => 17, 'publisher_id' => 1 ],
            [ 'book_id' => 18, 'publisher_id' => 1 ],
            [ 'book_id' => 19, 'publisher_id' => 4 ],
            [ 'book_id' => 20, 'publisher_id' => 4 ],
            [ 'book_id' => 21, 'publisher_id' => 4 ],
            [ 'book_id' => 22, 'publisher_id' => 3 ],
            [ 'book_id' => 23, 'publisher_id' => 2 ],
            [ 'book_id' => 24, 'publisher_id' => 1 ],
            [ 'book_id' => 25, 'publisher_id' => 2 ],
            [ 'book_id' => 26, 'publisher_id' => 2 ],
            [ 'book_id' => 27, 'publisher_id' => 4 ],
            [ 'book_id' => 28, 'publisher_id' => 3 ],
            [ 'book_id' => 29, 'publisher_id' => 3 ],
            [ 'book_id' => 30, 'publisher_id' => 3 ],
            [ 'book_id' => 31, 'publisher_id' => 3 ],
        ]);
    }
}
