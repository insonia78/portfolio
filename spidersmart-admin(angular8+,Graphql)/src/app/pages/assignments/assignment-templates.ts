import { AssignmentSection } from '@spidersmart/ng';

export const AssignmentTemplates = {
    blank: {
        sections: <AssignmentSection[]>[
            {
                title: 'New Section',
                instructions: '',
                questions: []
            }
        ]
    },
    readingWriting: {
        sections: <AssignmentSection[]>[
            {
                title: 'Vocabulary',
                instructions: '',
                questions: [
                    {
                        type:  'vocab',
                        question: ''
                    },
                    {
                        type:  'vocab',
                        question: ''
                    },
                    {
                        type:  'vocab',
                        question: ''
                    },
                    {
                        type:  'vocab',
                        question: ''
                    },
                    {
                        type:  'vocab',
                        question: ''
                    }
                ]
            },
            {
                title: 'Reading Comprehension',
                instructions: '',
                questions: [
                    {
                        type: 'short_answer',
                        question: '',
                    },
                    {
                        type: 'short_answer',
                        question: '',
                    },
                    {
                        type: 'short_answer',
                        question: '',
                    }
                ]
            },
            {
                title: 'Essay',
                instructions: '',
                questions: [
                    {
                        type: 'essay',
                        question: ''
                    }
                ]
            }
        ]
    }
};
