const Questions = require('../model/questions.model');
const jwtDecode = require('jwt-decode');


function addQuestions(req, res) {
    const decode = jwtDecode(req.token);
    const role = decode.role;

    if (role == 'admin'){
        // Get Questions and insert in database
        const question = new Questions({
            question: req.body.question,
            question_options: req.body.question_options,
            correct_answer: req.body.correct_answer,
            updated_at: new Date()
        })

        question.save()
            .then(result => {
                console.log("result",result);
                res.status(201).json({
                    message: 'Question has been added successfully'
                });
            })
            .catch(err => console.log(err.message))
    }else {
        res.status(403).send("Not authorised")
    }
}

async function getQuestions()
{
    return await
        Questions.find({},{correct_answer:0, updated_at:0, __v:0});
}

async function checkScore(data)
{
    try {
        let score = 0;
        for (let i=0 ; i<= data.length -1; i++){

            const userAnswer = data[i].submitted_answer;
            const answer = await Questions.findOne({_id:data[i]._id},{correct_answer:1});

            if (userAnswer == answer.correct_answer){
                score = score + 1;
            }
        }
        return score;
    }
    catch(error) {
        console.log(error.message);
    }

}

module.exports = {
    checkScore,
    getQuestions,
    addQuestions
}