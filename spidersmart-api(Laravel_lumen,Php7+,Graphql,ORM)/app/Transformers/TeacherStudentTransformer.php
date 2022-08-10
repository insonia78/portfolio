<?php

namespace App\Transformers;

use App\Models\Relationships\TeacherStudent;
use League\Fractal\Resource\Item;

class TeacherStudentTransformer extends BaseTransformer
{


    /**
     * Transform the given entity into a data array
     * @param TeacherStudent $teacherStudent
     * @return array The transformed data
     */
    public function transform(TeacherStudent $teacherStudent): array
    {
        $student = $this->getCurrentScope()->getManager()->createData($this->item($teacherStudent->getStudent(), new StudentTransformer()))->toArray();
        return $this->parseTransformer($teacherStudent, array_merge(
            $student,
            [
                'relatedFrom' => $this->formatDate($teacherStudent->getDateFrom()),
                'relatedTo' => $this->formatDate($teacherStudent->getDateTo())
            ]
        ));
    }
}
