const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuestionSchema = new Schema({
    question: String,
    question_options: [{
        type: String,
    }],
    correct_answer: String,
    updated_at: { type: Date }
});

module.exports = mongoose.model('Questionnaire',QuestionSchema);