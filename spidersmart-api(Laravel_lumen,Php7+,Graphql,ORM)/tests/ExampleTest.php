<?php

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testModelExample()
    {
        $user = entity(App\Models\Entities\Primary\User::class)->make(['firstName' => 'Taylor']);
        $this->assertEquals('Taylor', $user->getFirstName());
    }

/*    public function testRestRoute()
    {
        $response = $this->call('GET', '/centers/1');
        $this->assertEquals(200, $response->status());
    }

    public function testRestGetAllResponse()
    {
        $this->get('/centers', [])->seeJsonStructure([
            [
               'id',
                'name'
            ]
        ]);
    }

    public function testRestGetResponse()
    {
        $this->get('/centers/1', [])->seeJsonStructure([
            'id',
            'label',
            'name'
        ]);
    }*/


//    public function testRestPost()
//    {
//        $this->call('POST','/centers',[
//            'name' => 'Test Center',
//            'label' => 'test-center',
//            'type' => 'local',
//            'streetAddress' => '123 Street',
//            'city' => 'Lubbock',
//            'state' => 'TX',
//            'country' => 'US',
//            'postalCode' => '44556',
//            'phone' => '3334445555',
//            'email' => 'test@spidersmart.com'
//        ]);
//        // do something
//    }


    public function testQueryExample()
    {
        $this->graphql("
            query centers {
                centers {
                    data {
                        id
                        name 
                    } 
                    metadata { 
                        count 
                    }
                }
            }
        ");

        $this->seeJsonStructure([
            'data' => [
                'centers' => [
                    'data' => [
                        [
                            'id',
                            'name'
                        ]
                    ],
                    'metadata' => [
                        'count'
                    ]
                ]
            ]
        ]);
    }
}
